# TransportConnect - Plateforme de Logistique MERN

TransportConnect est une plateforme web complète permettant à plusieurs rôles (conducteurs, expéditeurs, administrateurs) d'interagir autour de la logistique du transport de marchandises.

## 🚀 Fonctionnalités

### 👥 Utilisateurs
- **Inscription/Connexion** sécurisée avec JWT
- **Gestion de profil** personnalisé
- **Notifications** en temps réel
- **Rôles multiples** : Conducteur, Expéditeur, Administrateur

### 🚛 Conducteurs
- **Création d'annonces** de trajets avec détails complets
- **Gestion des demandes** reçues (acceptation/refus)
- **Historique** des trajets effectués
- **Évaluations** des expéditeurs

### 📦 Expéditeurs
- **Recherche d'annonces** avec filtres avancés
- **Envoi de demandes** de transport
- **Suivi** des demandes envoyées
- **Évaluations** des conducteurs

### 👨‍💼 Administrateurs
- **Dashboard** avec statistiques en temps réel
- **Gestion des utilisateurs** (validation, suspension)
- **Modération des annonces**
- **Statistiques** détaillées avec graphiques

### 💬 Bonus - Chat en temps réel
- **Messagerie instantanée** entre expéditeurs et conducteurs
- **Notifications** push
- **Interface réactive**

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** & **Express.js** - Serveur API
- **MongoDB** & **Mongoose** - Base de données
- **JWT** & **Bcrypt** - Authentification sécurisée
- **Socket.IO** - Communication temps réel
- **Nodemailer** - Envoi d'emails
- **Express-validator** - Validation des données

### Frontend
- **React.js** - Interface utilisateur
- **React Router** - Navigation
- **Tailwind CSS** - Styling moderne
- **React Hook Form** - Gestion des formulaires
- **Axios** - Requêtes HTTP
- **React Chart.js 2** - Graphiques
- **Socket.IO Client** - Communication temps réel

### DevOps
- **Docker** - Conteneurisation
- **PM2** - Gestion des processus
- **Nginx** - Serveur web
- **Jenkins** - CI/CD

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd TransportConnect
```

### 2. Configuration Backend
```bash
cd Backend
npm install
```

Créer un fichier `.env` dans le dossier Backend :
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/transportconnect

# JWT
JWT_SECRET=votre-secret-jwt-super-securise
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app

# Serveur
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Configuration Frontend
```bash
cd frontend
npm install
```

Créer un fichier `.env` dans le dossier frontend :
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Démarrer l'application

#### Backend
```bash
cd Backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## 📁 Structure du Projet

```
TransportConnect/
├── Backend/
│   ├── config/          # Configuration (DB, JWT, Email)
│   ├── controllers/     # Contrôleurs API
│   ├── middleware/      # Middlewares (Auth, Validation)
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   ├── app.js          # Application Express
│   └── server.js       # Serveur principal
├── frontend/
│   ├── src/
│   │   ├── admin/       # Pages administrateur
│   │   ├── auth/        # Authentification
│   │   ├── chat/        # Composants chat
│   │   ├── components/  # Composants réutilisables
│   │   ├── conducteur/  # Pages conducteur
│   │   ├── context/     # Contextes React
│   │   ├── evaluations/ # Pages évaluations
│   │   ├── expediteur/  # Pages expéditeur
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── pages/       # Pages principales
│   │   ├── services/    # Services API
│   │   └── utils/       # Utilitaires
│   └── public/          # Assets statiques
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev      # Démarrage en mode développement
npm start        # Démarrage en production
```

### Frontend
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build pour production
npm run preview  # Prévisualisation du build
```

## 🗄️ Base de Données

Le projet utilise MongoDB avec les collections suivantes :
- **Users** - Utilisateurs (conducteurs, expéditeurs, admins)
- **Annonces** - Annonces de trajets
- **Demandes** - Demandes de transport
- **Evaluations** - Évaluations mutuelles
- **Messages** - Messages de chat

## 🔐 Authentification

L'authentification utilise JWT avec les rôles suivants :
- **conducteur** - Peut créer des annonces et gérer les demandes
- **expediteur** - Peut rechercher des annonces et envoyer des demandes
- **admin** - Accès complet à toutes les fonctionnalités

## 📧 Notifications

Le système envoie des emails automatiques pour :
- Nouvelle demande reçue
- Demande acceptée/refusée
- Confirmation de livraison

## 🚀 Déploiement

### Avec Docker
```bash
# Build des images
docker-compose build

# Démarrage
docker-compose up -d
```

### Avec PM2
```bash
# Installation PM2
npm install -g pm2

# Démarrage
pm2 start ecosystem.config.js
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🎯 Roadmap

- [ ] Application mobile React Native
- [ ] Système de paiement intégré
- [ ] Géolocalisation en temps réel
- [ ] IA pour l'optimisation des trajets
- [ ] Intégration avec d'autres plateformes logistiques

---

**TransportConnect** - Connecter le monde, un transport à la fois 🚛✨ 