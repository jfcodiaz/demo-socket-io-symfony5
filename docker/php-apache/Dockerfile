From php:8-apache

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Setup bare-minimum extra extensions for Laravel & others
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
	&& apt-get install -y --no-install-recommends \
		libmemcached-dev  \
		libfreetype6-dev \
		libxml2-dev \
		libjpeg62-turbo-dev \
		libpng-dev \
		zlib1g-dev \
		libzip-dev \
		libz-dev \
		libpq-dev  \
		libsqlite3-dev  \
		libicu-dev \
		g++ \
		git \
		zip \
		libmcrypt-dev \
		libvpx-dev \
		libjpeg-dev \
		libpng-dev \
		bzip2 \
		wget \
		libexpat1-dev \
		libbz2-dev \
		libgmp3-dev \
		libldap2-dev \
		unixodbc-dev \
		libsnmp-dev \
		libpcre3-dev \
		libtidy-dev \
		libaspell-dev \
		tar \
		less \
		nano \
		libcurl4-gnutls-dev \
		apt-utils \
		libxrender1 \
		unzip \
		libonig-dev \
		libldap2-dev \
		libxslt-dev \
		libwebp-dev \
		libc-client-dev \
		libkrb5-dev \
		libpspell-dev \
		librabbitmq-dev \
		librabbitmq4 \
		ssh-client \
    && phpModules=" \
                bcmath \
                bz2 \
                calendar \
                exif \
                gd \
                gettext \
                gmp \
                imap \
                intl \
                ldap \
                mysqli \
                opcache \
                pcntl \
                pdo_mysql \
                pdo_pgsql \
                pgsql \
                pspell \
                shmop \
                snmp \
                soap \
                sockets \
                sysvmsg \
                sysvsem \
                sysvshm \
                tidy \
                xsl \
                zip \
            " \
	&& docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp \
	&& docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ \
	&& docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
	&& docker-php-ext-install -j$(nproc) $phpModules \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install composer and update path
ENV COMPOSER_HOME /composer
ENV PATH /composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# Install code quality tools
RUN composer global require "squizlabs/php_codesniffer=*"
RUN composer global require "pheromone/phpcs-security-audit=*"
RUN composer global require "phpcompatibility/php-compatibility=*"
RUN composer global require "dealerdirect/phpcodesniffer-composer-installer=*"
RUN composer global require "friendsofphp/php-cs-fixer=*"
RUN composer global require "phpmd/phpmd=*"
RUN composer global require "phpstan/phpstan=*"
RUN composer global require "sensiolabs/security-checker=*"
RUN composer global require "phpunit/phpunit=*"

# Enable Apache mod_rewrite.
RUN a2enmod rewrite ssl headers proxy proxy_http

# Change uid and gid of apache to docker user uid/gid 
RUN usermod -u 1000 www-data \
    && groupmod -g 1000 www-data


RUN wget https://get.symfony.com/cli/installer -O - | bash &&  mv /root/.symfony/bin/symfony /usr/local/bin/symfony

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 10.16.3

RUN mkdir /root/.nvm \
	&& curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
	&& chmod +x $HOME/.nvm/nvm.sh \
	&& . $HOME/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default && npm install -g npm \
	&& ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/nodejs \
	&& ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/node \
	&& ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm 


WORKDIR "/root/repository/code"

EXPOSE 80
ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
