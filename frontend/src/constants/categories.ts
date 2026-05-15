// src/constants/categories.js
import type { Category } from "../types";
import iconReadyMeal from "../images/svg_files/icon_ready_meal.svg";
import iconBeverages from "../images/svg_files/icon_beverages.svg";
import iconBread from "../images/svg_files/icon_bread.svg";
import iconDairy from "../images/svg_files/icon_dairy.svg";
import iconFish from "../images/svg_files/icon_fish.svg";
import iconFrozen from "../images/svg_files/icon_frozen.svg";
import iconMeat from "../images/svg_files/icon_meat.svg";
import iconSnacks from "../images/svg_files/icon_snacks.svg";
import iconSweets from "../images/svg_files/icon_sweets.svg";
import iconFruit from "../images/svg_files/icon_veg_fruit.svg";

export const CATEGORIES: Category[] = [
  { id: 'ready-meal', name: "Готовая еда", icon: iconReadyMeal },
  { id: 'beverages', name: "Напитки", icon: iconBeverages },
  { id: 'bread-bakery', name: "Хлеб", icon: iconBread },
  { id: 'dairy', name: "Молоко", icon: iconDairy },
  { id: 'fish-seafood', name: "Рыба", icon: iconFish },
  { id: 'frozen', name: "Полуфабрикаты", icon: iconFrozen },
  { id: 'meat-poultry', name: "Мясо", icon: iconMeat },
  { id: 'snacks', name: "Снеки", icon: iconSnacks },
  { id: 'sweets', name: "Сладости", icon: iconSweets },
  { id: 'vegetables-fruits', name: "Фрукты", icon: iconFruit }
];
