import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAddresses } from '../../hooks/useAddresses';
import './AddressModal.css';

const CITY_COORDS = {
  "Москва и рядом": [55.75, 37.61],
  "Санкт-Петербург": [59.93, 30.33],
  "Казань": [55.79, 49.12],
  "Екатеринбург": [56.83, 60.60],
  "Краснодар": [45.03, 38.97]
};

export default function AddressModal({ isOpen, onClose, onAddressSelect }) {
  const [screen, setScreen] = useState('list'); // 'list' | 'map'
  const [formStep, setFormStep] = useState('city'); // 'city' | 'street' | 'details'
  const [addressData, setAddressData] = useState({
    street: '', house: '', city: '', apt: '', floor: '', entrance: '', intercom: '', comment: ''
  });

  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { addAddress } = useAddresses();

  // === Управление размером окна ===
  useEffect(() => {
    const content = modalRef.current?.querySelector('.modal-content');
    if (content) {
      if (screen === 'map') {
        content.classList.add('map-mode');
      } else {
        content.classList.remove('map-mode');
      }
    }
  }, [screen]);

  // === Инициализация карты ===
  useEffect(() => {
    if (isOpen && screen === 'map' && !mapRef.current) {
      // Небольшая задержка, чтобы контейнер отрендерился
      setTimeout(() => {
        mapRef.current = L.map('leaflet-map').setView([55.75, 37.61], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(mapRef.current);

        // Обработчик клика по карте
        mapRef.current.on('click', async (e) => {
          const { lat, lng } = e.latlng;

          // Маркер
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
          }

          // Показать блок с деталями
          setFormStep('street');

          // Геокодирование
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru&addressdetails=1`
            );
            const data = await response.json();

            if (data?.address) {
              const addr = data.address;
              let street = addr.road || addr.street || addr.pedestrian || '';
              let house = addr.house_number || '';

              // Поиск номера дома в display_name, если нет в house_number
              if (!house && data.display_name) {
                const match = data.display_name.match(/(?:дом|д\.?)\s*(\d+[а-яА-Я]?)/i);
                if (match) house = match[1];
              }

              const city = addr.city || addr.town || addr.village || '';
              setAddressData(prev => ({
                ...prev,
                street: `${street}${house ? `, дом ${house}` : ''}`,
                city: city
              }));
              setFormStep('details');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            setAddressData(prev => ({ ...prev, street: 'Ошибка определения адреса' }));
          }
        });
      }, 50);
    }

    // Cleanup при размонтировании
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, screen]);

  // === Закрытие по клику на фон ===
  useEffect(() => {
    const handleOverlayClick = (e) => {
      if (e.target === modalRef.current) {
        handleClose();
      }
    };
    if (isOpen) {
      modalRef.current?.addEventListener('click', handleOverlayClick);
    }
    return () => {
      modalRef.current?.removeEventListener('click', handleOverlayClick);
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose?.();
    resetState();
  };

  const resetState = () => {
    setScreen('list');
    setFormStep('city');
    setAddressData({ street: '', house: '', city: '', apt: '', floor: '', entrance: '', intercom: '', comment: '' });
  };

  const handleCitySelect = (cityName) => {
    setAddressData(prev => ({ ...prev, city: cityName }));
    if (mapRef.current && CITY_COORDS[cityName]) {
      mapRef.current.setView(CITY_COORDS[cityName], 12);
    }
    setFormStep('street');
  };

  const handleSaveAddress = () => {
    if (!addressData.street) {
      alert('Пожалуйста, введите адрес');
      return;
    }

    let fullAddress = addressData.street;
    if (addressData.apt) fullAddress += `, кв. ${addressData.apt}`;
    if (addressData.entrance) fullAddress += `, под. ${addressData.entrance}`;
    if (addressData.floor) fullAddress += `, эт. ${addressData.floor}`;

    // Сохранение в localStorage
    const saved = JSON.parse(localStorage.getItem('deliveryAddresses')) || [];
    saved.push(fullAddress);
    localStorage.setItem('deliveryAddresses', JSON.stringify(saved));
    localStorage.setItem('lastSelectedAddress', fullAddress);

    addAddress(fullAddress);
    onAddressSelect?.(fullAddress);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" ref={modalRef}>
      <div className="modal-content">
        {screen === 'list' ? (
          // === ЭКРАН СПИСКА АДРЕСОВ ===
          <div className="selection-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="modal-header">
              <h3>Выберите адрес доставки</h3>
              <span className="close-btn" onClick={handleClose}>&times;</span>
            </div>
            
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
              {JSON.parse(localStorage.getItem('deliveryAddresses') || '[]').map((addr, idx) => (
                <div 
                  key={idx} 
                  className="address-item"
                  onClick={() => {
                    onAddressSelect?.(addr);
                    handleClose();
                  }}
                >
                  <div className="address-info">
                    <div className="address-main">{addr}</div>
                  </div>
                  <div className="address-check"></div>
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="add-address-btn" onClick={() => setScreen('map')}>
                Новый адрес
              </button>
            </div>
          </div>
        ) : (
          // === ЭКРАН КАРТЫ ===
          <div className="map-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="modal-header">
              <button 
                onClick={() => {
                  if (formStep === 'city') handleClose();
                  else if (formStep === 'details') setFormStep('street');
                  else setFormStep('city');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
              >
                ←
              </button>
              <h3 style={{ flex: 1, margin: '0 10px' }}>
                {formStep === 'city' ? 'Выберите город' : 
                 formStep === 'street' ? 'Введите адрес' : 'Подтвердите адрес'}
              </h3>
              <span className="close-btn" onClick={handleClose}>&times;</span>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: 20, overflow: 'hidden', paddingTop: 10 }}>
              {/* Карта */}
              <div id="leaflet-map" style={{ flex: 1.5, background: '#eee', borderRadius: 16 }} />

              {/* Форма */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                
                {/* Выбор города */}
                {formStep === 'city' && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Поиск города..." 
                      className="address-input"
                      style={{ width: '100%' }}
                    />
                    <ul className="city-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {Object.keys(CITY_COORDS).map(city => (
                        <li 
                          key={city} 
                          className="city-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Ввод улицы */}
                {(formStep === 'street' || formStep === 'details') && (
                  <>
                    <input 
                      type="text" 
                      value={addressData.city} 
                      readOnly 
                      className="address-input"
                      style={{ background: '#f5f5f5', color: '#888' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Улица и дом" 
                      value={addressData.street}
                      onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                      className="address-input"
                      autoFocus
                    />
                  </>
                )}

                {/* Детали адреса */}
                {formStep === 'details' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input 
                        type="text" 
                        placeholder="Квартира/офис" 
                        className="address-input"
                        onChange={(e) => setAddressData(prev => ({ ...prev, apt: e.target.value }))}
                      />
                      <input 
                        type="text" 
                        placeholder="Этаж" 
                        className="address-input"
                        onChange={(e) => setAddressData(prev => ({ ...prev, floor: e.target.value }))}
                      />
                      <input 
                        type="text" 
                        placeholder="Подъезд" 
                        className="address-input"
                        onChange={(e) => setAddressData(prev => ({ ...prev, entrance: e.target.value }))}
                      />
                      <input 
                        type="text" 
                        placeholder="Домофон" 
                        className="address-input"
                        onChange={(e) => setAddressData(prev => ({ ...prev, intercom: e.target.value }))}
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Комментарий" 
                      className="address-input"
                      onChange={(e) => setAddressData(prev => ({ ...prev, comment: e.target.value }))}
                    />
                    <button className="save-btn" onClick={handleSaveAddress}>
                      Да, всё верно
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}