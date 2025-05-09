import { createSlice } from '@reduxjs/toolkit';

// initial cart state
const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // add product to cart
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
      state.totalAmount += newItem.price;

      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1, totalPrice: newItem.price });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },
    // increase quantity
    increaseQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
        state.totalQuantity++;
        state.totalAmount += existingItem.price;
      }
    },
    // decrease quantity or remove if 0
    decreaseQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;

        if (existingItem.quantity === 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
    },
    // remove item from cart
    removeFromCart(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.totalPrice;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
