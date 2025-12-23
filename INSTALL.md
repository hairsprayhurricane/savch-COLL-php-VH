# Инструкция по установке

## Быстрый старт

### 1. Установка зависимостей Backend

```bash
cd backend
composer install
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2. Настройка базы данных

Создайте файл `.env` в папке `backend` (скопируйте из `.env.example`) и настройте:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_hosting
DB_USERNAME=root
DB_PASSWORD=
```

Создайте базу данных:
```sql
CREATE DATABASE video_hosting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Выполнение миграций

```bash
cd backend
php artisan migrate
php artisan storage:link
php artisan key:generate
```

### 4. Установка зависимостей Frontend

```bash
cd frontend
npm install
```

### 5. Запуск приложения

**Backend (в одном терминале):**
```bash
cd backend
php artisan serve
```

**Frontend (в другом терминале):**
```bash
cd frontend
npm start
```

### 6. Создание администратора

Откройте новый терминал и выполните:

```bash
cd backend
php artisan tinker
```

В консоли tinker выполните:
```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => \Illuminate\Support\Facades\Hash::make('password'),
    'role' => 'admin'
]);
```

Выйдите из tinker командой `exit`.

## Проверка работы

1. Откройте браузер: `http://localhost:3000`
2. Зарегистрируйтесь как обычный пользователь
3. Войдите под администратором: `admin@example.com` / `password`
4. Проверьте админ-панель: `http://localhost:3000/admin/videos`

## Решение проблем

### Ошибка подключения к БД
- Проверьте настройки в `.env`
- Убедитесь, что MySQL запущен
- Проверьте права доступа к базе данных

### Ошибка CORS
- Убедитесь, что backend запущен на `http://localhost:8000`
- Проверьте настройки CORS в `config/cors.php`

### Видео не загружаются
- Выполните `php artisan storage:link` в папке backend
- Проверьте права на запись в `storage/app/public`

### Ошибка 419 (CSRF)
- Убедитесь, что используете API маршруты (`/api/*`)
- Проверьте заголовок `Authorization: Bearer {token}` в запросах

