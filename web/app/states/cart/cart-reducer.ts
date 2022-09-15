import { useCallback, useReducer } from 'react';
import { ProductLine } from './types';

interface OrderAction {
  type: 'add' | 'remove' | 'update';
  line: ProductLine;
}

export interface CartState {
  productLines: Array<ProductLine>;
}

const reducer = (state: CartState, action: OrderAction): CartState => {
  switch (action.type) {
    case 'add': {
      if (state.productLines.some((line) => line.id === action.line.id)) {
        return {
          ...state,
          productLines: state.productLines.map((line) =>
            line.id === action.line.id
              ? { ...action.line, quantity: action.line.quantity + line.quantity }
              : line
          ),
        };
      }
      return {
        ...state,
        productLines: state.productLines.concat(action.line),
      };
    }
    case 'remove': {
      return {
        ...state,
        productLines: state.productLines.filter((line) => line.id !== action.line.id),
      };
    }
    case 'update': {
      return {
        ...state,
        productLines: state.productLines.map((line) =>
          line.id === action.line.id ? action.line : line
        ),
      };
    }
    default: {
      return state;
    }
  }
};

const INITIAL_CART: CartState = {
  productLines: [],
};

export const useCartReducer = () => {
  const [cart, dispatch] = useReducer(reducer, INITIAL_CART);
  const updateProduct = useCallback((line: ProductLine) => {
    dispatch({ type: 'update', line });
  }, []);
  const removeProduct = useCallback((line: ProductLine) => {
    dispatch({ type: 'remove', line });
  }, []);
  const addProduct = useCallback((line: ProductLine) => {
    dispatch({ type: 'add', line });
  }, []);
  return { cart, updateProduct, removeProduct, addProduct };
};
