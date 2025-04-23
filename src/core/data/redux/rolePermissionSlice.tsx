import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../../axiosConfig/axiosClient';
import { FETCH_ROLES_PERMISSIONS } from '../../../axiosConfig/apis';

// Types
export interface RolePermission {
  roleId: number;
  permissionId: number;
}

interface State {
  list: RolePermission[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: State = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Thunk to fetch role-permission list
export const fetchRolePermissions = createAsyncThunk<RolePermission[]>(
  'rolePermission/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(FETCH_ROLES_PERMISSIONS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice
const rolePermissionSlice = createSlice({
  name: 'rolePermission',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<RolePermission[]>) => {
      state.list = action.payload;
    },
    markChecked: (state, action: PayloadAction<RolePermission>) => {
      const exists = state.list.some(
        (rp) =>
          rp.roleId === action.payload.roleId &&
          rp.permissionId === action.payload.permissionId
      );
      if (!exists) {
        state.list.push(action.payload);
      }
    },
    markUnchecked: (state, action: PayloadAction<RolePermission>) => {
      state.list = state.list.filter(
        (rp) =>
          !(
            rp.roleId === action.payload.roleId &&
            rp.permissionId === action.payload.permissionId
          )
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setPermissions, markChecked, markUnchecked } = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
