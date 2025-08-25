FROM php:8.2-cli

# Install extensions
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev zip \
    && docker-php-ext-install pdo_mysql intl zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Expose le dossier du projet
COPY . .

RUN composer install
