# MyBank - Application de gestion bancaire

MyBank est une application Symfony conteneurisée avec Docker, permettant de gérer des comptes et des opérations bancaires.  
Ce projet inclut une **CI/CD GitHub Actions**, des scripts de déploiement et des tests automatisés.

---

## 🔹 Prérequis

- Docker & Docker Compose
- PHP >= 8.2
- Composer
- Git

---

## 🚀 Installation et lancement

1. **Cloner le projet :**

```bash
git clone https://github.com/<votre-utilisateur>/mybank.git
cd mybank

2.Lancer les conteneurs Docker 

docker-compose -f docker/docker-compose.yml up -d --build


2.Installer les dépendances PHP :

docker exec -it mybank_php composer install


3.Créer la base de données :

docker exec -it mybank_php php bin/console doctrine:database:create --if-not-exists


4.Appliquer les migrations :

docker exec -it mybank_php php bin/console doctrine:migrations:migrate --no-interaction

5;structure du projet 
mybank/
│
├─ .github/workflows/       # CI/CD GitHub Actions
├─ docker/                  # Configuration Docker
├─ scripts/                 # Scripts de déploiement et tests
├─ src/                     # Code Symfony
├─ migrations/              # Migrations Doctrine
├─ config/                  # Configuration Symfony
├─ public/                  # Point d'entrée web
├─ templates/               # Templates Twig
├─ composer.json
├─ composer.lock
└─ README.md

Erreurs fréquentes et solutions

❌ Erreur CORS (Access-Control-Allow-Origin)
➡️ Vérifiez que le bundle CORS est bien activé dans Symfony (nelmio/cors-bundle).

❌ Erreur 405 Method Not Allowed
➡️ Vérifiez que la route supporte bien la méthode (POST, PUT, DELETE).

❌ Erreur 500 Internal Server Error
➡️ Vérifiez la configuration de votre API et vos entités Symfony.