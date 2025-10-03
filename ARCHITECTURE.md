# 🏗️ Architecture Technique - Festival Bénévoles

## 📐 Décisions Architecturales

### Stack Technique
- **Frontend Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: 
  - Context API pour l'authentification
  - TanStack Query pour les données serveur
- **Validation**: Zod + React Hook Form
- **Date Handling**: date-fns
- **Hosting**: Vercel

### Organisation des Composants

**Approche choisie**: Feature-based organization

```
components/
├── ui/                    # shadcn/ui components
├── features/              # Feature-specific components
│   ├── auth/             # Authentication related
│   ├── missions/         # Mission management
│   ├── dashboard/        # Dashboard components
│   └── volunteers/       # Volunteer management
├── layouts/              # Layout components
└── providers/            # React Context providers
```

**Rationale**: 
- Meilleure scalabilité
- Facilite la collaboration
- Code mieux organisé par fonctionnalité
- Évite les fichiers trop profondément imbriqués

### Patterns de Rendu

**Approche hybride**:
- **Server Components** par défaut (pages, layouts)
- **Client Components** pour l'interactivité ('use client')

**Exemples**:
```typescript
// Server Component (par défaut)
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Peut faire des requêtes directes
  return <DashboardLayout>...</DashboardLayout>
}

// Client Component (interactivité)
// components/features/missions/mission-form.tsx
'use client';
export function MissionForm() {
  // Hooks, state, events
  return <form>...</form>
}
```

### Gestion d'État

#### 1. État d'Authentification
**Solution**: React Context API

```typescript
// components/providers/auth-provider.tsx
AuthContext → { user, firebaseUser, loading, refreshUser }
```

**Rationale**: 
- État global simple
- Pas besoin de librairie externe
- Réactivité native React

#### 2. État Serveur (Données Firebase)
**Solution**: TanStack Query

```typescript
// Exemple usage
const { data: missions } = useQuery({
  queryKey: ['missions'],
  queryFn: fetchMissions
});
```

**Avantages**:
- Cache automatique
- Invalidation intelligente
- Optimistic updates
- Gestion du loading/error
- Synchronisation en arrière-plan

#### 3. État UI Local
**Solution**: useState / useReducer

**Rationale**: Suffisant pour les cas simples (modals, forms, etc.)

### Structure Firebase

#### Collections Firestore

```
/users/{uid}
  - email: string
  - firstName: string
  - lastName: string
  - phone: string
  - photoURL?: string
  - role: 'volunteer' | 'mission_responsible' | 'admin'
  - createdAt: Timestamp
  - updatedAt?: Timestamp
  - consents: {
      dataProcessing: boolean
      communications: boolean
      consentDate: Timestamp
    }
  - notificationPreferences?: {
      email: boolean
      sms: boolean
    }

/missions/{missionId}
  - title: string
  - description: string
  - type: 'scheduled' | 'ongoing'
  - startDate?: Timestamp
  - endDate?: Timestamp
  - location: string
  - maxVolunteers: number
  - status: 'draft' | 'published' | 'full' | 'cancelled' | 'completed'
  - isUrgent: boolean
  - isRecurrent: boolean
  - createdBy: string (uid)
  - createdAt: Timestamp
  - updatedAt?: Timestamp
  - volunteers: string[] (uids)
  - responsibles: string[] (uids)
  - pendingResponsibles: string[] (uids)

/volunteerRequests/{requestId}
  - missionId: string
  - userId: string
  - status: 'pending' | 'approved' | 'rejected'
  - requestedAt: Timestamp
  - processedAt?: Timestamp
  - processedBy?: string (admin uid)
  - message?: string
```

#### Indexes Firestore à Créer

```
missions:
  - status (ASC), isUrgent (DESC), createdAt (DESC)
  - status (ASC), startDate (ASC)
  - volunteers (ARRAY), status (ASC)

volunteerRequests:
  - status (ASC), requestedAt (DESC)
  - userId (ASC), status (ASC)
```

### Routing & Navigation

#### Structure des Routes

