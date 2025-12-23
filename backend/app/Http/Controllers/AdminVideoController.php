<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;

class AdminVideoController extends Controller
{
    /**
     * Get all videos for admin.
     */
    public function index()
    {
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

        return response()->json($videos);
    }

    /**
     * Set restriction on a video.
     */
    public function setRestriction(Request $request, Video $video)
    {
        $data = $request->validate([
            'is_restricted' => 'required|boolean',
        ]);

        $video->update([
            'is_restricted' => $data['is_restricted'],
        ]);

        return response()->json($video);
    }
}

