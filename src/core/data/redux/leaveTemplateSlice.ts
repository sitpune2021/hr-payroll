
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_ALL_LEAVE_TEMPLATE_LIST } from '../../../axiosConfig/apis';

export interface LeaveTemplates {
  id: number;
  name: string;
  paidLeaveQuota: number;
  sickLeaveQuota: number;
  casualLeaveQuota: number;
  allowedLateEntries:number;
  holidayGroupId: number;
  companyId: number;
}


export const fetchLeaveTemplates = createAsyncThunk<
  LeaveTemplates[],
  { companyId: number | null | undefined }
>('leaveTemplate/fetchTemplates', async ({ companyId }) => {
  const response = await axiosClient.get<LeaveTemplates[]>(FETCH_ALL_LEAVE_TEMPLATE_LIST, {
    params: { companyId },
  });
  return response.data;
});


interface LeaveTemplateState {
  templates: LeaveTemplates[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveTemplateState = {
  templates: [],
  loading: false,
  error: null
};

const leaveTemplateSlice = createSlice({
  name: 'leaveTemplate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTemplates.fulfilled, (state, action: PayloadAction<LeaveTemplates[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchLeaveTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default leaveTemplateSlice.reducer;
