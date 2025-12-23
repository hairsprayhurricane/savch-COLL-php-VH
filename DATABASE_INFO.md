# Информация о базе данных

## Текущая конфигурация

Сейчас используется **SQLite** база данных.

### Расположение файла SQLite БД:
```
C:\openserver\domains\video-hosting\backend\database\database.sqlite
```

Это один файл, который содержит всю базу данных со всеми таблицами.

## Переключение на MySQL

Если вы хотите использовать MySQL (как указано в требованиях), выполните следующие шаги:

### 1. Создайте базу данных MySQL

Откройте phpMyAdmin или MySQL консоль и выполните:

```sql
CREATE DATABASE video_hosting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Обновите файл `.env`

Откройте файл `backend/.env` и измените настройки БД:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_hosting
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Выполните миграции заново

```bash
cd backend
php artisan migrate:fresh
```

**Внимание:** Команда `migrate:fresh` удалит все существующие таблицы и создаст их заново. Все данные будут потеряны!

Если хотите сохранить данные из SQLite, сначала экспортируйте их.

## Расположение БД в зависимости от типа

### SQLite
- **Файл:** `backend/database/database.sqlite`
- **Размер:** Растет по мере добавления данных
- **Управление:** Можно открыть в любом SQLite клиенте (DB Browser for SQLite, SQLiteStudio)

### MySQL
- **Сервер:** Обычно `localhost:3306` (OpenServer)
- **База данных:** `video_hosting` (или как указано в .env)
- **Управление:** phpMyAdmin (обычно доступен через OpenServer)

## Проверка текущей БД

Чтобы узнать, какая БД используется:

```bash
cd backend
php artisan config:show database.default
```

Чтобы увидеть все настройки БД:

```bash
php artisan config:show database
```

## Просмотр данных

### SQLite
Используйте DB Browser for SQLite или SQLiteStudio:
- Скачайте: https://sqlitebrowser.org/ или https://sqlitestudio.pl/
- Откройте файл: `backend/database/database.sqlite`

### MySQL
Используйте phpMyAdmin:
- Откройте в браузере: `http://localhost/openserver/phpmyadmin/` (или адрес вашего OpenServer)
- Выберите базу данных `video_hosting`

## Рекомендация

Для продакшена рекомендуется использовать **MySQL**, так как:
- Лучше масштабируется
- Поддерживает больше одновременных подключений
- Имеет больше функций
- Удобнее для администрирования через phpMyAdmin

SQLite подходит для разработки и небольших проектов.

