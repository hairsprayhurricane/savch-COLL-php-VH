import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './VideoList.css';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="video-list">
      <h1>Видеоролики</h1>
      {videos.length === 0 ? (
        <p>Видеороликов пока нет</p>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <Link to={`/videos/${video.id}`}>
                <h3>{video.title}</h3>
              </Link>
              <p className="video-author">Автор: {video.user?.name}</p>
              <p className="video-description">
                {video.description || 'Нет описания'}
              </p>
              <div className="video-stats">
                <span>👍 {video.likes_count || 0}</span>
                <span>👎 {video.dislikes_count || 0}</span>
                <span>💬 {video.comments_count || 0}</span>
              </div>
              {video.is_restricted && (
                <span className="restricted-badge">Ограниченный доступ</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

