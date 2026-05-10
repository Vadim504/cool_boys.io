// src/components/ProductDetailModal/ProductDetailModal.jsx
import React from 'react';
import './ProductDetailModal.css';
import PriceButton from '../PriceButton/PriceButton';
import { productsData } from '../../data/product';

const CATEGORY_HINTS = {
  dairy: 'молочный продукт',
  beverages: 'напиток',
  'vegetables-fruits': 'свежий продукт',
  fish: 'рыбный продукт',
  meat: 'мясной продукт',
  snacks: 'снек',
  sweets: 'десерт',
  frozen: 'замороженный продукт',
  bread: 'хлебобулочный продукт',
};

const parseWeightNumber = (weight = '') => {
  const match = weight.match(/\d+/);
  return match ? Number(match[0]) : 100;
};

const parseUnit = (weight = '') => {
  const w = weight.toLowerCase();
  if (w.includes('мл')) return 'мл';
  if (w.includes('кг')) return 'кг';
  return 'г';
};

const buildAutoDescription = (product) => {
  if (product.description) return product.description;
  const type = CATEGORY_HINTS[product.category] || 'продукт';
  return `${product.name} — ${type} на каждый день. Подходит для быстрого перекуса, завтрака или дополнения к основному блюду. Удобный формат ${product.weight} и стабильное качество.`;
};

const buildAutoComposition = (product) => {
  const type = CATEGORY_HINTS[product.category] || 'продукт';
  return `Состав: сырье категории "${type}", питьевая вода, натуральные вкусо-ароматические компоненты. Без резких искусственных добавок, подходит для регулярного употребления.`;
};

const buildNutrition = (product) => {
  const weightNum = parseWeightNumber(product.weight);
  const unit = parseUnit(product.weight);
  const base = Math.max(1, Math.round(product.price / 8));

  return {
    kcal: unit === 'мл' ? Math.round(base * 1.2) : Math.round(base * 1.5),
    proteins: (base * 0.25).toFixed(1),
    fats: (base * 0.18).toFixed(1),
    carbs: (base * 0.32).toFixed(1),
    portion: `${weightNum} ${unit}`,
  };
};

const ProductDetailModal = ({ product, onClose }) => {
  const nutrition = buildNutrition(product);
  const description = buildAutoDescription(product);
  const composition = buildAutoComposition(product);
  const similarProducts = productsData
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-detail-btn" onClick={onClose}>×</button>

        <div className="detail-left">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          {similarProducts.length > 0 && (
            <div className="similar-products">
              <h3>Что еще пригодится</h3>
              <div className="similar-list">
                {similarProducts.map((item) => (
                  <div key={item.id} className="similar-item">
                    <img src={item.image} alt={item.name} />
                    <div className="similar-name">{item.name}</div>
                    <div className="similar-price">{item.price} ₽</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>
          <span className="detail-weight">{nutrition.portion}</span>

          <div className="detail-description">
            <h3>Описание</h3>
            <p>{description}</p>
          </div>

          <div className="nutrition-grid">
            <div>
              <span className="nutrition-value">{nutrition.kcal}</span>
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
              <span className="nutrition-value">{nutrition.carbs} г</span>
              <span className="nutrition-label">Углеводы</span>
            </div>
          </div>

          <div className="detail-description">
            <h3>Состав</h3>
            <p>{composition}</p>
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