import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice'; 
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // Получаем текущее количество этого товара в корзине
  const cartItem = useSelector(state => 
    state.cart.items.find(item => item.id === product.id)
  );
  
  const count = cartItem ? cartItem.quantity : 0;
  
  // Проверка: можно ли добавить еще одну единицу товара
  const canIncrement = count < product.stock;

  const increment = () => {
    if (canIncrement) {
      dispatch(addToCart(product));
    } else {
      // Можно вывести уведомление или просто ничего не делать
      console.log("Максимальное количество достигнуто");
    }
  };

  const decrement = () => dispatch(removeFromCart(product.id));

  return (
    <div className="product-card">
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
        {/* Опционально: показываем остаток */}
        <p style={{fontSize: '12px', color: 'gray'}}>В наличии: {product.stock}</p>
      </div>

      <div className="product-controls">
        {count === 0 ? (
          <button 
            className="add-button" 
            onClick={increment}
            disabled={product.stock === 0} // Отключаем, если товара нет на складе совсем
          >
            {product.stock === 0 ? 'Нет в наличии' : <span className="plus-icon">+</span>}
          </button>
        ) : (
          <div className="stepper">
            <button onClick={decrement}>−</button>
            <span className="count">{count}</span>
            {/* Отключаем кнопку +, если достигли лимита склада */}
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