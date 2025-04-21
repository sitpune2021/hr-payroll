// src/store/rolesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FETCH_ROLES_LIST } from '../../../axiosConfig/apis';
import axiosClient from '../../../axiosConfig/axiosClient';

export interface Role {
    id: number;
    name: string;
  }

interface RolesState {
  list: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await axiosClient.get<Role[]>(FETCH_ROLES_LIST); 
  return response.data;
});

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Something went wrong';
      });
  },
});

export default rolesSlice.reducer;
