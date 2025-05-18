import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user  = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user  = null;
    },
    updateProfile: (state, action) => {
      // action.payload = { name: string, password?: string }
      if (state.user) {
        state.user = {
          ...state.user,
          name: action.payload.name,
        };
        // we don't store password in Redux, so ignore it here
      }
    },
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
