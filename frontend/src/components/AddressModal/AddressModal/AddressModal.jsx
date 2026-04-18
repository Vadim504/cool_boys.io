import React, { useState, useEffect } from 'react';
import AddressList from '../AddressList/AddressList';
import AddressForm from '../AddressForm/AddressForm';
import './AddressModal.css';

const AddressModal = ({ isOpen, onClose, onSelectFinalAddress }) => {
  const [modalView, setModalView] = useState('list'); 
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('deliveryAddresses')) || [];
      const lastSelected = localStorage.getItem('lastSelectedAddress') || '';
      setSavedAddresses(saved);
      setCurrentAddress(lastSelected);
      setModalView('list'); 
    }
  }, [isOpen]);

  const addNewAddress = (newAddressString) => {
    const trimmedAddress = newAddressString.trim();
    if (savedAddresses.includes(trimmedAddress)) {
      setModalView('list'); 
      return;
    }
    setSavedAddresses((prev) => {
      const updated = [...prev, trimmedAddress];
      localStorage.setItem('deliveryAddresses', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('lastSelectedAddress', trimmedAddress);
    setCurrentAddress(trimmedAddress);
    setModalView('list'); 
  };

  const handleConfirmAddress = () => {
    const city = "Москва и рядом"; 
    const street = "Моховая улица"; 
    const fullAddress = `${city}, ${street}`; 
    addNewAddress(fullAddress);
    setModalView('list');
  };

  const handleSelectAddress = (addr) => {
    setCurrentAddress(addr);
    localStorage.setItem('lastSelectedAddress', addr);
    
    if (typeof onSelectFinalAddress === 'function') {
      onSelectFinalAddress(addr);
    } else {
      console.warn("onSelectFinalAddress не передан как пропс");
    }
    
    onClose();
  };

  const deleteAddress = (addressToDelete) => {
    const updated = savedAddresses.filter(addr => addr !== addressToDelete);
    setSavedAddresses(updated);
    localStorage.setItem('deliveryAddresses', JSON.stringify(updated));
    
    // Если удалили тот, что был выбран — сбрасываем выбор
    if (currentAddress === addressToDelete) {
      setCurrentAddress('');
      localStorage.removeItem('lastSelectedAddress');
    }
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
            addresses={savedAddresses} 
            currentAddress={currentAddress}
            onSelectAddress={handleSelectAddress}
            onDeleteAddress={deleteAddress}
            onGoToMap={() => setModalView('form')}
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