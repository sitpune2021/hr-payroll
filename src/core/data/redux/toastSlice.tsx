// src/redux/slices/toastSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastVariant = 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  variant: ToastVariant;
}

const initialState: ToastState = {
  show: false,
  title: '',
  message: '',
  variant: 'light',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ title: string; message: string; variant?: ToastVariant }>) => {
        console.log("Reducer called: showToast"); 
      state.show = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.variant = action.payload.variant || 'light';
    },
    hideToast: (state) => {
      state.show = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
