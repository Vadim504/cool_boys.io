import { useState, useEffect, useCallback } from 'react';

export const useAddress = () => {
  const [addresses, setAddresses] = useState(() => 
    JSON.parse(localStorage.getItem("deliveryAddresses") || "[]")
  );
  const [currentAddress, setCurrentAddress] = useState(
    localStorage.getItem("lastSelectedAddress") || "Выберите адрес"
  );

  const selectAddress = useCallback((addr) => {
    setCurrentAddress(addr);
    localStorage.setItem("lastSelectedAddress", addr);
    if (!addresses.includes(addr)) {
      setAddresses(prev => [...prev, addr]);
    }
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem("deliveryAddresses", JSON.stringify(addresses));
  }, [addresses]);

  return { currentAddress, selectAddress, addresses };
};