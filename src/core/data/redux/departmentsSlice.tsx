// src/redux/slices/departmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_ALL_DEPARTMENTS } from '../../../axiosConfig/apis';


export interface Department {
    id: number;
    name: string;
    description: string;
    companyId:number;
    isActive: boolean;
  }

export const fetchDepartments = createAsyncThunk<Department[]>(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<Department[]>(FETCH_ALL_DEPARTMENTS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

interface DepartmentsState {
  data: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  data: [],
  loading: false,
  error: null
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default departmentsSlice.reducer;
