import React, { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sc_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('sc_cart', JSON.stringify(items)); }, [items]);

  const addToCart = (product, qty = 1, size = '', color = '') => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id && i.size === size && i.color === color);
      if (existing) return prev.map(i =>
        i._id === product._id && i.size === size && i.color === color
          ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...product, quantity: qty, size, color,
        cartId: `${product._id}-${size}-${color}-${Date.now()}` }];
    });
  };

  const remove   = (cartId) => setItems(p => p.filter(i => i.cartId !== cartId));
  const setQty   = (cartId, qty) => {
    if (qty <= 0) return remove(cartId);
    setItems(p => p.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i));
  };
  const clear    = () => setItems([]);

  const total = items.reduce((s, i) => s + (i.onSale && i.salePrice ? i.salePrice : i.price) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, addToCart, remove, setQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
};
