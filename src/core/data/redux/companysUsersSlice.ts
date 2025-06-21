// src/redux/slices/companysUsersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_COMPANYS_EMPLOYEES } from '../../../axiosConfig/apis';

export interface CompanyUser {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  designation: string;
  roleId: number;
  companyId: number;
  branchId: number | null;
  departmentId: number;
  workingShift: number | null;
  profilePhoto: string | null;
}

interface CompanyUsersState {
  list: CompanyUser[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyUsersState = {
  list: [],
  loading: false,
  error: null,
};



export const fetchCompanysUsersThunk = createAsyncThunk<CompanyUser[], number>(
  'companysUsers/fetchCompanyUsers',
  async (companyId: number) => {
    const response = await axiosClient.get<CompanyUser[]>(`${FETCH_COMPANYS_EMPLOYEES}${companyId}`);
    return response.data;
  }
);

export const companysUsersSlice = createSlice({
  name: 'companysUsers',
  initialState,
  reducers: {
    clearCompanyUsers: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanysUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanysUsersThunk.fulfilled, (state, action: PayloadAction<CompanyUser[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCompanysUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load users';
      });
  },
});

export const { clearCompanyUsers } = companysUsersSlice.actions;
export default companysUsersSlice.reducer;
