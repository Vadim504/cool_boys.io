import { addToCart, removeFromCart } from '../../store/cartSlice'; // Путь к вашему слайсу
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Product } from '../../types';
import './ProductCard.css';

type ProductCardProps = {
  product: Product;
  onOpenDetail: () => void;
};

const ProductCard = ({ product, onOpenDetail }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  // Получаем текущее количество товара в корзине из Redux
  const cartItem = useAppSelector(state => 
    state.cart.items.find(item => item.id === product.id)
  );
  const count = cartItem ? cartItem.quantity : 0;

  // Логика проверки остатка на складе
  const canIncrement = product.stock > count;

  const increment = () => {
    if (canIncrement) {
      dispatch(addToCart(product));
    }
  };

  const decrement = () => dispatch(removeFromCart(product.id));

  return (
    // 1. Вешаем клик для открытия деталей на всю карточку
    <div className="product-card" onClick={onOpenDetail}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <div className="product-price-row">
          <span className="current-price">{product.price} ₽</span>
          {product.oldPrice && <span className="old-price">{product.oldPrice} ₽</span>}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-weight">{product.weight}</p>
      </div>

      {/* 2. ВАЖНО: stopPropagation предотвращает открытие модалки при клике на кнопки */}
      <div className="product-controls" onClick={(e) => e.stopPropagation()}>
        {count === 0 ? (
          <button 
            className="add-button" 
            onClick={increment}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Нет' : <span className="plus-icon">+</span>}
          </button>
        ) : (
          <div className="stepper">
            <button onClick={decrement}>−</button>
            <span className="count">{count}</span>
            <button 
              onClick={increment} 
              disabled={!canIncrement}
              className={!canIncrement ? "disabled-btn" : ""}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
