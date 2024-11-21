import { OrderItem } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  items: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null);

/**
 * Provides the cart context to its children components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 *
 * @returns {JSX.Element} The CartContext provider with the given children.
 *
 * @remarks
 * This component initializes the cart state from localStorage if available and saves the cart state to localStorage whenever it changes.
 *
 * @example
 * ```tsx
 * <CartProvider>
 *   <YourComponent />
 * </CartProvider>
 * ```
 *
 * @context
 * The context provides the following values:
 * - `items`: The list of items in the cart.
 * - `addToCart`: Function to add an item to the cart.
 * - `removeFromCart`: Function to remove an item from the cart by its ID.
 * - `clearCart`: Function to clear all items from the cart.
 * - `updateQuantity`: Function to update the quantity of an item in the cart by its ID.
 * - `totalAmount`: The total amount of all items in the cart.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<OrderItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Calculate total amount
  const totalAmount = items.reduce(
    (sum, item) => sum + item.pizza.totalPrice,
    0
  );

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  const addToCart = (item: OrderItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const unitPrice = item.pizza.totalPrice / item.pizza.quantity;
          return {
            ...item,
            pizza: {
              ...item.pizza,
              quantity,
              totalPrice: unitPrice * quantity,
            },
          };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
