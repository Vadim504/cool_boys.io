// src/App.jsx
import {
  closeAddressModal,
  closeCheckout,
  closeProductDetail,
  closeSupport,
  toggleAuth,
  toggleProfile,
} from './store/uiSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { productsData } from './data/product';
import AppRouter from './routes/Router';
import Profile from './components/Profile/Profile';
import AuthModal from './components/AuthModal/AuthModal';
import AddressModal from './components/AddressModal/AddressModal/AddressModal';
import ProductDetailModal from './components/ProductDetailModal/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal/CheckoutModal';
import SupportChat from './components/SupportChat/SupportChat';
import './App.css';

const App = () => {
  const dispatch = useAppDispatch();
  
  // Слушаем Redux: нужно ли показывать окна?
  const isProfileOpen = useAppSelector((state) => state.ui.isProfileOpen);
  const isAuthOpen = useAppSelector((state) => state.ui.isAuthOpen);
  const isAddressOpen = useAppSelector((state) => state.ui.isAddressOpen);
  const isCheckoutOpen = useAppSelector((state) => state.ui.isCheckoutOpen);
  const isSupportOpen = useAppSelector((state) => state.ui.isSupportOpen);
  const selectedProductId = useAppSelector((state) => state.ui.selectedProductId);
  const selectedProduct = productsData.find((product) => product.id === selectedProductId) ?? null;

  return (
    <div className="app">
      <AppRouter />

      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => dispatch(toggleProfile(false))} 
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => dispatch(toggleAuth(false))} 
      />
      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => dispatch(closeAddressModal())}
      />
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => dispatch(closeProductDetail())}
        />
      )}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => dispatch(closeCheckout())}
      />
      {isSupportOpen && (
        <SupportChat onClose={() => dispatch(closeSupport())} />
      )}
    </div>
  );
};

export default App;
