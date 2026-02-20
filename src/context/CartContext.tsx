import React, { useEffect, useState, createContext, useContext } from 'react';
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  rating?: number;
  stock?: number;
  specs?: Record<string, string>;
}
export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: {children: React.ReactNode;}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bowl-striker-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);
  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('bowl-striker-cart', JSON.stringify(items));
  }, [items]);
  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
        item.id === product.id && item.selectedSize === size ?
        {
          ...item,
          quantity: item.quantity + quantity
        } :
        item
        );
      }
      return [
      ...prev,
      {
        ...product,
        quantity,
        selectedSize: size
      }];

    });
    setIsCartOpen(true);
  };
  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
    prev.map((item) =>
    item.id === productId ?
    {
      ...item,
      quantity
    } :
    item
    )
    );
  };
  const clearCart = () => setItems([]);
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen
      }}>

      {children}
    </CartContext.Provider>);

}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}