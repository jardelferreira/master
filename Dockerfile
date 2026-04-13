FROM php:8.4-fpm

ARG USER=laravel
ARG UID=1000

# Dependências essenciais apenas
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    libxslt1-dev \
    libmagickwand-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pgsql \
        zip \
        intl \
        gd \
        opcache \
        bcmath \
        pcntl \
        exif \
    && pecl install redis imagick \
    && docker-php-ext-enable redis imagick \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Usuário não-root
RUN useradd -G www-data,root -u $UID -d /home/$USER $USER \
    && mkdir -p /home/$USER \
    && chown -R $USER:$USER /home/$USER \
    && chown -R $USER:www-data /var/www

WORKDIR /var/www

# Timezone
RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" > /etc/timezone

# Config PHP
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini

# Copiar código
COPY --chown=$USER:www-data . /var/www

USER $USER

EXPOSE 9000
CMD ["php-fpm"]