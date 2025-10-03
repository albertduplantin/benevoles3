# 📝 Commandes Importantes à Retenir

## ⚠️ Commandes Nécessitant une Interaction (À EXÉCUTER MANUELLEMENT)

Certaines commandes npm nécessitent une confirmation (y/n). Voici la liste complète avec les réponses à donner :

### 1. Installer un composant shadcn/ui

```bash
npx shadcn@latest add button
# Réponse : Y (Yes) quand demandé "Ok to proceed?"
```

**Composants à installer pour la Phase 1** :
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add avatar
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
npx shadcn@latest add badge
```

**Réponse à chaque fois** : `Y` (ou `y`) puis Entrée

### 2. Initialiser Husky (Pre-commit hooks)

```bash
npm run prepare
```

Pas de confirmation nécessaire, mais à exécuter une fois.

### 3. Créer un nouveau package (si besoin)

```bash
npm init
# Réponses : Appuyez sur Entrée pour accepter les valeurs par défaut
```

## ✅ Commandes Standards (Pas de confirmation)

Ces commandes peuvent être exécutées directement :

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build production
npm run build

# Démarrer le serveur production (après build)
npm run start

# Linter
npm run lint

# Formater le code
npm run format

# Vérifier le formatage sans modifier
npm run format:check
```

### Installation de Packages

```bash
# Installer un nouveau package
npm install nom-du-package

# Installer en dev dependency
npm install -D nom-du-package

# Réinstaller toutes les dépendances
npm install
```

### Git

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit avec message
git commit -m "feat: votre message"

# Ajouter remote origin (remplacez l'URL)
git remote add origin https://github.com/votre-username/festival-benevoles.git

# Push vers GitHub
git push -u origin main

# Pull les changements
git pull origin main

# Créer une nouvelle branche
git checkout -b nom-de-la-branche

# Voir le statut
git status

# Voir l'historique
git log
```

## 🔧 Packages Déjà Installés

Vous n'avez PAS besoin de réinstaller ces packages :

- ✅ next
- ✅ react
- ✅ react-dom
- ✅ typescript
- ✅ tailwindcss
- ✅ firebase
- ✅ firebase-admin
- ✅ @tanstack/react-query
- ✅ zod
- ✅ react-hook-form
- ✅ @hookform/resolvers
- ✅ date-fns
- ✅ eslint
- ✅ prettier
- ✅ husky
- ✅ lint-staged

## 📦 Packages à Installer Plus Tard (Selon Phase)

### Phase 5 - Dashboards
```bash
npm install recharts  # Pour les graphiques
npm install react-big-calendar  # Pour le calendrier
npm install @types/react-big-calendar -D
```

### Phase 7 - Exports
```bash
npm install jspdf  # Pour PDF
npm install xlsx  # Pour Excel
npm install @types/jspdf -D
```

### Phase 8 - PWA
```bash
npm install @ducanh2912/next-pwa  # Pour PWA
```

### Phase 11 - Tests
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

### Phase 12 - Animations
```bash
npm install framer-motion  # Pour animations
```

## 🚨 Commandes à NE JAMAIS Exécuter

```bash
# ❌ Ne pas forcer un push sur main
git push --force origin main

# ❌ Ne pas désactiver les hooks
git commit --no-verify

# ❌ Ne pas installer firebase deux fois
npm install firebase  # (déjà installé)

# ❌ Ne pas supprimer node_modules sans raison
rm -rf node_modules  # (utilisez plutôt npm ci pour réinstaller)
```

## 🔄 En Cas de Problème

### Reset complet des dépendances
```bash
# Supprimer node_modules et package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Réinstaller proprement
npm install
```

### Nettoyer le cache Next.js
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Nettoyer le cache npm
```bash
npm cache clean --force
npm install
```

## 📝 Conventions de Commit

Utilisez ces préfixes pour vos commits :

```bash
git commit -m "feat: ajout de la fonctionnalité X"        # Nouvelle fonctionnalité
git commit -m "fix: correction du bug Y"                  # Correction de bug
git commit -m "docs: mise à jour du README"               # Documentation
git commit -m "style: formatage du code"                  # Formatage (sans changement logique)
git commit -m "refactor: refactorisation de Z"            # Refactoring
git commit -m "test: ajout de tests"                      # Tests
git commit -m "chore: mise à jour des dépendances"        # Maintenance
```

## 🔍 Commandes de Diagnostic

### Vérifier les versions
```bash
node --version      # Doit être >= 18
npm --version       # Doit être >= 9
```

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

### Lister les packages installés
```bash
npm list --depth=0
```

### Vérifier les packages obsolètes
```bash
npm outdated
```

### Mettre à jour les packages (avec prudence)
```bash
npm update          # Met à jour selon package.json
```

## 🎯 Workflow Recommandé

### Démarrage Quotidien
```bash
# 1. Pull les derniers changements
git pull origin main

# 2. Installer les nouvelles dépendances (si package.json a changé)
npm install

# 3. Démarrer le serveur
npm run dev
```

### Avant de Commit
```bash
# 1. Vérifier le linting
npm run lint

# 2. Formater le code
npm run format

# 3. Vérifier les erreurs TypeScript
npx tsc --noEmit

# 4. Commit (Husky exécutera les hooks automatiquement)
git add .
git commit -m "feat: description"
```

### Fin de Journée
```bash
# 1. Commit et push
git add .
git commit -m "feat: travail du jour"
git push origin main

# 2. Arrêter le serveur (Ctrl+C)
```

## 📞 En Cas d'Erreur

### Erreur : "Port 3000 already in use"
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacez PID par le numéro trouvé)
taskkill /PID <PID> /F

# Ou changer de port
npm run dev -- -p 3001
```

### Erreur : "Module not found"
```bash
# Réinstaller les dépendances
npm install

# Si ça persiste, reset complet
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Erreur : "Firebase not configured"
```bash
# Vérifier que .env.local existe et contient les bonnes clés
# Redémarrer le serveur après modification de .env.local
```

---

**💡 Conseil** : Gardez ce fichier sous la main pendant le développement !

Pour toute commande qui demande une confirmation et que vous devez exécuter manuellement, référez-vous à ce guide. 🚀

