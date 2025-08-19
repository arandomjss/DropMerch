import React, { createContext, useContext, useReducer, ReactNode } from "react";

type CartItem = { id: string; name: string; price: number; quantity: number; image_url?: string; };

type State = { items: CartItem[] };
type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const found = state.items.find(i => i.id === action.payload.id);
      if (found) {
        return { items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i) };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.payload) };
    case "CLEAR":
      return { items: [] };
    default: return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  // Provide cart, removeFromCart, and clearCart for easier usage
  return {
    cart: ctx.state.items,
    addToCart: (item: CartItem) => ctx.dispatch({ type: "ADD", payload: item }),
    removeFromCart: (id: string) => ctx.dispatch({ type: "REMOVE", payload: id }),
    clearCart: () => ctx.dispatch({ type: "CLEAR" }),
    state: ctx.state,
    dispatch: ctx.dispatch,
  };
}
