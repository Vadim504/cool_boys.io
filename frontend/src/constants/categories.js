// src/data/categories.js

// 1. Импортируем все иконки сюда
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

// 2. Создаем и экспортируем массив
export const CATEGORIES = [
  { name: "Готовая еда", icon: iconReadyMeal },
  { name: "Напитки", icon: iconBeverages },
  { name: "Хлеб", icon: iconBread },
  { name: "Молоко", icon: iconDairy },
  { name: "Рыба", icon: iconFish },
  { name: "Полуфабрикаты", icon: iconFrozen },
  { name: "Мясо", icon: iconMeat },
  { name: "Снеки", icon: iconSnacks },
  { name: "Сладости", icon: iconSweets },
  { name: "Фрукты", icon: iconFruit }
];