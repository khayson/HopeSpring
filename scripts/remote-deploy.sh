#!/usr/bin/env bash
# Production update deploy for HopeSpring on Hestia.
# Safe to run repeatedly. Does NOT seed the database or recreate domains.
set -euo pipefail

PUBLIC_HTML="${PUBLIC_HTML:-/home/gekymedia/web/hopespringfoundation.gekymedia.com/public_html}"
BRANCH="${BRANCH:-main}"
HESTIA_USER="${HESTIA_USER:-gekymedia}"
PHP="${PHP:-/usr/bin/php8.4}"
DOMAIN="${DOMAIN:-hopespringfoundation.gekymedia.com}"
BROUGHT_DOWN=0

cleanup() {
    if [ "${BROUGHT_DOWN}" -eq 1 ]; then
        (cd "${PUBLIC_HTML}" && "${PHP}" artisan up) 2>/dev/null || true
    fi
}
trap cleanup EXIT

cd "${PUBLIC_HTML}"

git config --global --add safe.directory "${PUBLIC_HTML}" 2>/dev/null || true

echo "→ Fetching ${BRANCH}..."
git fetch origin "${BRANCH}"
git reset --hard "origin/${BRANCH}"

mkdir -p /tmp/php84-shim
ln -sf "${PHP}" /tmp/php84-shim/php
export PATH="/tmp/php84-shim:${PATH}"

# Non-interactive SSH often misses nvm / custom node paths
export NVM_DIR="${HOME}/.nvm"
if [ -s "${NVM_DIR}/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "${NVM_DIR}/nvm.sh"
fi

echo "→ Installing Composer dependencies..."
"${PHP}" /usr/bin/composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "→ Building frontend..."
npm ci --prefer-offline
npm run build

echo "→ Migrating and optimizing..."
"${PHP}" artisan down --retry=60 2>/dev/null || true
BROUGHT_DOWN=1
"${PHP}" artisan migrate --force
"${PHP}" artisan storage:link 2>/dev/null || true
"${PHP}" artisan optimize:clear
"${PHP}" artisan optimize
"${PHP}" artisan view:cache
"${PHP}" artisan event:cache
"${PHP}" artisan queue:restart 2>/dev/null || true
"${PHP}" artisan up
BROUGHT_DOWN=0

echo "→ Fixing ownership and permissions..."
chown -R "${HESTIA_USER}:${HESTIA_USER}" "${PUBLIC_HTML}"
find "${PUBLIC_HTML}/storage" -type d -exec chmod 775 {} \;
find "${PUBLIC_HTML}/storage" -type f -exec chmod 664 {} \;
find "${PUBLIC_HTML}/bootstrap/cache" -type d -exec chmod 775 {} \;
find "${PUBLIC_HTML}/bootstrap/cache" -type f -exec chmod 664 {} \;

echo "→ Reloading PHP-FPM / web servers..."
systemctl reload php8.4-fpm 2>/dev/null || true
systemctl reload apache2 2>/dev/null || true
systemctl reload nginx 2>/dev/null || true

echo "✓ Deployed https://${DOMAIN}"
