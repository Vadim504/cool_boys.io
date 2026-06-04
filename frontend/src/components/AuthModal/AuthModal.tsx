import { useState, useEffect } from 'react';
import { loginSuccess, registerSuccess } from '../../store/authSlice';
import { hydrateAddressesForUser } from '../../store/addressSlice';
import { hydrateOrdersForUser } from '../../store/ordersSlice';
import { useAppDispatch } from '../../store/hooks';
import { profileExists } from '../../utils/mockProfiles';
import './AuthModal.css';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState('phone'); // 'phone' или 'code'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [authError, setAuthError] = useState('');

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
    const phoneNumber = `+7 ${phone}`;
    const exists = profileExists(phoneNumber);

    if (mode === 'login' && !exists) {
      setAuthError('Пользователь с таким номером не найден');
      return;
    }

    if (mode === 'register' && exists) {
      setAuthError('Пользователь с таким номером уже зарегистрирован');
      return;
    }

    setAuthError('');
    setStep('code');
    setTimer(59);
    // Здесь обычно идет вызов API (например, axios.post('/api/send-otp'))
  };

  const handleVerifyCode = () => {
    if (code.length === 4) {
      // Имитируем успешный вход
      const phoneNumber = `+7 ${phone}`;
      dispatch(mode === 'register' ? registerSuccess(phoneNumber) : loginSuccess(phoneNumber));
      dispatch(hydrateAddressesForUser(phoneNumber));
      dispatch(hydrateOrdersForUser(phoneNumber));
      onClose();
      setStep('phone'); // Сбрасываем для следующего раза
      setCode('');
      setAuthError('');
    }
  };

  const handleModeChange = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setStep('phone');
    setCode('');
    setAuthError('');
  };

  if (!isOpen) return null;

  return (
    <div className="overlay overlay--center auth-overlay" onClick={onClose}>
      <div className="panel panel--modal auth-content" onClick={e => e.stopPropagation()}>
        <button type="button" className="close-btn-round close-btn-round--sm close-btn-round--absolute auth-close" onClick={onClose}>×</button>

        {step === 'phone' ? (
          <div className="auth-step">
            <div className="auth-mode-switch" role="tablist" aria-label="Режим авторизации">
              <button
                type="button"
                className={mode === 'login' ? 'auth-mode active' : 'auth-mode'}
                onClick={() => handleModeChange('login')}
              >
                Вход
              </button>
              <button
                type="button"
                className={mode === 'register' ? 'auth-mode active' : 'auth-mode'}
                onClick={() => handleModeChange('register')}
              >
                Регистрация
              </button>
            </div>
            <h2>{mode === 'login' ? 'Вход в сервис' : 'Регистрация'}</h2>
            <p>
              {mode === 'login'
                ? 'Введите номер телефона, который уже зарегистрирован'
                : 'Введите номер телефона, чтобы создать профиль'}
            </p>
            <div className="phone-input-field input input--filled">
              <span className="prefix">+7</span>
              <input 
                type="tel" 
                name="phone"
                autoComplete="tel-national"
                autoFocus
                placeholder="900 000 00 00" 
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  if (authError) setAuthError('');
                }}
                maxLength={10}
              />
            </div>
            {authError && <div className="auth-error">{authError}</div>}
            <button 
              className="btn btn--primary btn--lg btn--block"
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
              name="one-time-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="input input--code code-input"
              placeholder="0 0 0 0"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
            />
            <button 
              className="btn btn--primary btn--lg btn--block"
              disabled={code.length < 4}
              onClick={handleVerifyCode}
            >
              Подтвердить
            </button>
            <div className="resend-info">
              {timer > 0 ? (
                `Отправить повторно через ${timer} сек`
              ) : (
                <span className="btn--accent-link resend-link" onClick={handleSendCode}>Отправить код еще раз</span>
              )}
            </div>
            <button type="button" className="btn btn--link change-phone-btn" onClick={() => setStep('phone')}>
              Изменить номер
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
