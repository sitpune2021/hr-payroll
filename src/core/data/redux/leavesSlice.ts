// src/core/data/redux/slices/leaveSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../axiosConfig/axiosClient";
import { COMPANY_LEAVES } from "../../../axiosConfig/apis";

// Interfaces
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Approver {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Leave {
  id: number;
  userId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: string;
  approverId: number | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  approver: Approver | null;
}

export interface LeaveState {
  leaves: Leave[];
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: LeaveState = {
  leaves: [],
  loading: false,
  error: null,
};

// async thunk for fetching leaves
export const fetchLeaves = createAsyncThunk<
  Leave[],
  { companyId: number; fromDate: string; toDate: string },
  { rejectValue: string }
>("leave/fetchLeaves", async ({ companyId, fromDate, toDate }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(COMPANY_LEAVES, {
      params: { companyId, fromDate, toDate },
    });
    if (response.status === 200) {
      return response.data as Leave[];
    }
    return rejectWithValue("Failed to fetch leave records");
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching leave records";
      });
  },
});

export default leaveSlice.reducer;
