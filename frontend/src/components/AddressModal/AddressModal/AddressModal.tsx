import { useState } from 'react';
import AddressList from '../AddressList/AddressList';
import AddressForm from '../AddressForm/AddressForm';
import { addAddress } from '../../../store/addressSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useUiNavigation } from '../../../hooks/useUiNavigation';
import type { Address } from '../../../types';
import './AddressModal.css';

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddressModal = ({ isOpen, onClose }: AddressModalProps) => {
  const dispatch = useAppDispatch();
  const ui = useUiNavigation();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const [modalView, setModalView] = useState('list'); 

  const handleClose = () => {
    setModalView('list');
    onClose();
  };

 const addNewAddress = (newAddress: Address) => {
    dispatch(addAddress(newAddress));
    setModalView('list');
  };

  if (!isOpen) return null;

  const handleOpenAuth = () => {
    handleClose();
    ui.openAuth();
  };

  return (
    <div className="modal-overlay active address-modal-overlay" onClick={handleClose}>
      <div 
        className={`modal-content ${modalView === 'form' ? 'wide' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-btn-round close-btn-round--md modal-close-button" onClick={handleClose}>
          ×
        </button>

        {!isAuth ? (
          <div className="selection-screen">
            <div className="selection-header">
              <h2>Войдите в профиль</h2>
            </div>
            <div className="selection-body">
              <div className="empty-message">Чтобы сохранять и выбирать адреса доставки</div>
            </div>
            <div className="selection-footer">
              <button type="button" className="btn btn--primary btn--lg btn--block" onClick={handleOpenAuth}>
                Войти
              </button>
            </div>
          </div>
        ) : modalView === 'list' ? (
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
