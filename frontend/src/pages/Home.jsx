import 'leaflet/dist/leaflet.css';
import logo from "../asse s/logo.svg";    
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, MessageSquare, ChevronRight, X, ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Исправляем баг иконок Leaflet в React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Home = () => {
  // --- Состояния (State) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('list'); // 'list' или 'map'
  const [addresses, setAddresses] = useState(JSON.parse(localStorage.getItem('deliveryAddresses')) || []);
  const [currentAddress, setCurrentAddress] = useState(localStorage.getItem('lastSelectedAddress') || "улица Баумана, 1 к1");
  const [streetInput, setStreetInput] = useState('');
  const [mapPos, setMapPos] = useState([55.79, 49.12]); // Казань по умолчанию

  // --- Функции ---
  const handleSaveAddress = () => {
    if (!streetInput) return;
    const newAddrs = [...addresses, streetInput];
    setAddresses(newAddrs);
    setCurrentAddress(streetInput);
    localStorage.setItem('deliveryAddresses', JSON.stringify(newAddrs));
    localStorage.setItem('lastSelectedAddress', streetInput);
    setIsModalOpen(false);
    setStep('list');
  };

  // Компонент для обработки кликов по карте
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapPos([lat, lng]);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`);
          const data = await res.json();
          if (data.address) {
            const addr = `${data.address.road || ''} ${data.address.house_number || ''}`.trim();
            setStreetInput(addr);
          }
        } catch (err) { console.error("Ошибка геокодинга", err); }
      },
    });
    return <Marker position={mapPos} />;
  }

  return (
    <div className="container">
      {/* Левая панель (Sidebar) */}
      <aside className="sidebar">
        <div className="catalog-header">
          <h2 className="catalog-title">Каталог</h2>
        </div>
        <ul className="category-list">
          {['Готовая еда', 'Овощи и фрукты', 'Молоко, яйца и сыр'].map((cat) => (
            <li key={cat} className="category-item">
              <span className="category-name">{cat}</span>
              <span className="category-arrow"><ChevronRight size={16} /></span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Основной контент */}
      <main className="main-content">
        <div className="page-header">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Поиск..." />
          </div>
        </div>
        <div className="products-area">
          {/* Тут будут твои товары */}
          <p style={{padding: '20px'}}>Выберите категорию, чтобы увидеть товары...</p>
        </div>
      </main>

      {/* Правая панель (Карта и Корзина) */}
      <aside className="map-sidebar">
        <div className="top-actions">
          <button className="login-btn-top">Войти</button>
          <button className="support-btn"><MessageSquare size={20} /></button>
        </div>
        
        <div className="map-card" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>
          <div className="address-selector">
            <span className="address-current">{currentAddress}</span>
            <span className="address-chevron">▾</span>
          </div>
        </div>

        <div className="cart-title">Корзина</div>
        <div className="cart-info">
          <p className="cart-message">Соберите корзину,<br/>а мы всё быстро привезём</p>
        </div>
      </aside>

      {/* Модальное окно (Условный рендеринг) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              {step === 'map' && <ArrowLeft onClick={() => setStep('list')} style={{cursor: 'pointer'}} />}
              <h3>{step === 'list' ? 'Выберите адрес' : 'Укажите на карте'}</h3>
              <X onClick={() => setIsModalOpen(false)} style={{cursor: 'pointer'}} />
            </div>

            {step === 'list' ? (
              <div className="modal-body">
                <div className="address-list">
                  {addresses.map((addr, i) => (
                    <div key={i} className="address-item" onClick={() => { setCurrentAddress(addr); setIsModalOpen(false); }}>
                      {addr}
                    </div>
                  ))}
                </div>
                <button className="add-address-btn" onClick={() => setStep('map')}>Новый адрес</button>
              </div>
            ) : (
              <div className="map-screen-react" style={{height: '400px'}}>
                <MapContainer center={mapPos} zoom={13} style={{ height: '250px', borderRadius: '15px' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler />
                </MapContainer>
                <div style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <input 
                    type="text" 
                    className="address-input" 
                    value={streetInput} 
                    onChange={(e) => setStreetInput(e.target.value)} 
                    placeholder="Улица и дом"
                  />
                  <button className="save-address-btn" onClick={handleSaveAddress} style={{background: '#ff2d55', color: 'white', border: 'none', padding: '12px', borderRadius: '10px'}}>
                    Подтвердить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;