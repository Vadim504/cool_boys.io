import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AddressForm.css';

// Координаты для фокуса карты
const CITY_COORDS = {
  "Москва и рядом": [55.75, 37.61],
  "Санкт-Петербург": [59.93, 30.33],
  "Казань": [55.79, 49.12],
  "Екатеринбург": [56.83, 60.60],
  "Краснодар": [45.03, 38.97]
};

const AddressForm = ({ onClose, onBackToList, onSaveNewAddress }) => {
  const [formStep, setFormStep] = useState('city'); // 'city' или 'street'
  const [formValues, setFormValues] = useState({
    city: '', street: '', apt: '', floor: '', entrance: '', intercom: '', comment: ''
  });

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // Инициализация карты
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([55.75, 37.61], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);

      mapInstance.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) { markerRef.current.setLatLng(e.latlng); } 
        else { markerRef.current = L.marker(e.latlng).addTo(mapInstance.current); }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`);
          const data = await res.json();
          if (data.address) {
            const street = data.address.road || data.address.pedestrian || '';
            const house = data.address.house_number || '';
            setFormValues(prev => ({ ...prev, street: `${street}${house ? ', ' + house : ''}` }));
          }
        } catch (err) { console.error(err); }
      });
    }
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  const handleCitySelect = (cityName) => {
    setFormValues({ ...formValues, city: cityName });
    setFormStep('street');
    if (mapInstance.current) {
      mapInstance.current.flyTo(CITY_COORDS[cityName], 15);
      setTimeout(() => mapInstance.current.invalidateSize(), 300);
    }
  };

  // ТА САМАЯ ФУНКЦИЯ, КОТОРОЙ НЕ ХВАТАЛО
  const handleFinalSave = () => {
    if (!formValues.street) {
      alert("Выберите адрес на карте");
      return;
    }

    // 1. Собираем всё в одну строку
    let finalAddr = `${formValues.city}, ${formValues.street}`;
    if (formValues.apt) finalAddr += `, кв. ${formValues.apt}`;
    
    // 2. Передаем данные наверх (для сохранения в localStorage)
    onSaveNewAddress(finalAddr); 

    // 3. ВОТ ЭТОГО НЕ ХВАТАЛО: Переключаем вид обратно на список
    onBackToList(); 
  };


  return (
    <div className="address-modal-container">
      <div className="map-section">
        <div className="map-overlay-controls">
          <button className="control-btn" onClick={formStep === 'city' ? onBackToList : () => setFormStep('city')}>
            ←
          </button>
        </div>
        <div ref={mapRef} id="leaflet-map"></div>
      </div>

      <div className="form-section">
        <div className="form-header">
          <h2>Добавить адрес</h2>
        </div>

        {formStep === 'city' ? (
          <div className="inputs-scroll-area">
            <input type="text" className="address-input" placeholder="Поиск города..." />
            <div className="city-selection-list">
              {Object.keys(CITY_COORDS).map(city => (
                <div key={city} className="city-item" onClick={() => handleCitySelect(city)}>
                  {city}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="inputs-scroll-area">
              <input type="text" className="address-input" value={formValues.city} readOnly />
              <input 
                type="text" 
                className="address-input" 
                placeholder="Улица и дом" 
                value={formValues.street} 
                onChange={(e) => setFormValues({...formValues, street: e.target.value})}
              />

              <div className="input-grid">
                <input type="text" className="address-input" placeholder="Квартира" onChange={(e) => setFormValues({...formValues, apt: e.target.value})} />
                <input type="text" className="address-input" placeholder="Этаж" onChange={(e) => setFormValues({...formValues, floor: e.target.value})} />
                <input type="text" className="address-input" placeholder="Подъезд" onChange={(e) => setFormValues({...formValues, entrance: e.target.value})} />
                <input type="text" className="address-input" placeholder="Домофон" onChange={(e) => setFormValues({...formValues, intercom: e.target.value})} />
              </div>

              <input type="text" className="address-input" placeholder="Комментарий" onChange={(e) => setFormValues({...formValues, comment: e.target.value})} />
            </div>

          <button className="confirm-button" onClick={handleFinalSave}>
            Да, всё верно
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressForm;