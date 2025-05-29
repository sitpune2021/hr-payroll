// redux/slices/companySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FETCH_COMPANY_LIST } from '../../../axiosConfig/apis';
import axiosClient from '../../../axiosConfig/axiosClient';

// types/company.ts
export interface Company {
  id: number;
  name: string;
  website: string;
  companyImage: string;
  isActive: boolean;
  address: string;
  phone: string;
  email: string;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  allowedNoOfUsers: number;
}


export const fetchCompanies = createAsyncThunk<Company[]>('companies/fetch', async () => {
  const res = await axiosClient.get(FETCH_COMPANY_LIST);
  return res.data;
});

interface CompanyState {
  list: Company[];
  loading: boolean;
}

const initialState: CompanyState = {
  list: [],
  loading: false,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    resetCompanyList(state) {
      state.list = [];
    },
    addCompanyToList(state, action) {
      state.list.push(action.payload);
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default companySlice.reducer;
