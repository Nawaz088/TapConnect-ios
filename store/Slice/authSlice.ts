import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  confirmResult: null,
  phoneNumber: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setConfirmResult: (state, action) => {
      state.confirmResult = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    clearAuthState: (state) => {
      state.confirmResult = null;
      state.phoneNumber = '';
    },
  },
});

export const { setConfirmResult, setPhoneNumber, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
