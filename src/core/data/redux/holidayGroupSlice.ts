import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_HOLIDAY_GROUP_NEW } from '../../../axiosConfig/apis';

export interface HolidayGroup {
  id: number;
  groupName: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HolidayGroupState {
  data: HolidayGroup[];
  loading: boolean;
  error: string | null;
}


export const fetchHolidayGroups = createAsyncThunk<
  HolidayGroup[],
  { companyId: number | null | undefined }
>(
  'holidayGroup/fetchAll',
  async ({ companyId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<HolidayGroup[]>(FETCH_HOLIDAY_GROUP_NEW, {
        params: { companyId },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);



const initialState: HolidayGroupState = {
  data: [],
  loading: false,
  error: null,
};

const holidayGroupSlice = createSlice({
  name: 'holidayGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchHolidayGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHolidayGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default holidayGroupSlice.reducer;
