import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

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

function getCartKey(userId: string | undefined): string {
  return userId ? `bowl-striker-cart_${userId}` : 'bowl-striker-cart_guest';
}

function loadCart(userId: string | undefined): CartItem[] {
  try {
    const saved = localStorage.getItem(getCartKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(userId: string | undefined, items: CartItem[]) {
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | undefined>(user?.id);
  const [items, setItems] = useState<CartItem[]>(() => loadCart(user?.id));
  const [isCartOpen, setIsCartOpen] = useState(false);

  // When user changes (login/logout/switch), save current cart and load new user's cart
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    const currentUserId = user?.id;

    if (prevUserId !== currentUserId) {
      // Save current cart for previous user before switching
      saveCart(prevUserId, items);
      // Load cart for new user
      const newCart = loadCart(currentUserId);
      setItems(newCart);
      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id]);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    saveCart(user?.id, items);
  }, [items, user?.id]);

  const addToCart = (product: Product, quantity = 1, size = 'M') => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
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
        item.id === productId ? { ...item, quantity } : item
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
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}