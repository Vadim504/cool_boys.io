import { useState } from 'react';
import AddressList from '../AddressList/AddressList';
import AddressForm from '../AddressForm/AddressForm';
import { addAddress, setSelectedAddress } from '../../../store/addressSlice';
import { useAppDispatch } from '../../../store/hooks';
import './AddressModal.css';

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFinalAddress?: (address: string) => void;
};

const AddressModal = ({ isOpen, onClose, onSelectFinalAddress }: AddressModalProps) => {
  const dispatch = useAppDispatch();
  const [modalView, setModalView] = useState('list'); 

  const handleClose = () => {
    setModalView('list');
    onClose();
  };

 const addNewAddress = (newAddressString: string) => {
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
    <div className="modal-overlay active" onClick={handleClose}>
      <div 
        className={`modal-content ${modalView === 'form' ? 'wide' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={handleClose}>
          ×
        </button>

        {modalView === 'list' ? (
          <AddressList 
            onGoToMap={() => setModalView('form')}
            onClose={handleClose}
          />
        ) : (
          <AddressForm 
            onBackToList={() => setModalView('list')}
            onSaveNewAddress={(newAddr) => addNewAddress(newAddr)} 
          />
        )}
      </div>
    </div>
  );
};

export default AddressModal;
