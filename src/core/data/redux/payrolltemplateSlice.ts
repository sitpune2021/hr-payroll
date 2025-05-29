// features/template/templateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_ALL_PAYROLL_TEMPLATE_LIST } from '../../../axiosConfig/apis';

export interface Template {
  id: number;
  templateName: string;
  companyId: number;
}


export const fetchPayrollTemplates = createAsyncThunk<
  Template[],
  { companyId: number | null | undefined }
>('template/fetchTemplates', async ({ companyId }) => {
  const response = await axiosClient.get<Template[]>(FETCH_ALL_PAYROLL_TEMPLATE_LIST, {
    params: { companyId },
  });
  return response.data;
});


interface TemplateState {
  templates: Template[];
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  loading: false,
  error: null
};

const payrollTemplateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollTemplates.fulfilled, (state, action: PayloadAction<Template[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchPayrollTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default payrollTemplateSlice.reducer;
