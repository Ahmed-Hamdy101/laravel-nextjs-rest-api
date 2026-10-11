docker compose up --build -d
docker compose exec backend composer require predis/predis
docker compose restart backend worker
docker compose exec backend php artisan db:seed
docker compose exec backend php artisan tinker --execute="echo App\Models\User::first()->email;"
docker compose exec redis redis-cli ping