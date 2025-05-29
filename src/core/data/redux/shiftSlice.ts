import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_ALL_SHIFTS } from '../../../axiosConfig/apis';

export interface Shift {
  id: number;
  shiftName: string;
  checkInTime: string;
  checkOutTime: string;
  gracePeriodMinutes: number;
  earlyLeaveAllowanceMinutes: number;
  companyId: number;
}

interface ShiftState {
  shifts: Shift[];
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  shifts: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchShifts = createAsyncThunk<Shift[]>(
  'shifts/fetchShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(FETCH_ALL_SHIFTS);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const shiftSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    setShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchShifts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.shifts = action.payload;
        state.loading = false;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShifts } = shiftSlice.actions;
export default shiftSlice.reducer;
