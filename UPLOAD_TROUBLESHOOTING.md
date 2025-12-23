# Устранение проблем с загрузкой файлов

## Возможные причины ошибки "The file failed to upload"

### 1. Проверка прав доступа к папке storage

Убедитесь, что папка `backend/storage/app/public` существует и имеет права на запись:

```bash
cd backend
# Проверьте существование папки
dir storage\app\public

# Если папки нет, создайте её
mkdir storage\app\public\videos
```

### 2. Проверка символической ссылки

Символическая ссылка должна быть создана:

```bash
cd backend
php artisan storage:link
```

Проверьте, что существует ссылка: `backend/public/storage` → `backend/storage/app/public`

### 3. Проверка настроек PHP

Убедитесь, что в `php.ini` установлены достаточные значения:

```ini
upload_max_filesize = 500M
post_max_size = 500M
max_file_uploads = 20
memory_limit = 256M
```

Для OpenServer найдите файл `php.ini` в папке OpenServer и измените эти значения.

### 4. Проверка формата файла

Поддерживаемые форматы:
- MP4 (video/mp4)
- AVI (video/x-msvideo)
- MPEG (video/mpeg)
- QuickTime/MOV (video/quicktime)

### 5. Проверка размера файла

Максимальный размер файла: **500MB** (512000 KB)

Если файл больше, увеличьте значение `max:512000` в `VideoController.php` или уменьшите размер файла.

### 6. Проверка логов

Проверьте логи Laravel:

```bash
cd backend
# Просмотр последних ошибок
type storage\logs\laravel.log | Select-Object -Last 50
```

### 7. Проверка консоли браузера

Откройте консоль разработчика (F12) и проверьте:
- Ошибки сети (Network tab)
- Ошибки JavaScript (Console tab)
- Детали запроса к `/api/videos`

### 8. Проверка CORS

Убедитесь, что CORS настроен правильно в `backend/config/cors.php`:

```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### 9. Проверка авторизации

Убедитесь, что вы авторизованы. Токен должен быть в заголовках запроса:

```
Authorization: Bearer {your_token}
```

### 10. Ручная проверка загрузки

Попробуйте загрузить файл через Postman или curl:

```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Video" \
  -F "description=Test" \
  -F "file=@/path/to/video.mp4"
```

## Быстрое решение

1. **Создайте папку для видео:**
   ```bash
   cd backend
   mkdir storage\app\public\videos
   ```

2. **Проверьте символическую ссылку:**
   ```bash
   php artisan storage:link
   ```

3. **Проверьте права доступа** - папка `storage` должна быть доступна для записи

4. **Проверьте размер файла** - не должен превышать 500MB

5. **Проверьте формат файла** - должен быть MP4, AVI, MPEG или MOV

6. **Проверьте консоль браузера** - там будет детальная информация об ошибке

## Увеличение лимита размера файла

Если нужно загружать файлы больше 500MB:

1. Измените `backend/app/Http/Controllers/VideoController.php`:
   ```php
   'file' => 'required|file|mimes:mp4,avi,mpeg,quicktime,mov|max:1048576', // 1GB
   ```

2. Измените настройки PHP в `php.ini`:
   ```ini
   upload_max_filesize = 1000M
   post_max_size = 1000M
   ```

3. Перезапустите веб-сервер

## Проверка через код

Добавьте временную отладку в `VideoController.php`:

```php
\Log::info('Upload attempt', [
    'has_file' => $request->hasFile('file'),
    'file_size' => $request->file('file')?->getSize(),
    'file_mime' => $request->file('file')?->getMimeType(),
]);
```

Затем проверьте логи: `backend/storage/logs/laravel.log`

