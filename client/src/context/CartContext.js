// src/context/CartContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";

// 🛒 Initial State
const initialState = {
  items: [], // each item: { id, name, price, img, qty }
};

// 🧠 Reducer Function
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = action.payload;
      const exists = state.items.find((i) => i.id === item.id);

      if (exists) {
        // if already exists, just increase quantity
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          ),
        };
      }

      return { ...state, items: [...state.items, item] };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ⚙️ Context
const CartContext = createContext();

// 💾 Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem("cart_v1");
      return saved ? JSON.parse(saved) : init;
    } catch (err) {
      console.error("Error reading localStorage:", err);
      return init;
    }
  });

  // 💾 Save cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(state));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [state]);

  // 🧩 Provide state + dispatch
  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 🪄 Custom Hook for easy use
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
