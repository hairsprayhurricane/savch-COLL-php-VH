# Видеохостинг - Сервис для загрузки и просмотра видеороликов

Полнофункциональный сервис видеохостинга с регистрацией пользователей, загрузкой видео, лайками, комментариями и админ-панелью.

## Технологический стек

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18
- **База данных**: MySQL
- **Аутентификация**: Laravel Sanctum

## Функционал

### Для всех пользователей (гости)
- Просмотр списка видеороликов (неограниченных)
- Просмотр отдельных видеороликов

### Для зарегистрированных пользователей
- Регистрация и авторизация
- Загрузка видеороликов
- Лайки и дизлайки видеороликов
- Комментарии к видеороликам

### Для администраторов
- Просмотр всех видеороликов (включая ограниченные)
- Управление ограничениями на видеоролики
- Админ-панель со списком всех видео

## Установка и настройка

### Требования
- PHP 8.2 или выше
- Composer
- Node.js и npm
- MySQL
- OpenServer (или другой локальный сервер)

### Backend (Laravel)

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
composer install
```

3. Установите Laravel Sanctum:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

4. Настройте файл `.env`:
```env
APP_NAME=VideoHosting
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_hosting
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
```

5. Создайте базу данных MySQL:
```sql
CREATE DATABASE video_hosting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Выполните миграции:
```bash
php artisan migrate
```

7. Создайте символическую ссылку для хранения файлов:
```bash
php artisan storage:link
```

8. Запустите сервер разработки:
```bash
php artisan serve
```

Backend будет доступен по адресу: `http://localhost:8000`

### Frontend (React)

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости (если еще не установлены):
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## Структура проекта

```
video-hosting/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── VideoController.php
│   │   │   │   └── AdminVideoController.php
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Video.php
│   │       ├── VideoLike.php
│   │       └── Comment.php
│   ├── database/
│   │   └── migrations/
│   └── routes/
│       └── api.php
└── frontend/               # React приложение
    ├── src/
    │   ├── pages/
    │   │   ├── VideoList.js
    │   │   ├── VideoDetail.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── UploadVideo.js
    │   │   └── AdminVideos.js
    │   ├── utils/
    │   │   └── api.js
    │   └── App.js
```

## API Endpoints

### Публичные маршруты
- `POST /api/register` - Регистрация пользователя
- `POST /api/login` - Авторизация
- `GET /api/videos` - Список видеороликов
- `GET /api/videos/{id}` - Получить видеоролик

### Защищенные маршруты (требуют авторизации)
- `POST /api/logout` - Выход
- `POST /api/videos` - Загрузить видеоролик
- `POST /api/videos/{id}/like` - Лайк/дизлайк
- `POST /api/videos/{id}/comment` - Добавить комментарий

### Админские маршруты (требуют роль admin)
- `GET /api/admin/videos` - Список всех видеороликов
- `PATCH /api/admin/videos/{id}/restriction` - Установить/снять ограничение

## Создание администратора

Для создания администратора выполните в консоли Laravel:

```bash
php artisan tinker
```

Затем выполните:
```php
$user = \App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => \Illuminate\Support\Facades\Hash::make('password'),
    'role' => 'admin'
]);
```

## Использование

1. Запустите backend и frontend серверы
2. Откройте браузер и перейдите на `http://localhost:3000`
3. Зарегистрируйтесь или войдите в систему
4. Загрузите видеоролик через кнопку "Загрузить видео"
5. Просматривайте видеоролики, ставьте лайки и оставляйте комментарии
6. Для доступа к админ-панели войдите под учетной записью администратора

## Особенности

- Роли пользователей: guest, user, admin
- Ограниченные видеоролики видны только автору и администратору
- Загрузка видео с валидацией формата и размера
- Система лайков/дизлайков
- Комментарии к видеороликам
- Админ-панель для управления видеороликами

## Лицензия

MIT

