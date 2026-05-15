import { useState, useEffect } from 'react';
import { loginSuccess } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import './AuthModal.css';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState('phone'); // 'phone' или 'code'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);

  // Таймер обратного отсчета
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    if (phone.length < 10) return; // Простая валидация
    setStep('code');
    setTimer(59);
    // Здесь обычно идет вызов API (например, axios.post('/api/send-otp'))
  };

  const handleVerifyCode = () => {
    if (code.length === 4) {
      // Имитируем успешный вход
      dispatch(loginSuccess(`+7 ${phone}`));
      onClose();
      setStep('phone'); // Сбрасываем для следующего раза
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-content" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>

        {step === 'phone' ? (
          <div className="auth-step">
            <h2>Вход в сервис</h2>
            <p>Введите номер телефона, чтобы войти или зарегистрироваться</p>
            <div className="phone-input-field">
              <span className="prefix">+7</span>
              <input 
                type="tel" 
                autoFocus
                placeholder="900 000 00 00" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
              />
            </div>
            <button 
              className="auth-btn" 
              disabled={phone.length < 10}
              onClick={handleSendCode}
            >
              Получить код
            </button>
          </div>
        ) : (
          <div className="auth-step">
            <h2>Введите код</h2>
            <p>Мы отправили SMS с кодом на номер <br/><b>+7 {phone}</b></p>
            <input 
              type="text" 
              className="code-input"
              placeholder="0 0 0 0"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
            />
            <button 
              className="auth-btn" 
              disabled={code.length < 4}
              onClick={handleVerifyCode}
            >
              Подтвердить
            </button>
            <div className="resend-info">
              {timer > 0 ? (
                `Отправить повторно через ${timer} сек`
              ) : (
                <span className="resend-link" onClick={handleSendCode}>Отправить код еще раз</span>
              )}
            </div>
            <button className="change-phone-btn" onClick={() => setStep('phone')}>
              Изменить номер
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
