import { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import MainContent from './components/main_content/MainContent';
import MapSidebar from './components/map_sidebar/MapSidebar';
import AddressModal from './components/address_modal/AddressModal';
import SupportModal from './components/support_modal/SupportModal';
import AuthModal from './components/auth/AuthModal';
import ProfileModal from './components/profile/ProfileModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('улица Баумана, 1 к1');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ
  const [user, setUser] = useState(null); 

  const handleLogin = (userData) => {
    setUser(userData); // Запоминаем пользователя
  };

  const handleLogout = () => {
    setUser(null); // Выходим
  };

  return (
    <div className="container">
      <Sidebar />
      <MainContent />
      <MapSidebar 
        currentAddress={currentAddress} 
        onAddressClick={() => setIsModalOpen(true)} 
        onSupportClick={() => setIsSupportModalOpen(true)}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)} 
        onLogout={handleLogout}
        user={user}
      />
      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddressSelect={setCurrentAddress}
      />
      <SupportModal 
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Окно авторизации */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      {/* ← Новый компонент профиля */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;