import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../../../types/cart';
import type { Product } from '../../../types/product';
import type { CustomizationConfig, CustomizationPricing } from '../../../types/configurator';

interface AddToCartParams {
  product: Product;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity?: number;
  customization?: {
    config: CustomizationConfig;
    pricing: CustomizationPricing;
    previewUrl?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotalDZD: number;
  addItem: (params: AddToCartParams) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'velenora_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = ({ product, size, quantity = 1, customization }: AddToCartParams) => {
    setItems((prevItems) => {
      // Calculate validated unit price
      const unitPriceDZD = customization
        ? customization.pricing.totalPriceDZD
        : product.basePriceDZD;

      // For customized items, each unique configuration is a distinct cart line
      if (customization) {
        const uniqueId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const newItem: CartItem = {
          id: uniqueId,
          productId: product.id,
          product,
          size,
          quantity,
          unitPriceDZD,
          subtotalDZD: unitPriceDZD * quantity,
          customization,
        };
        return [...prevItems, newItem];
      }

      // For standard non-customized products, increment quantity if same product & size
      const existingIndex = prevItems.findIndex(
        (item) => !item.customization && item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotalDZD: existing.unitPriceDZD * newQty,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `std-${product.id}-${size}-${Date.now()}`,
        productId: product.id,
        product,
        size,
        quantity,
        unitPriceDZD,
        subtotalDZD: unitPriceDZD * quantity,
      };
      return [...prevItems, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            subtotalDZD: item.unitPriceDZD * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalDZD = items.reduce((sum, item) => sum + item.subtotalDZD, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalDZD,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
