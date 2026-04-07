import { useState } from 'react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [phone, setPhone] = useState('');
  
  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone) return;
    
    // Имитация успешного входа
    onLogin({ name: "Пользователь", phone: phone });
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Левая часть: Форма */}
        <div className="auth-left">
          <div className="auth-logo">
             <div className="logo-icon">M</div> {/* Заглушка логотипа */}
          </div>
          <h2>Войдите в MyFood</h2>
          <p className="auth-subtitle">Чтобы начать заказывать</p>

          <form onSubmit={handleLogin}>
            <label>Телефон</label>
            <div className="input-wrapper">
              <span className="phone-prefix">+7</span>
              <input 
                type="tel" 
                placeholder="(900) 123-45-67" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
            </div>
            
            <button type="submit" className="auth-submit-btn">Продолжить</button>
          </form>
          
          <div className="auth-links">
            <a href="#">Войти по Сфер ID</a>
          </div>
        </div>

        {/* Правая часть: QR Код */}
        <div className="auth-right">
          <p>Наведите QR-сканер<br/>из приложения MyFood</p>
          <div className="qr-container">
            {/* Используем API для генерации фейкового QR кода */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LoginToMyFood`} alt="QR Code" />
          </div>
          <p className="qr-timer">Код обновится через 5:00</p>
        </div>

        <button className="auth-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}