import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice'; // Экшен, который мы создали в прошлом шаге
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './Profile.css';

type ProfileProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Profile = ({ isOpen, onClose }: ProfileProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Достаем данные из Redux
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);
  const addresses = useAppSelector((state) => state.addresses.items);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Возвращаемся на главную после выхода
    onClose();
  };

  if (!isAuth) {
    return (
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile-container" onClick={(e) => e.stopPropagation()}>
          <button className="profile-close-btn" onClick={onClose}>×</button>
          <div className="empty-profile">
            <h2>Войдите в профиль</h2>
            <p>Чтобы видеть историю заказов и сохраненные адреса</p>
            <button className="auth-btn" onClick={() => {/* Открыть модалку регистрации */}}>
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose}>×</button>
        <header className="profile-header">
          <h1>Профиль</h1>
          <div className="user-card">
            <div className="user-icon">👤</div>
            <div className="user-info">
              <span className="user-phone">{phoneNumber}</span>
              <span className="user-status">Постоянный клиент</span>
            </div>
          </div>
        </header>

        <section className="profile-section">
          <h3>Мои адреса</h3>
          <div className="address-list-profile">
            {addresses.length > 0 ? (
              addresses.map((addr, i) => (
                <div key={i} className="address-row">📍 {addr}</div>
              ))
            ) : (
              <p className="no-data">Адреса не добавлены</p>
            )}
          </div>
        </section>

        <section className="profile-section">
          <h3>Заказы</h3>
          <div className="orders-placeholder">
            <p className="no-data">У вас пока нет заказов</p>
          </div>
        </section>

        <button className="logout-btn" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default Profile;
