import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
  if (!isOpen || !user) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Шапка с крестиком */}
        <button className="profile-close-btn" onClick={onClose}>×</button>
        
        {/* Инфо о пользователе */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.name || 'Пользователь'}</h2>
            <div className="profile-phone">
              <span className="sber-id-badge">🟢 Сбер ID</span>
              <span>{user.phone || '+7 (___) ___-__-__'}</span>
            </div>
          </div>
        </div>

        {/* Бонусы и подписки */}
        <div className="profile-bonuses">
          <div className="bonus-card">
            <div className="bonus-amount">13 🟢</div>
            <div className="bonus-label">Бонусы Спасибо</div>
          </div>
          <div className="bonus-card prime-card">
            <div className="prime-label">СберПрайм ✅</div>
            <div className="prime-action">Подключить</div>
          </div>
        </div>

        {/* История заказов */}
        <div className="profile-section">
          <h3 className="section-title">История заказов</h3>
          <div className="orders-empty">
            Здесь будут храниться ваши заказы
          </div>
        </div>

        {/* Меню профиля */}
        <div className="profile-menu">
          <div className="menu-item">
            <span>📍</span>
            <span>Адреса</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>💳</span>
            <span>Оплата</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>⚙️</span>
            <span>Настройки</span>
            <span className="arrow">›</span>
          </div>
          <div className="menu-item">
            <span>💬</span>
            <span>Связаться с нами</span>
            <span className="arrow">›</span>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button className="logout-btn" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
}