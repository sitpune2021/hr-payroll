// authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  role: string;
  companyId: number | null;
  branchId: number | null;
  departmentId: number | null;

}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
