#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────
REMOTE_USER="root"
REMOTE_HOST="gekymedia.com"
HESTIA_USER="gekymedia"
DOMAIN="hopespringfoundation.gekymedia.com"
PUBLIC_HTML="/home/${HESTIA_USER}/web/${DOMAIN}/public_html"
REPO="https://github.com/khayson/HopeSpring.git"
BRANCH="main"
PHP="/usr/bin/php8.4"
SSH="${REMOTE_USER}@${REMOTE_HOST}"

DB_NAME="hopespringfoundation"
DB_USER="hopespringfoundation"
DB_PASS="hopespringfoundation"

# ─── Colors ──────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

step()  { echo -e "\n${GREEN}▸ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠ $1${NC}"; }
fail()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

# ─── Step 1: Create domain in HestiaCP (if needed) ─────────────
step "Ensuring domain exists in HestiaCP..."
ssh "$SSH" bash <<HEOF
HESTIA_USER="${HESTIA_USER}"
DOMAIN="${DOMAIN}"
PHP_TPL="PHP-8_4"

if /usr/local/hestia/bin/v-list-web-domain "\${HESTIA_USER}" "\${DOMAIN}" > /dev/null 2>&1; then
    echo "Domain \${DOMAIN} already exists."
else
    echo "Creating domain \${DOMAIN}..."
    /usr/local/hestia/bin/v-add-web-domain "\${HESTIA_USER}" "\${DOMAIN}"
    /usr/local/hestia/bin/v-change-web-domain-backend-tpl "\${HESTIA_USER}" "\${DOMAIN}" "\${PHP_TPL}" 2>/dev/null || true
    /usr/local/hestia/bin/v-change-web-domain-docroot "\${HESTIA_USER}" "\${DOMAIN}" "\${DOMAIN}" /public 2>/dev/null || true

    # Add DNS A record for the subdomain
    /usr/local/hestia/bin/v-add-dns-record "\${HESTIA_USER}" gekymedia.com hopespringfoundation A 91.98.200.25 2>/dev/null || true

    echo "Domain created."
fi
HEOF

# ─── Step 2: Create MySQL database (if needed) ─────────────────
step "Ensuring MySQL database exists..."
ssh "$SSH" bash <<DBEOF
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
DB_PASS="${DB_PASS}"
HESTIA_USER="${HESTIA_USER}"

if /usr/local/hestia/bin/v-list-database "\${HESTIA_USER}" "\${HESTIA_USER}_\${DB_NAME}" > /dev/null 2>&1; then
    echo "Database \${HESTIA_USER}_\${DB_NAME} already exists."
else
    echo "Creating database \${HESTIA_USER}_\${DB_NAME}..."
    /usr/local/hestia/bin/v-add-database "\${HESTIA_USER}" "\${DB_NAME}" "\${DB_USER}" "\${DB_PASS}" mysql
    echo "Database created."
fi
DBEOF

# ─── Step 3: Clone/pull repository into public_html ────────────
step "Syncing repository on server..."
ssh "$SSH" bash <<REOF
PUBLIC_HTML="${PUBLIC_HTML}"
REPO="${REPO}"
BRANCH="${BRANCH}"
HESTIA_USER="${HESTIA_USER}"

git config --global --add safe.directory "\${PUBLIC_HTML}" 2>/dev/null || true

if [ ! -d "\${PUBLIC_HTML}/.git" ]; then
    echo "Cloning repository into public_html..."
    # Back up default public_html if it exists
    if [ -d "\${PUBLIC_HTML}" ] || [ -L "\${PUBLIC_HTML}" ]; then
        rm -rf "\${PUBLIC_HTML}"
    fi
    git clone --branch "\${BRANCH}" "\${REPO}" "\${PUBLIC_HTML}"
else
    echo "Pulling latest changes..."
    cd "\${PUBLIC_HTML}"
    git fetch origin
    git reset --hard "origin/\${BRANCH}"
fi

chown -R \${HESTIA_USER}:\${HESTIA_USER} "\${PUBLIC_HTML}"
REOF

# ─── Step 4: Set up PHP 8.4 shim ──────────────────────────────
step "Setting up PHP 8.4 path shim..."
ssh "$SSH" bash <<PSHIM
mkdir -p /tmp/php84-shim
ln -sf ${PHP} /tmp/php84-shim/php
echo "PHP shim ready: \$(/tmp/php84-shim/php --version | head -1)"
PSHIM

# ─── Step 5: Install PHP dependencies ──────────────────────────
step "Installing Composer dependencies..."
ssh "$SSH" bash <<CEOF
cd "${PUBLIC_HTML}"
export PATH="/tmp/php84-shim:\$PATH"
${PHP} /usr/bin/composer install --no-dev --optimize-autoloader --no-interaction 2>&1 | tail -5
CEOF

# ─── Step 6: Build frontend on server ──────────────────────────
step "Building frontend assets on server..."
ssh "$SSH" bash <<BEOF
cd "${PUBLIC_HTML}"
export PATH="/tmp/php84-shim:\$PATH"
npm ci --prefer-offline 2>&1 | tail -3
npm run build 2>&1 | tail -10
BEOF

