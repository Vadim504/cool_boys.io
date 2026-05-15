import type { MouseEvent } from 'react';
import { setSelectedAddress, removeAddress } from '../../../store/addressSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import './AddressList.css';

type AddressListProps = {
  onGoToMap: () => void;
  onClose?: () => void;
};

const AddressList = ({ onGoToMap, onClose }: AddressListProps) => {
  const dispatch = useAppDispatch();
  
  // 1. Берем данные напрямую из Redux
  const addresses = useAppSelector((state) => state.addresses.items);
  const currentAddress = useAppSelector((state) => state.addresses.selectedAddress);

  const handleSelect = (addr: string) => {
    // 2. Выбираем адрес в Redux
    dispatch(setSelectedAddress(addr));
    // Закрываем модалку (функция передана из AddressModal)
    if (onClose) onClose(); 
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>, addr: string) => {
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
