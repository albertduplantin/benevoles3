# 📱 Guide PWA - Festival Films Courts de Dinan

## ✅ Fonctionnalités PWA Implémentées

### 🎯 **1. Installation Progressive**
- ✅ Banner d'installation automatique après 5 secondes
- ✅ Bouton d'installation dans le header (desktop)
- ✅ Détection si déjà installé (mode standalone)
- ✅ Gestion de l'événement `beforeinstallprompt`

### 📦 **2. Service Worker**
- ✅ Configuration avec `@ducanh2912/next-pwa`
- ✅ Désactivé en développement
- ✅ Activé en production
- ✅ Cache intelligent (fonts, images, CSS, JS, data)

### 🔄 **3. Cache Strategy**

#### **CacheFirst** (Assets statiques)
- Fonts Google
- Audio/Vidéo
- Chargement le plus rapide possible

#### **StaleWhileRevalidate** (Contenu dynamique)
- Images
- CSS/JS
- Stylesheets
- Next.js data

#### **NetworkFirst** (Données en temps réel)
- API routes
- JSON/XML/CSV
- Pages

### 🌐 **4. Mode Hors Ligne**
- ✅ Page de fallback `/offline.html`
- ✅ Indicateur de statut réseau
- ✅ Détection automatique de reconnexion
- ✅ Messages d'erreur adaptés

### 📲 **5. Manifest.json Complet**
- ✅ Icônes multiples (72px → 512px)
- ✅ Shortcuts (accès rapide missions/calendrier)
- ✅ Screenshots
- ✅ Métadonnées complètes
- ✅ Theme color: `#2563eb` (bleu)

### 🎨 **6. Icônes PWA**
Tailles disponibles :
- 72×72, 96×96, 128×128, 144×144
- 152×152, 192×192, 384×384, 512×512

---

## 🚀 Installation des Icônes

### **Méthode 1 : Générateur HTML**
```bash
# Ouvrir le fichier dans votre navigateur
scripts/generate-pwa-icons.html
```

1. Le fichier générera automatiquement toutes les icônes
2. Cliquez sur "Télécharger tout"
3. Placez les fichiers PNG dans `public/`

### **Méthode 2 : Utiliser vos propres icônes**
- Créez des icônes aux tailles requises
- Format: `icon-{size}x{size}.png`
- Placez-les dans `public/`

---

## 🧪 Tester la PWA

### **1. En développement (localhost)**
```bash
npm run dev
```

**Note** : Le Service Worker est désactivé en dev pour éviter les problèmes de cache.

### **2. En production (build local)**
```bash
npm run build
npm start
```

