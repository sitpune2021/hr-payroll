// src/redux/branchesSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_BRANCHES_LIST } from '../../../axiosConfig/apis';

export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
  }

interface BranchesState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchesState = {
  branches: [],
  loading: false,
  error: null,
};

// ✅ Thunk to fetch branch data
export const fetchBranches = createAsyncThunk<Branch[]>(
  'branches/fetchBranches',
  async () => {
    console.log("@@@@@@","thunk of fetch Branches");
    
    const response = await axiosClient.get<Branch[]>(FETCH_BRANCHES_LIST);
    console.log(response.data);
    
    return response.data;
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.branches.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<Branch[]>) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { setBranches, addBranch } = branchesSlice.actions;

export default branchesSlice.reducer;
