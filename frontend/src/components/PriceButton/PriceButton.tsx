import { addToCart, removeFromCart } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Product } from '../../types';

type PriceButtonProps = {
  product: Product;
  isCompact?: boolean;
};

const PriceButton = ({ product, isCompact = false }: PriceButtonProps) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => state.cart.items.find(i => i.id === product.id));
  const quantity = cartItem ? cartItem.quantity : 0;

  if (quantity === 0) {
    return (
      <button
        className="price-btn price-btn--initial"
        onClick={() => dispatch(addToCart(product))}
      >
        {product.price} ₽ <span className="plus-sign">+</span>
      </button>
    );
  }

  return (
    <div className={`stepper stepper--block price-btn--counter ${isCompact ? 'stepper--compact' : ''}`}>
      <button type="button" className="stepper__btn" onClick={() => dispatch(removeFromCart(product.id))}>
        −
      </button>
      <span className="stepper__count">{quantity}</span>
      <button type="button" className="stepper__btn" onClick={() => dispatch(addToCart(product))}>
        +
      </button>
    </div>
  );
};

export default PriceButton;
