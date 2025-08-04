import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_USERS_LIST } from '../../../axiosConfig/apis';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  gender?: string | null;
  designation: string;
  roleId: number;
  companyId?: number | null;
  branchId?: number | null;
  departmentId: number;
  joiningDate?: string | null;
  birthDate?: string | null;
  attendanceMode?: string | null;
  shiftRotationalFixed: 'Rotational' | 'Fixed';
  workingShift?: number | null;
  sendAttTOWhatsapp: boolean;
  geofencepoint?: string | null;
  leaveTemplate?: number | null;
  paymentMode?: string | null;
  paymentDate?: string | null;
  basicSalary?: number | null;
  payrollTemplate?: number | null;
  temporaryAddress?: string | null;
  PermenantAddress?: string | null;
  BloodGroup?: string | null;
  alternatePhone?: string | null;
  PFAccountDetails?: string | null;
  bankDetails?: string | null;
  profilePhoto?: string | null;
  adhaarCard?: string | null;
  panCard?: string | null;
  educationalQualification?: string | null;
  reportingManagerId:number | null;
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  sortField: string;
  sortOrder: string;
  filters: {
    companyId?: number;
    branchId?: number;
    roleId?: number;
    gender?: string;
    designation?: string;
  };
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  page: 1,
  sortField: 'id',
  sortOrder: 'asc',
  filters: {}
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    {
      companyId,
      branchId,
      roleId,
      page,
      limit,
      sortField,
      sortOrder
    }: {
      companyId?: number;
      branchId?: number;
      roleId?: number;
      page: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.get(FETCH_USERS_LIST, {
        params: { companyId, branchId, roleId, page, limit, sortField, sortOrder },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSort(state, action) {
      state.sortField = action.payload.sortField;
      state.sortOrder = action.payload.sortOrder;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setSort, setFilters } = usersSlice.actions;
export default usersSlice.reducer;
