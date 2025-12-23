import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './VideoDetail.css';

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
      setVideo(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('У вас нет доступа к этому видео');
        navigate('/');
      } else {
        console.error('Error loading video:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (value) => {
    if (!user) {
      alert('Войдите, чтобы оценить видео');
      return;
    }

    try {
      await api.post(`/videos/${id}/like`, { value });
      loadVideo(); // Перезагружаем видео для обновления счетчиков
    } catch (error) {
      console.error('Error liking video:', error);
      if (error.response?.status === 401) {
        alert('Войдите, чтобы оценить видео');
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Войдите, чтобы оставить комментарий');
      return;
    }

    if (!comment.trim()) {
      return;
    }

    try {
      await api.post(`/videos/${id}/comment`, { text: comment });
      setComment('');
      loadVideo(); // Перезагружаем видео для обновления комментариев
    } catch (error) {
      console.error('Error posting comment:', error);
      if (error.response?.status === 401) {
        alert('Войдите, чтобы оставить комментарий');
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!video) {
    return <div className="error">Видео не найдено</div>;
  }

  const videoUrl = `http://localhost:8000/storage/${video.file_path}`;
  const userLike = video.user_like;

  return (
    <div className="video-detail">
      <button onClick={() => navigate('/')} className="back-button">
        ← Назад к списку
      </button>

      <h1>{video.title}</h1>
      <p className="video-author">Автор: {video.user?.name}</p>

      <div className="video-player">
        <video src={videoUrl} controls width="100%" />
      </div>

      <p className="video-description">{video.description || 'Нет описания'}</p>

      <div className="video-actions">
        <button
          onClick={() => handleLike(1)}
          className={`like-button ${userLike?.value === 1 ? 'active' : ''}`}
        >
          👍 Лайк ({video.likes_count || 0})
        </button>
        <button
          onClick={() => handleLike(-1)}
          className={`dislike-button ${userLike?.value === -1 ? 'active' : ''}`}
        >
          👎 Дизлайк ({video.dislikes_count || 0})
        </button>
      </div>

      <div className="comments-section">
        <h2>Комментарии ({video.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Оставьте комментарий..."
              rows="3"
            />
            <button type="submit">Отправить</button>
          </form>
        )}

        {!user && (
          <p className="login-prompt">
            <a href="/login">Войдите</a>, чтобы оставить комментарий
          </p>
        )}

        <div className="comments-list">
          {video.comments && video.comments.length > 0 ? (
            video.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-author">{comment.user?.name}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-date">
                  {new Date(comment.created_at).toLocaleString('ru-RU')}
                </div>
              </div>
            ))
          ) : (
            <p>Комментариев пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
}

