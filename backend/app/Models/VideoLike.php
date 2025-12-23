<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'video_id',
        'value',
    ];

    /**
     * Get the video that owns the like.
     */
    public function video()
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Get the user that owns the like.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

