import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restoreCart } from '../cart/cartSlice';

const API_URL = 'http://192.168.4.41:3000';

// Fetch orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res  = await fetch(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch orders');
      const raw = Array.isArray(json) ? json : json.orders || [];
      return raw.map(o => ({
        id:          o.id,
        isPaid:      o.is_paid === 1,
        isDelivered: o.is_delivered === 1,
        total:       o.total_price / 100,
        items:       JSON.parse(o.order_items).map(i => ({
                         prodID:   i.prodID,
                         price:    i.price,
                         quantity: i.quantity
                      }))
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Place a new order, then clear cart & refresh orders
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (cartItems, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    const payload = {
      items: cartItems.map(i => ({
        prodID:   i.id,
        price:    i.price,
        quantity: i.quantity
      }))
    };
    try {
      const res  = await fetch(`${API_URL}/orders/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Order failed');

      // Clear cart contents
      dispatch(restoreCart([]));

      // Refresh orders list
      dispatch(fetchOrders());

      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Mark an order paid
export const payOrder = createAsyncThunk(
  'orders/payOrder',
  async (orderId, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res  = await fetch(`${API_URL}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`
        },
        body: JSON.stringify({
          orderID:     orderId,
          isPaid:      1,
          isDelivered: 0
        })
      });
      const json = await res.json();
      if (!res.ok || json.status === 'error') {
        throw new Error(json.message || 'Payment failed');
      }
      dispatch(fetchOrders());
      return orderId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Mark an order delivered
export const deliverOrder = createAsyncThunk(
  'orders/deliverOrder',
  async (orderId, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res  = await fetch(`${API_URL}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`
        },
        body: JSON.stringify({
          orderID:     orderId,
          isPaid:      1,
          isDelivered: 1
        })
      });
      const json = await res.json();
      if (!res.ok || json.status === 'error') {
        throw new Error(json.message || 'Delivery update failed');
      }
      dispatch(fetchOrders());
      return orderId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending,    state => { state.loading = true;  state.error = null; })
      .addCase(fetchOrders.fulfilled,  (state, action) => {
        state.loading = false;
        state.orders  = action.payload;
      })
      .addCase(fetchOrders.rejected,   (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // placeOrder
      .addCase(placeOrder.pending,     state => { state.loading = true;  state.error = null; })
      .addCase(placeOrder.fulfilled,   state => { state.loading = false; })
      .addCase(placeOrder.rejected,    (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // payOrder
      .addCase(payOrder.pending,       state => { state.loading = true;  state.error = null; })
      .addCase(payOrder.fulfilled,     state => { state.loading = false; })
      .addCase(payOrder.rejected,      (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // deliverOrder
      .addCase(deliverOrder.pending,   state => { state.loading = true;  state.error = null; })
      .addCase(deliverOrder.fulfilled, state => { state.loading = false; })
      .addCase(deliverOrder.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  }
});

export default ordersSlice.reducer;
