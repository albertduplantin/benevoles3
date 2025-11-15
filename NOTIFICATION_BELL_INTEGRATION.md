# 🔔 Intégration du Composant NotificationBell

## Composants Créés

### 1. Hook `useFirestoreNotifications`
**Fichier** : `hooks/useNotifications.ts`

**Note** : Renommé en `useFirestoreNotifications` pour éviter le conflit avec le hook `useNotifications` existant (notifications push navigateur)

**Fonctionnalités** :
- ✅ Écoute en temps réel des notifications Firestore
- ✅ Filtre par userId
- ✅ Compteur de notifications non lues
- ✅ Fonction `markAsRead(notificationId)`
- ✅ Fonction `markAllAsRead()`

### 2. Composant `NotificationBell`
**Fichier** : `components/features/notifications/notification-bell.tsx`

**Fonctionnalités** :
- ✅ Icône de cloche avec badge de compteur
- ✅ Popover avec liste des notifications
- ✅ Affichage uniquement pour admin et category_responsible
- ✅ Notification non lue : fond bleu
- ✅ Clic sur notification : marque comme lue et redirige vers la mission
- ✅ Bouton "Tout marquer comme lu"

---

## 📦 Installation

### Dépendances Requises

Vérifier que ces packages sont installés :

```bash
npm install date-fns
```

---

## 🔌 Intégration dans le Header

### Option 1 : Layout Principal

**Fichier à modifier** : `app/dashboard/layout.tsx` (ou équivalent)

```tsx
import { NotificationBell } from '@/components/features/notifications/notification-bell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center justify-between p-4">
        <div>
          {/* Logo et navigation */}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Ajouter le composant ici */}
          <NotificationBell />
          
          {/* Autres éléments du header (profil, etc.) */}
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
}
```

### Option 2 : Composant Header Existant

Si vous avez un composant Header séparé :

**Fichier** : `components/layout/header.tsx`

```tsx
import { NotificationBell } from '@/components/features/notifications/notification-bell';

export function Header() {
  return (
    <header className="...">
      {/* ... autres éléments ... */}
      
      <div className="flex items-center gap-3">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
```

---

## 🎨 Personnalisation

### Modifier les Couleurs

**Fichier** : `components/features/notifications/notification-bell.tsx`

```tsx
// Badge de compteur
<Badge
  variant="destructive"  // Changer ici : "default" | "secondary" | "destructive" | "outline"
  className="..."
>
  {unreadCount}
</Badge>

// Fond des notifications non lues
<div className={`... ${!notification.read ? 'bg-blue-50' : ''}`}>
  {/* Changer bg-blue-50 pour une autre couleur */}
</div>
```

### Modifier la Taille du Popover

```tsx
<PopoverContent className="w-96 p-0" align="end">
  {/* Changer w-96 pour w-80, w-[500px], etc. */}
</PopoverContent>
```

### Modifier la Hauteur de la Liste

```tsx
<ScrollArea className="h-[400px]">
  {/* Changer h-[400px] pour h-[300px], h-[500px], etc. */}
</ScrollArea>
```

---

## 🧪 Tests

### Test 1 : Affichage du Badge

1. Se connecter en tant qu'admin
2. Vérifier que l'icône de cloche apparaît dans le header
3. S'inscrire à une mission (avec un autre compte)
4. Vérifier que le badge rouge avec le chiffre "1" apparaît

### Test 2 : Liste des Notifications

1. Cliquer sur l'icône de cloche
2. Vérifier que le popover s'ouvre
3. Vérifier que la notification apparaît avec fond bleu
4. Vérifier le texte : "Jean Dupont s'est inscrit(e) à la mission 'Accueil'"

### Test 3 : Marquer comme Lu

1. Cliquer sur une notification
2. Vérifier que le fond bleu disparaît
3. Vérifier que le compteur diminue
4. Vérifier la redirection vers la mission

