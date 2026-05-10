// src/App.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleProfile, toggleAuth } from './store/uiSlice';
import AppRouter from './routes/Router';
import Profile from './components/Profile/Profile';
import AuthModal from './components/AuthModal/AuthModal';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  
  // Слушаем Redux: нужно ли показывать окна?
  const isProfileOpen = useSelector((state) => state.ui.isProfileOpen);
  const isAuthOpen = useSelector((state) => state.ui.isAuthOpen);

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