```
app/
├── (public)/              # Routes publiques
│   ├── page.tsx          # Landing page
│   └── missions/
│       └── [id]/page.tsx # Mission publique
├── (auth)/                # Routes d'authentification
│   ├── login/
│   ├── register/
│   └── layout.tsx        # Auth layout
├── (dashboard)/           # Routes protégées
│   ├── dashboard/
│   │   ├── page.tsx      # Dashboard bénévole
│   │   ├── missions/     # Gestion missions (admin)
│   │   ├── volunteers/   # Gestion bénévoles (admin)
│   │   └── profile/      # Profil utilisateur
│   └── layout.tsx        # Dashboard layout avec sidebar
└── api/                   # API Routes
    ├── missions/
    │   ├── [id]/route.ts
    │   └── check-overlap/route.ts
    ├── volunteers/
    └── auth/
```

### Sécurité & Performance

#### 1. Firestore Security Rules
- Principe du moindre privilège
- Validation côté serveur (via API Routes)
- Protection contre les chevauchements horaires

#### 2. Optimisations Firebase
- **Pagination**: Max 50 documents par query
- **Indexes**: Sur les champs fréquemment filtrés
- **Offline persistence**: Activée pour PWA
- **Batch operations**: Pour les opérations multiples

#### 3. Optimisations Next.js
- **Image Optimization**: Automatic via `next/image`
- **Code Splitting**: Automatic avec App Router
- **Server Components**: Réduction du JavaScript client
- **Caching**: Via TanStack Query

#### 4. Budget Firebase (5€/mois)
- ~70 bénévoles attendus
- Reads estimés: ~50k/mois (dans les limites gratuites)
- Storage: <1GB (avatars compressés)
- Stratégie: Utiliser API Routes Next.js plutôt que Cloud Functions

### Validation & Types

#### Flow de Validation

```
User Input → Zod Schema → Type-safe Data → Firebase
```

#### Exemple

```typescript
// 1. Définir le schéma Zod
const missionSchema = z.object({
  title: z.string().min(3),
  // ...
});

// 2. Extraire le type TypeScript
type MissionInput = z.infer<typeof missionSchema>;

// 3. Utiliser dans React Hook Form
const form = useForm<MissionInput>({
  resolver: zodResolver(missionSchema)
});

// 4. Données validées et type-safe
const onSubmit = (data: MissionInput) => {
  // data est garanti valide ici
};
```

### Error Handling

#### Strategy

1. **Boundary Errors**: Error Boundaries React
2. **API Errors**: Try/catch avec messages utilisateur clairs
3. **Firebase Errors**: Mapping vers messages français
4. **Form Errors**: Affichage inline via React Hook Form

#### Exemple Error Boundary

```typescript
// app/error.tsx
'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Une erreur est survenue</h2>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

### Testing Strategy (À implémenter)

#### Tests Critiques Prioritaires

1. **Chevauchements horaires**: Ne pas permettre inscriptions conflictuelles
2. **Missions pleines**: Bloquer si maxVolunteers atteint
3. **Permissions**: Vérifier que les rôles fonctionnent correctement
4. **Suppression compte**: Données anonymisées correctement

#### Stack de Tests (Phase 11)

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Firestore Rules Tests**: Firebase Emulator

### PWA & Offline (Phase 8)

#### Service Worker Strategy

- **Cache-First**: Assets statiques (JS, CSS, images)
- **Network-First**: Données temps réel (missions, users)
- **Offline Fallback**: Page offline élégante

#### Firestore Offline Persistence

```typescript
// Activé dans lib/firebase/config.ts
enableIndexedDbPersistence(db);
```

### Monitoring & Logs

#### En Production
- **Vercel Analytics**: Performance et Core Web Vitals
- **Firebase Console**: Erreurs et usage
- **Sentry** (optionnel): Error tracking avancé

#### En Développement
- Console logs structurés
- React DevTools
- TanStack Query DevTools

---

## 🔄 Évolutions Futures

### Phase 2+
- Notifications Push (Firebase Cloud Messaging)
- Messagerie interne (sous-collection `/messages`)
- Statistiques avancées (heures bénévolat)
- Système de badges/gamification
- Import CSV bénévoles
- Multilingue (i18n avec next-intl)

### Considérations Scalabilité
- **Si >500 bénévoles**: Implémenter pagination agressive
- **Si >1000 missions**: Ajouter recherche full-text (Algolia)
- **Si budget Firebase dépassé**: Migrer API Routes vers Edge Functions
- **Si besoins analytics**: Ajouter Posthog ou Mixpanel

---

**Dernière mise à jour**: Phase 0 - Setup Projet
**Prochaine phase**: Phase 1 - Authentification & Profils

