import { useState, useEffect } from 'react';

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  // Загрузка при первом рендере
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('deliveryAddresses')) || [];
    const last = localStorage.getItem('lastSelectedAddress');
    setAddresses(saved);
    if (last) setSelectedAddress(last);
  }, []);

  // Сохранение при изменении массива
  useEffect(() => {
    localStorage.setItem('deliveryAddresses', JSON.stringify(addresses));
  }, [addresses]);

  // Сохранение выбранного адреса
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('lastSelectedAddress', selectedAddress);
    }
  }, [selectedAddress]);

  const addAddress = (address) => {
    setAddresses(prev => [...prev, address]);
    setSelectedAddress(address);
  };

  return {
    addresses,
    selectedAddress,
    addAddress,
    setSelectedAddress
  };
}