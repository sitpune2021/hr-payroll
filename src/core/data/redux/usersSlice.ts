import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_USERS_LIST } from '../../../axiosConfig/apis';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  birthDate: string | null;
  maritalStatus: string | null;
  companyId: number | null;
  branchId: number | null;
  departmentId: number;
  roleId: number;
  createdAt: string;
  templateId: number | null | undefined;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  sortField: string; // Field to sort by
  sortOrder: string; // 'asc' or 'desc'
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  page: 1,
  sortField: 'id', // Default sort field
  sortOrder: 'asc', // Default sort order
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    {
      companyId,
      branchId,
      roleId,
      page,
      limit,
      sortField,
      sortOrder,
    }: {
      companyId?: number;
      branchId?: number;
      roleId?: number;
      page: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.get(FETCH_USERS_LIST, {
        params: { companyId, branchId, roleId, page, limit, sortField, sortOrder },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSort(state, action) {
      // Update sort parameters when a new sort field or order is selected
      state.sortField = action.payload.sortField;
      state.sortOrder = action.payload.sortOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setSort } = usersSlice.actions;
export default usersSlice.reducer;
