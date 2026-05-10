/*import React from 'react';
import './AddressList.css';

// 1. Добавляем onDeleteAddress в аргументы
const AddressList = ({ addresses, currentAddress, onSelectAddress, onGoToMap, onDeleteAddress }) => {
  return (
    <div className="selection-screen">
      <div className="selection-header">
        <h2>Выбрать адрес</h2>
      </div>

      <div className="selection-body">
        {addresses.length === 0 ? (
          <div className="empty-message">У вас пока нет сохраненных адресов.</div>
        ) : (
          <div className="address-items-list">
            {addresses.map((addr, index) => {
              const [street, city] = addr.split(', ');
              const isActive = addr === currentAddress;

              return (
                <div 
                  key={index} 
                  className={`address-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectAddress(addr)}
                >
        
                  <button 
                    className="delete-address-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Чтобы при удалении не выбирался адрес
                      onDeleteAddress(addr);
                    }}
                  >
                    ×
                  </button>

                  <div className="address-texts">
                    <div className="street-name">{street || addr}</div>
                    <div className="city-name">{city || 'Казань'}</div>
                  </div>
                  <div className="radio-circle">
                    {isActive && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="selection-footer">
        <button className="add-btn-main" onClick={onGoToMap}>
          Новый адрес
        </button>
      </div>
    </div>
  );
};
export default AddressList;
*/

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedAddress, removeAddress } from '../../../store/addressSlice'; // проверьте путь к слайсу
import './AddressList.css';

const AddressList = ({ onGoToMap, onClose }) => {
  const dispatch = useDispatch();
  
  // 1. Берем данные напрямую из Redux
  const addresses = useSelector((state) => state.addresses.items);
  const currentAddress = useSelector((state) => state.addresses.selectedAddress);

  const handleSelect = (addr) => {
    // 2. Выбираем адрес в Redux
    dispatch(setSelectedAddress(addr));
    // Закрываем модалку (функция передана из AddressModal)
    if (onClose) onClose(); 
  };

  const handleDelete = (e, addr) => {
    e.stopPropagation(); // Важно: чтобы при клике на крестик не сработал выбор адреса
    // 3. Удаляем адрес в Redux
    dispatch(removeAddress(addr));
  };

  return (
    <div className="selection-screen">
      <div className="selection-header">
        <h2>Выбрать адрес</h2>
      </div>

      <div className="selection-body">
        {addresses.length === 0 ? (
          <div className="empty-message">У вас пока нет сохраненных адресов.</div>
        ) : (
          <div className="address-items-list">
            {addresses.map((addr, index) => {
              const [street, city] = addr.split(', ');
              const isActive = addr === currentAddress;

              return (
                <div 
                  key={index} 
                  className={`address-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(addr)}
                >
                  {/* Кнопка удаления */}
                  <button 
                    className="delete-address-btn"
                    onClick={(e) => handleDelete(e, addr)}
                    title="Удалить адрес"
                  >
                    ×
                  </button>

                  <div className="address-texts">
                    <div className="street-name">{street || addr}</div>
                    <div className="city-name">{city || 'Казань'}</div>
                  </div>
                  
                  <div className="radio-circle">
                    {isActive && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="selection-footer">
        <button className="add-btn-main" onClick={onGoToMap}>
          Новый адрес
        </button>
      </div>
    </div>
  );
};

export default AddressList;