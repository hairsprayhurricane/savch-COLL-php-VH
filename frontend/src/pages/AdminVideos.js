import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminVideos.css';

export default function AdminVideos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      alert('У вас нет доступа к этой странице');
      navigate('/');
      return;
    }
    loadVideos();
  }, [user, navigate]);

  const loadVideos = async () => {
    try {
      const response = await api.get('/admin/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
      if (error.response?.status === 403) {
        alert('У вас нет доступа к этой странице');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleRestriction = async (video) => {
    try {
      await api.patch(`/admin/videos/${video.id}/restriction`, {
        is_restricted: !video.is_restricted,
      });
      loadVideos(); // Перезагружаем список
    } catch (error) {
      console.error('Error updating restriction:', error);
      alert('Ошибка при изменении ограничения');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-videos">
      <h1>Управление видеороликами</h1>
      <button onClick={() => navigate('/')} className="back-button">
        ← Назад к списку
      </button>

      {videos.length === 0 ? (
        <p>Видеороликов нет</p>
      ) : (
        <table className="videos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Автор</th>
              <th>Лайки</th>
              <th>Дизлайки</th>
              <th>Дата</th>
              <th>Ограничение</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>{video.id}</td>
                <td>
                  <a href={`/videos/${video.id}`}>{video.title}</a>
                </td>
                <td>{video.user?.name}</td>
                <td>{video.likes_count || 0}</td>
                <td>{video.dislikes_count || 0}</td>
                <td>{new Date(video.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  {video.is_restricted ? (
                    <span className="restricted">Да</span>
                  ) : (
                    <span className="not-restricted">Нет</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleRestriction(video)}
                    className={`toggle-button ${
                      video.is_restricted ? 'restrict' : 'unrestrict'
                    }`}
                  >
                    {video.is_restricted ? 'Снять ограничение' : 'Ограничить'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