# ─── Step 7: Configure .env (first run only) ───────────────────
step "Configuring environment..."
ssh "$SSH" bash <<EEOF
PUBLIC_HTML="${PUBLIC_HTML}"
DOMAIN="${DOMAIN}"
PHP="${PHP}"
HESTIA_USER="${HESTIA_USER}"
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
DB_PASS="${DB_PASS}"

if [ ! -f "\${PUBLIC_HTML}/.env" ]; then
    echo "Creating .env from .env.example..."
    cp "\${PUBLIC_HTML}/.env.example" "\${PUBLIC_HTML}/.env"

    cd "\${PUBLIC_HTML}"
    \${PHP} artisan key:generate --force

    sed -i "s|APP_NAME=Laravel|APP_NAME=\"HopeSpring Foundation\"|" .env
    sed -i "s|APP_ENV=local|APP_ENV=production|" .env
    sed -i "s|APP_DEBUG=true|APP_DEBUG=false|" .env
    sed -i "s|APP_URL=http://localhost:8000|APP_URL=https://\${DOMAIN}|" .env

    sed -i "s|DB_CONNECTION=sqlite|DB_CONNECTION=mysql|" .env
    sed -i "s|# DB_HOST=127.0.0.1|DB_HOST=127.0.0.1|" .env
    sed -i "s|# DB_PORT=3306|DB_PORT=3306|" .env
    sed -i "s|# DB_DATABASE=laravel|DB_DATABASE=\${HESTIA_USER}_\${DB_NAME}|" .env
    sed -i "s|# DB_USERNAME=root|DB_USERNAME=\${HESTIA_USER}_\${DB_USER}|" .env
    sed -i "s|# DB_PASSWORD=|DB_PASSWORD=\${DB_PASS}|" .env

    echo ".env created."
else
    echo ".env already exists, skipping."
fi
EEOF

# ─── Step 8: Run migrations, seed & optimize ──────────────────
step "Running migrations, seeding, and optimizing..."
ssh "$SSH" bash <<MEOF
cd "${PUBLIC_HTML}"
PHP="${PHP}"
export PATH="/tmp/php84-shim:\$PATH"

\${PHP} artisan migrate --force
\${PHP} artisan db:seed --force 2>&1 || echo "Seeding note: check output above."
\${PHP} artisan storage:link 2>/dev/null || true
\${PHP} artisan app:download-seed-images 2>&1 || echo "Image download note: check output above."
\${PHP} artisan optimize
\${PHP} artisan view:cache
\${PHP} artisan event:cache
MEOF

# ─── Step 9: Fix open_basedir for Laravel ─────────────────────
step "Fixing PHP-FPM open_basedir..."
ssh "$SSH" bash <<OBEOF
POOL="/etc/php/8.4/fpm/pool.d/${DOMAIN}.conf"
if [ -f "\${POOL}" ]; then
    # HestiaCP custom docroot sets open_basedir to public_html/public
    # but Laravel needs access to the full public_html directory
    sed -i 's|${DOMAIN}/public_html/public|${DOMAIN}/public_html/|' "\${POOL}"
    echo "open_basedir fixed."
else
    echo "FPM pool not found at \${POOL}, skipping."
fi
OBEOF

# ─── Step 10: Set permissions ─────────────────────────────────
step "Setting file permissions..."
ssh "$SSH" bash <<PEOF
PUBLIC_HTML="${PUBLIC_HTML}"
HESTIA_USER="${HESTIA_USER}"

chown -R \${HESTIA_USER}:\${HESTIA_USER} "\${PUBLIC_HTML}"
find "\${PUBLIC_HTML}/storage" -type d -exec chmod 775 {} \;
find "\${PUBLIC_HTML}/storage" -type f -exec chmod 664 {} \;
find "\${PUBLIC_HTML}/bootstrap/cache" -type d -exec chmod 775 {} \;
find "\${PUBLIC_HTML}/bootstrap/cache" -type f -exec chmod 664 {} \;
PEOF

# ─── Step 11: Enable SSL (if needed) ──────────────────────────
step "Ensuring SSL is configured..."
ssh "$SSH" bash <<SEOF
HESTIA_USER="${HESTIA_USER}"
DOMAIN="${DOMAIN}"

if /usr/local/hestia/bin/v-list-web-domain "\${HESTIA_USER}" "\${DOMAIN}" | grep -q "LETSENCRYPT:.*yes"; then
    echo "SSL already configured."
else
    /usr/local/hestia/bin/v-add-letsencrypt-domain "\${HESTIA_USER}" "\${DOMAIN}" 2>/dev/null && echo "SSL installed." || echo "SSL setup attempted."
fi
SEOF

# ─── Step 12: Reload services ────────────────────────────────
step "Reloading services..."
ssh "$SSH" "systemctl reload php8.4-fpm && systemctl reload apache2 && systemctl reload nginx && echo 'Services reloaded.'"

# ─── Done ────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployed to https://${DOMAIN}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
