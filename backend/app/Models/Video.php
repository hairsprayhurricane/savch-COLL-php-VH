<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'file_path',
        'is_restricted',
    ];

    /**
     * Get the user that owns the video.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the likes for the video.
     */
    public function likes()
    {
        return $this->hasMany(VideoLike::class);
    }

    /**
     * Get the comments for the video.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}

