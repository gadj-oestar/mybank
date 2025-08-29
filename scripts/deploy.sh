#!/bin/bash
echo "🚀 Déploiement MyBank"

# Construire les conteneurs
docker-compose -f docker/docker-compose.yml up -d --build

# Installer les dépendances PHP
docker exec -it mybank_php composer install

# Créer la base de données si nécessaire
docker exec -it mybank_php php bin/console doctrine:database:create --if-not-exists

# Appliquer les migrations
docker exec -it mybank_php php bin/console doctrine:migrations:migrate --no-interaction

echo "✅ Déploiement terminé. Application accessible sur http://localhost:8000"
