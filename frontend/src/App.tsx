// src/App.jsx
import { toggleProfile, toggleAuth } from './store/uiSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import AppRouter from './routes/Router';
import Profile from './components/Profile/Profile';
import AuthModal from './components/AuthModal/AuthModal';
import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  
  // Слушаем Redux: нужно ли показывать окна?
  const isProfileOpen = useAppSelector((state) => state.ui.isProfileOpen);
  const isAuthOpen = useAppSelector((state) => state.ui.isAuthOpen);

  return (
    <div className="app">
      <AppRouter />

      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => dispatch(toggleProfile(false))} 
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => dispatch(toggleAuth(false))} 
      />
    </div>
  );
};

export default App;
