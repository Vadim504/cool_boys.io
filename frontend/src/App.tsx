import { useAppSelector } from './store/hooks';
import { productsData } from './data/product';
import AppRouter from './routes/Router';
import Profile from './components/Profile/Profile';
import AuthModal from './components/AuthModal/AuthModal';
import AddressModal from './components/AddressModal/AddressModal/AddressModal';
import ProductDetailModal from './components/ProductDetailModal/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal/CheckoutModal';
import SupportChat from './components/SupportChat/SupportChat';
import ModalUrlSync from './components/ModalUrlSync';
import { useUiNavigation } from './hooks/useUiNavigation';
import './App.css';

const App = () => {
  const ui = useUiNavigation();

  const isProfileOpen = useAppSelector((state) => state.ui.isProfileOpen);
  const isAuthOpen = useAppSelector((state) => state.ui.isAuthOpen);
  const isAddressOpen = useAppSelector((state) => state.ui.isAddressOpen);
  const isCheckoutOpen = useAppSelector((state) => state.ui.isCheckoutOpen);
  const isSupportOpen = useAppSelector((state) => state.ui.isSupportOpen);
  const selectedProductId = useAppSelector((state) => state.ui.selectedProductId);
  const selectedProduct = productsData.find((product) => product.id === selectedProductId) ?? null;

  return (
    <div className="app">
      <ModalUrlSync />
      <AppRouter />

      <Profile isOpen={isProfileOpen} onClose={ui.closeProfile} />
      <AuthModal isOpen={isAuthOpen} onClose={ui.closeAuth} />
      <AddressModal isOpen={isAddressOpen} onClose={ui.closeAddressModal} />
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={ui.closeProductDetail} />
      )}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={ui.closeCheckout} />
      {isSupportOpen && <SupportChat onClose={ui.closeSupport} />}
    </div>
  );
};

export default App;
