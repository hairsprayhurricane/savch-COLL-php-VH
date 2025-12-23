<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\VideoLike;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    /**
     * Get list of videos (non-restricted for guests).
     */
    public function index()
    {
        $user = auth('sanctum')->user();
        
        // If user is admin, show all videos
        if ($user && $user->role === 'admin') {
            $videos = Video::with('user')
                ->withCount([
                    'likes as likes_count' => function ($q) {
                        $q->where('value', 1);
                    },
                    'likes as dislikes_count' => function ($q) {
                        $q->where('value', -1);
                    },
                ])
                ->latest()
                ->get();
        } else {
            // For guests and regular users, show only non-restricted videos
            $videos = Video::where('is_restricted', false)
                ->with('user')
                ->withCount([
                    'likes as likes_count' => function ($q) {
                        $q->where('value', 1);
                    },
                    'likes as dislikes_count' => function ($q) {
                        $q->where('value', -1);
                    },
                ])
                ->latest()
                ->get();
        }

        return response()->json($videos);
    }

    /**
     * Get single video.
     */
    public function show(Video $video)
    {
        // Check if video is restricted
        if ($video->is_restricted) {
            $user = auth('sanctum')->user();
            // Only author or admin can view restricted videos
            if (!$user || ($user->id !== $video->user_id && $user->role !== 'admin')) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $video->load(['comments.user', 'user']);

        $video->loadCount([
            'likes as likes_count' => function ($q) {
                $q->where('value', 1);
            },
            'likes as dislikes_count' => function ($q) {
                $q->where('value', -1);
            },
        ]);

        // Load user's like if authenticated
        $user = auth('sanctum')->user();
        if ($user) {
            $userLike = VideoLike::where('user_id', $user->id)
                ->where('video_id', $video->id)
                ->first();
            $video->user_like = $userLike;
        }

        return response()->json($video);
    }

    /**
     * Upload a new video.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        try {
            // Сначала проверяем наличие файла
            if (!$request->hasFile('file')) {
                return response()->json([
                    'message' => 'Файл не был загружен',
                    'errors' => ['file' => ['Файл обязателен для загрузки']]
                ], 422);
            }

            $file = $request->file('file');
            
            // Логирование для отладки
            \Log::info('Video upload attempt', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
            ]);

            // Проверка расширения файла (более гибкая проверка)
            $allowedExtensions = ['mp4', 'avi', 'mpeg', 'mpg', 'mov', 'qt', 'wmv', 'flv', 'webm', 'mkv'];
            $extension = strtolower($file->getClientOriginalExtension());
            
            if (!in_array($extension, $allowedExtensions)) {
                return response()->json([
                    'message' => 'Неподдерживаемый формат файла',
                    'errors' => ['file' => ['Поддерживаемые форматы: ' . implode(', ', $allowedExtensions)]]
                ], 422);
            }
            
            // Проверка размера файла (в килобайтах)
            $maxSizeKB = 512000; // 500MB
            $fileSizeKB = $file->getSize() / 1024;
            
            if ($fileSizeKB > $maxSizeKB) {
                return response()->json([
                    'message' => 'Файл слишком большой',
                    'errors' => ['file' => ['Максимальный размер файла: 500MB. Размер вашего файла: ' . round($fileSizeKB / 1024, 2) . 'MB']]
                ], 422);
            }

            // Валидация остальных полей
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $path = $file->store('videos', 'public');

            if (!$path) {
                return response()->json([
                    'message' => 'Ошибка при сохранении файла'
                ], 500);
            }

            $video = Video::create([
                'user_id' => $user->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'file_path' => $path,
            ]);

            return response()->json($video, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Video upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Ошибка при загрузке видео: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Like or dislike a video.
     */
    public function like(Request $request, Video $video)
    {
        $data = $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $like = VideoLike::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'video_id' => $video->id,
            ],
            [
                'value' => $data['value'],
            ]
        );

        return response()->json($like);
    }

    /**
     * Add a comment to a video.
     */
    public function comment(Request $request, Video $video)
    {
        $data = $request->validate([
            'text' => 'required|string',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'video_id' => $video->id,
            'text' => $data['text'],
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }
}

