import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import VideoList from './pages/VideoList';
import VideoDetail from './pages/VideoDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminVideos from './pages/AdminVideos';
import UploadVideo from './pages/UploadVideo';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Видеохостинг
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/upload">Загрузить видео</Link>
              {user.role === 'admin' && (
                <Link to="/admin/videos">Админ-панель</Link>
              )}
              <span className="nav-user">Привет, {user.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<VideoList />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<UploadVideo />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
