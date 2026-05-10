import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AddressList from '../AddressList/AddressList';
import AddressForm from '../AddressForm/AddressForm';
import { addAddress, setSelectedAddress } from '../../../store/addressSlice';
import './AddressModal.css';

const AddressModal = ({ isOpen, onClose, onSelectFinalAddress }) => {
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState('list'); 

  useEffect(() => {
    if (isOpen) {
      setModalView('list'); 
    }
  }, [isOpen]);

 const addNewAddress = (newAddressString) => {
    const trimmedAddress = newAddressString.trim();
    if (!trimmedAddress) return;

    // Сохраняем адрес в Redux + localStorage (через редьюсер)
    dispatch(addAddress(trimmedAddress));
    dispatch(setSelectedAddress(trimmedAddress));

    // Обновляем адрес в родителе (для отображения в корзине)
    if (typeof onSelectFinalAddress === 'function') {
      onSelectFinalAddress(trimmedAddress);
    }

    setModalView('list');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div 
        className={`modal-content ${modalView === 'form' ? 'wide' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>

        {modalView === 'list' ? (
          <AddressList 
            onGoToMap={() => setModalView('form')}
            onClose={onClose}
          />
        ) : (
          <AddressForm 
            onClose={onClose}
            onBackToList={() => setModalView('list')}
            onSaveNewAddress={(newAddr) => addNewAddress(newAddr)} 
          />
        )}
      </div>
    </div>
  );
};

export default AddressModal;