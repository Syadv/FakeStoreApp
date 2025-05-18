import { saveCartToServer } from '../../services/cartService';
import { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } from './cartSlice';

const cartActions = [addToCart.type, increaseQuantity.type, decreaseQuantity.type, removeFromCart.type];

const cartMiddleware = store => next => action => {
  const result = next(action);
  if (cartActions.includes(action.type)) {
    const state = store.getState();
    const token = state.auth.token;
    const items = state.cart.items;
    saveCartToServer(token, items);
  }
  return result;
};

export default cartMiddleware;