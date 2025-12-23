import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './UploadVideo.css';

export default function UploadVideo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.file) {
      setError('Выберите файл');
      return;
    }

    if (!formData.title.trim()) {
      setError('Введите название');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description || '');
      uploadData.append('file', formData.file);

      const response = await api.post('/videos', uploadData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      navigate(`/videos/${response.data.id}`);
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      let errorMessage = 'Ошибка загрузки видео';
      
      if (error.response) {
        // Сервер вернул ответ с ошибкой
        const responseData = error.response.data;
        
        if (responseData?.errors?.file) {
          errorMessage = Array.isArray(responseData.errors.file) 
            ? responseData.errors.file[0] 
            : responseData.errors.file;
        } else if (responseData?.errors?.title) {
          errorMessage = Array.isArray(responseData.errors.title)
            ? responseData.errors.title[0]
            : responseData.errors.title;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.file) {
          errorMessage = Array.isArray(responseData.file)
            ? responseData.file[0]
            : responseData.file;
        } else {
          // Показываем все ошибки валидации
          const allErrors = [];
          if (responseData?.errors) {
            Object.values(responseData.errors).forEach(err => {
              if (Array.isArray(err)) {
                allErrors.push(...err);
              } else {
                allErrors.push(err);
              }
            });
          }
          if (allErrors.length > 0) {
            errorMessage = allErrors.join('. ');
          }
        }
      } else if (error.request) {
        errorMessage = 'Нет ответа от сервера. Проверьте подключение.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-video">
      <h1>Загрузить видеоролик</h1>
      <button onClick={() => navigate('/')} className="back-button">
        ← Назад к списку
      </button>

      <div className="upload-card">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Видеофайл *</label>
            <input
              type="file"
              id="file"
              name="file"
              accept="video/*"
              onChange={handleChange}
              required
            />
            <small>Поддерживаемые форматы: MP4, AVI, MPEG, MOV, WMV, FLV, WEBM, MKV (макс. 500MB)</small>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </form>
      </div>
    </div>
  );
}

