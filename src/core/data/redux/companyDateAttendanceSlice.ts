// redux/slices/companyDateAttendanceSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_COMPANYS_DATE_ATTENDANCE } from '../../../axiosConfig/apis';



export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  isLate: boolean;
  isEarlyLeave: boolean;
  workingHours: number;
  overtimeHours: number;
  remarks: string | null;
}

export const fetchCompanyDateAttendance = createAsyncThunk<
  AttendanceRecord[],
  { companyId: number; date: string }
>(
  'companyDateAttendance/fetch',
  async ({ companyId, date }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<AttendanceRecord[]>(`${FETCH_COMPANYS_DATE_ATTENDANCE}${companyId}/${date}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface CompanyDateAttendanceState {
  data: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyDateAttendanceState = {
  data: [],
  loading: false,
  error: null,
};

const companyDateAttendanceSlice = createSlice({
  name: 'companyDateAttendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyDateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompanyDateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companyDateAttendanceSlice.reducer;
