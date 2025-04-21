import { configureStore } from '@reduxjs/toolkit';
import themeSettingSlice from './themeSettingSlice';
import sidebarSlice from './sidebarSlice';
import featureReducer from './featureSlice';
import authReducer from './authSlice'
import toastReducer from './toastSlice'
import rolesReducer from './rolesSlice'
import companyReducer from './companySlice'
import branchesReducer from './branchesSlice'
import usersReducer from './usersSlice'






const store = configureStore({
  reducer: {
    auth: authReducer,
    themeSetting: themeSettingSlice,
    sidebarSlice: sidebarSlice,
    feature: featureReducer,
    toast: toastReducer,
    roles: rolesReducer,
    companies: companyReducer,
    branches: branchesReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
