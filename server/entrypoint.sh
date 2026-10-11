#!/bin/sh
set -e

[ -f .env ] || cp .env.example .env

if ! grep -q '^APP_KEY=base64' .env; then
  php artisan key:generate --force
fi

php artisan migrate --force

[ -f storage/oauth-private.key ] || php artisan passport:install --force

exec php artisan serve --host=0.0.0.0 --port=8000