Puis :
1. Ouvrir dans Chrome : `http://localhost:3000`
2. Ouvrir DevTools → Application → Manifest
3. Vérifier les icônes et métadonnées
4. Application → Service Workers (vérifier qu'il est actif)

### **3. Test d'installation**

#### **Desktop (Chrome/Edge)**
1. Icône "Installer" apparaît dans l'omnibar
2. Ou cliquez sur le bouton "Installer l'app" dans le header
3. Accepter l'installation
4. L'app s'ouvre dans une fenêtre standalone

#### **Android**
1. Menu → "Ajouter à l'écran d'accueil"
2. Banner d'installation apparaît automatiquement
3. Suivre les instructions

#### **iOS (Safari)**
1. Menu Partager → "Sur l'écran d'accueil"
2. Nommer l'app
3. Ajouter

### **4. Test du mode hors ligne**

#### **Méthode 1 : DevTools**
1. DevTools → Network
2. Cocher "Offline"
3. Rafraîchir la page
4. Vérifier que la page de fallback s'affiche

#### **Méthode 2 : Mode avion**
1. Activer le mode avion
2. Ouvrir l'app
3. Vérifier le fonctionnement

---

## 📊 Vérification PWA

### **Lighthouse Audit**
```bash
# Ouvrir DevTools → Lighthouse
# Sélectionner "Progressive Web App"
# Lancer l'audit
```

**Score cible** : 100/100 ✅

### **Checklist PWA**
- ✅ Manifest valide
- ✅ Service Worker enregistré
- ✅ HTTPS (en production)
- ✅ Icônes multiples
- ✅ Theme color
- ✅ Mode standalone
- ✅ Fallback hors ligne

---

## 🔧 Configuration Avancée

### **Personnaliser le cache**
Modifier `next.config.ts` :

```typescript
runtimeCaching: [
  {
    urlPattern: /\/api\/missions/,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-missions",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 heure
      },
    },
  },
]
```

### **Désactiver le Service Worker**
```typescript
// next.config.ts
disable: true, // ou process.env.NODE_ENV === "development"
```

---

## 📝 Déploiement

### **Vercel (recommandé)**
```bash
vercel --prod
```

✅ HTTPS automatique
✅ Service Worker fonctionnel
✅ Cache optimisé

### **Autres plateformes**
- ⚠️ **HTTPS obligatoire** pour le Service Worker
- ⚠️ Vérifier que les headers permettent le cache
- ⚠️ Tester l'installation sur différents devices

---

## 🐛 Troubleshooting

### **Le Service Worker ne s'installe pas**
1. Vérifier que vous êtes en **production** (`npm run build && npm start`)
2. Ouvrir DevTools → Application → Service Workers
3. Vérifier les erreurs dans la console
4. Forcer l'update : "Update on reload"

### **Les icônes ne s'affichent pas**
1. Vérifier que les fichiers existent dans `public/`
2. Vider le cache : DevTools → Application → Clear storage
3. Vérifier le manifest : DevTools → Application → Manifest

### **Le banner d'installation n'apparaît pas**
1. Vérifier que l'app n'est pas déjà installée
2. Chrome : Paramètres → Applications → Désinstaller
3. Attendre 5 secondes après le chargement
4. Vérifier la console pour les erreurs

### **Le mode hors ligne ne fonctionne pas**
1. Vérifier que le Service Worker est actif
2. Tester avec DevTools → Network → Offline
3. Vérifier que `offline.html` existe
4. Consulter les logs du Service Worker

---

## 📱 Fonctionnalités Hors Ligne

### **Disponibles** ✅
- Pages déjà visitées (en cache)
- Images/CSS/JS en cache
- Navigation dans l'app
- Consultation du profil (si déjà chargé)

### **Non disponibles** ❌
- Inscription à de nouvelles missions (nécessite Firestore)
- Mise à jour des données
- Envoi de formulaires
- Chargement de nouvelles images

### **Future** 🚀 (Phase suivante)
- Synchronisation en arrière-plan
- Notifications push
- Badge count
- Background sync pour les inscriptions

---

## 🎯 Prochaines Étapes

### **Phase PWA Avancée** (optionnelle)
1. **Background Sync** → Synchroniser les actions hors ligne
2. **Push Notifications** → Alertes missions urgentes
3. **Periodic Sync** → Mise à jour automatique
4. **Share API** → Partager des missions
5. **Shortcuts dynamiques** → Missions récentes

### **Optimisations**
1. Pre-cache des pages critiques
2. Cache des données Firestore (IndexedDB)
3. Lazy loading des images
4. Compression des assets

---

## 📚 Ressources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [next-pwa GitHub](https://github.com/DuCanh2k/next-pwa)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## ✅ Checklist de Validation

Avant de déployer en production :

- [ ] Toutes les icônes PWA générées et placées dans `public/`
- [ ] Lighthouse PWA score > 90
- [ ] Testé l'installation sur Chrome/Edge
- [ ] Testé l'installation sur Android
- [ ] Testé le mode hors ligne
- [ ] Vérifié que le Service Worker est actif en prod
- [ ] Testé sur HTTPS (Vercel)
- [ ] Vérifié les shortcuts dans le manifest
- [ ] Testé l'indicateur de réseau
- [ ] Vérifié que la page offline.html est accessible

---

**🎬 Votre application est maintenant une PWA complète !**

