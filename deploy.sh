#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────
REMOTE_USER="root"
REMOTE_HOST="gekymedia.com"
HESTIA_USER="gekymedia"
DOMAIN="hopespringfoundation.gekymedia.com"
APP_DIR="/home/${HESTIA_USER}/web/${DOMAIN}/app"
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

if /usr/local/hestia/bin/v-list-web-domain "\${HESTIA_USER}" "\${DOMAIN}" > /dev/null 2>&1; then
    echo "Domain \${DOMAIN} already exists."
else
    echo "Creating domain \${DOMAIN}..."
    /usr/local/hestia/bin/v-add-web-domain "\${HESTIA_USER}" "\${DOMAIN}"
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

# ─── Step 3: Enable SSL (if needed) ───────────────────────────
step "Ensuring SSL is configured..."
ssh "$SSH" bash <<SEOF
HESTIA_USER="${HESTIA_USER}"
DOMAIN="${DOMAIN}"

if /usr/local/hestia/bin/v-list-web-domain "\${HESTIA_USER}" "\${DOMAIN}" | grep -q "SSL"; then
    echo "SSL already configured."
else
    /usr/local/hestia/bin/v-add-letsencrypt-domain "\${HESTIA_USER}" "\${DOMAIN}" "" "yes" 2>/dev/null || echo "SSL setup attempted."
fi
SEOF

# ─── Step 4: Clone/pull repository ─────────────────────────────
step "Syncing repository on server..."
ssh "$SSH" bash <<REOF
APP_DIR="${APP_DIR}"
REPO="${REPO}"
BRANCH="${BRANCH}"
HESTIA_USER="${HESTIA_USER}"

git config --global --add safe.directory "\${APP_DIR}" 2>/dev/null || true

if [ ! -d "\${APP_DIR}/.git" ]; then
    echo "Cloning repository..."
    git clone --branch "\${BRANCH}" "\${REPO}" "\${APP_DIR}"
else
    echo "Pulling latest changes..."
    cd "\${APP_DIR}"
    git fetch origin
    git reset --hard "origin/\${BRANCH}"
fi

chown -R \${HESTIA_USER}:\${HESTIA_USER} "\${APP_DIR}"
REOF

# ─── Step 5: Install PHP dependencies ──────────────────────────
step "Installing Composer dependencies..."
ssh "$SSH" bash <<CEOF
cd "${APP_DIR}"
${PHP} /usr/bin/composer install --no-dev --optimize-autoloader --no-interaction 2>&1
CEOF

# ─── Step 6: Build frontend on server ──────────────────────────
step "Building frontend assets on server..."
ssh "$SSH" bash <<BEOF
cd "${APP_DIR}"
npm ci --prefer-offline 2>&1 | tail -3
npm run build 2>&1 | tail -5
BEOF

# ─── Step 7: Symlink public_html → app/public ──────────────────
step "Linking public_html to Laravel public directory..."
ssh "$SSH" bash <<LEOF
PUBLIC_HTML="${PUBLIC_HTML}"
APP_DIR="${APP_DIR}"
HESTIA_USER="${HESTIA_USER}"

if [ -d "\${PUBLIC_HTML}" ] && [ ! -L "\${PUBLIC_HTML}" ]; then
    mv "\${PUBLIC_HTML}" "\${PUBLIC_HTML}_bak_\$(date +%s)"
fi

ln -sfn "\${APP_DIR}/public" "\${PUBLIC_HTML}"
chown -h \${HESTIA_USER}:\${HESTIA_USER} "\${PUBLIC_HTML}"
LEOF

# ─── Step 8: Configure .env (first run only) ───────────────────
step "Configuring environment..."
ssh "$SSH" bash <<EEOF
APP_DIR="${APP_DIR}"
DOMAIN="${DOMAIN}"
PHP="${PHP}"
HESTIA_USER="${HESTIA_USER}"
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
DB_PASS="${DB_PASS}"

if [ ! -f "\${APP_DIR}/.env" ]; then
    echo "Creating .env from .env.example..."
    cp "\${APP_DIR}/.env.example" "\${APP_DIR}/.env"

    cd "\${APP_DIR}"
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

# ─── Step 9: Run migrations, seed & optimize ──────────────────
step "Running migrations, seeding, and optimizing..."
ssh "$SSH" bash <<MEOF
cd "${APP_DIR}"
PHP="${PHP}"

\${PHP} artisan migrate --force
\${PHP} artisan db:seed --force 2>/dev/null || echo "Seeding skipped (already seeded or error)."
\${PHP} artisan storage:link 2>/dev/null || true
\${PHP} artisan optimize
\${PHP} artisan view:cache
\${PHP} artisan event:cache
MEOF

# ─── Step 10: Set permissions ──────────────────────────────────
step "Setting file permissions..."
ssh "$SSH" bash <<PEOF
APP_DIR="${APP_DIR}"
HESTIA_USER="${HESTIA_USER}"

chown -R \${HESTIA_USER}:\${HESTIA_USER} "\${APP_DIR}"
find "\${APP_DIR}/storage" -type d -exec chmod 775 {} \;
find "\${APP_DIR}/storage" -type f -exec chmod 664 {} \;
find "\${APP_DIR}/bootstrap/cache" -type d -exec chmod 775 {} \;
find "\${APP_DIR}/bootstrap/cache" -type f -exec chmod 664 {} \;
PEOF

# ─── Step 11: Reload services ─────────────────────────────────
step "Reloading services..."
ssh "$SSH" "systemctl reload php8.4-fpm && systemctl reload apache2 && systemctl reload nginx && echo 'Services reloaded.'"

# ─── Done ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployed to https://${DOMAIN}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
