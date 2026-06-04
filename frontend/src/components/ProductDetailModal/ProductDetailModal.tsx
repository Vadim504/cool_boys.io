import './ProductDetailModal.css';
import PriceButton from '../PriceButton/PriceButton';
import { useUiNavigation } from '../../hooks/useUiNavigation';
import { productsData } from '../../data/product';
import type { Product } from '../../types';

type ProductDetailModalProps = {
  product: Product;
  onClose: () => void;
};

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const ui = useUiNavigation();
  const nutrition = product.nutrition;
  const similarProducts = productsData
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn-round close-btn-round--sm close-detail-btn" onClick={onClose}>×</button>

        <div className="detail-left">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          {similarProducts.length > 0 && (
            <div className="similar-products">
              <h3>Что еще пригодится</h3>
              <div className="similar-list">
                {similarProducts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="similar-item"
                    onClick={() => ui.openProductDetail(item.id)}
                    aria-label={`Открыть ${item.name}`}
                  >
                    <img src={item.image} alt="" />
                    <div className="similar-name">{item.name}</div>
                    <div className="similar-price">{item.price} ₽</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>
          <span className="detail-weight">{product.weight}</span>

          <div className="detail-description">
            <h3>Описание</h3>
            <p>{product.description || 'Описание товара уточняется.'}</p>
          </div>

          {nutrition && (
            <div className="nutrition-section">
              <div className="nutrition-header">
                <h3>Пищевая ценность</h3>
                <span>на {nutrition.per}</span>
              </div>
              <div className="nutrition-grid">
                <div>
                  <span className="nutrition-value">{nutrition.calories}</span>
                  <span className="nutrition-label">Ккал</span>
                </div>
                <div>
                  <span className="nutrition-value">{nutrition.proteins} г</span>
                  <span className="nutrition-label">Белки</span>
                </div>
                <div>
                  <span className="nutrition-value">{nutrition.fats} г</span>
                  <span className="nutrition-label">Жиры</span>
                </div>
                <div>
                  <span className="nutrition-value">{nutrition.carbohydrates} г</span>
                  <span className="nutrition-label">Углеводы</span>
                </div>
              </div>
            </div>
          )}

          <div className="detail-description">
            <h3>Состав</h3>
            <p>{product.composition || 'Состав товара уточняется.'}</p>
          </div>

          <div className="detail-footer">
            <PriceButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
