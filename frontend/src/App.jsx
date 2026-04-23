// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/Router'; // Импортируй свой файл с маршрутами
import './App.css';

const App = () => {
  return (
      <div className="app">
        <AppRouter />
      </div>
  );
};

export default App;