### Test 4 : Tout Marquer comme Lu

1. Avoir plusieurs notifications non lues
2. Cliquer sur "Tout marquer comme lu"
3. Vérifier que toutes les notifications deviennent blanches
4. Vérifier que le badge disparaît

---

## 🔒 Sécurité

### Règles Firestore (déjà en place)

```javascript
match /notifications/{notificationId} {
  allow read: if isAuthenticated() && request.auth.uid == resource.data.userId;
  // Seul l'utilisateur concerné peut lire ses notifications
}
```

### Visibilité

Le composant affiche automatiquement :
- ✅ Pour les admins (`role === 'admin'`)
- ✅ Pour les responsables de catégorie (`role === 'category_responsible'`)
- ❌ Masqué pour les bénévoles simples (`role === 'volunteer'`)

---

## 📱 Responsive Design

Le composant est responsive par défaut :

- **Mobile** : Popover s'adapte à la largeur de l'écran
- **Desktop** : Largeur fixe de 384px (`w-96`)

### Ajuster pour Mobile

```tsx
<PopoverContent className="w-96 md:w-80 lg:w-96 p-0" align="end">
  {/* w-96 sur grand écran, w-80 sur tablette */}
</PopoverContent>
```

---

## 🌐 Internationalisation (i18n)

Si vous utilisez i18n, remplacer les textes :

```tsx
import { useTranslation } from 'next-i18next';

export function NotificationBell() {
  const { t } = useTranslation('notifications');
  
  return (
    <div>
      <h3>{t('title')}</h3>
      <Button>{t('markAllAsRead')}</Button>
      <p>{t('noNotifications')}</p>
    </div>
  );
}
```

---

## 🐛 Dépannage

### Le badge n'apparaît pas

**Vérifier** :
1. L'utilisateur est admin ou category_responsible
2. Il y a des notifications avec `read: false` dans Firestore
3. Le champ `userId` correspond bien à l'utilisateur connecté

### Les notifications ne se mettent pas à jour en temps réel

**Vérifier** :
1. Les règles Firestore sont déployées
2. L'index Firestore est créé : `notifications` collection, index sur `userId` + `createdAt`
3. La connexion Firebase fonctionne

### Erreur "Cannot read property 'toDate' of undefined"

**Cause** : Le champ `createdAt` est null

**Solution** : Ajouter une valeur par défaut :
```tsx
createdAt: data.createdAt?.toDate() || new Date(),
```

---

## 🚀 Améliorations Futures

### 1. Sons de Notification

```tsx
const playNotificationSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
};

useEffect(() => {
  if (unreadCount > previousUnreadCount) {
    playNotificationSound();
  }
}, [unreadCount]);
```

### 2. Notifications Push Navigateur

```tsx
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Nouvelle inscription', {
    body: notification.message,
    icon: '/icon.png',
  });
}
```

### 3. Page Dédiée aux Notifications

Créer `/dashboard/notifications` pour afficher toutes les notifications avec :
- Filtres par type
- Pagination
- Recherche
- Export

---

## 📊 Index Firestore Requis

Créer l'index composite dans Firebase Console :

**Collection** : `notifications`

**Champs** :
- `userId` (Ascending)
- `createdAt` (Descending)

**Ou via `firestore.indexes.json`** :

```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Déployer avec :
```bash
firebase deploy --only firestore:indexes
```

---

## ✅ Checklist d'Intégration

- [ ] Hook `useNotifications.ts` créé
- [ ] Composant `NotificationBell.tsx` créé
- [ ] Package `date-fns` installé
- [ ] Composant ajouté au header/layout
- [ ] Index Firestore créé
- [ ] Test avec inscription à une mission
- [ ] Test du badge de compteur
- [ ] Test de marquage comme lu
- [ ] Test responsive mobile
- [ ] Déployé en preview Vercel

---

**Version** : 1.0  
**Date** : 15 Novembre 2025

