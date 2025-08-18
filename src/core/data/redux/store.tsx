import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import themeSettingSlice from './themeSettingSlice';
import sidebarSlice from './sidebarSlice';
import featureReducer from './featureSlice';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import rolesReducer from './rolesSlice';
import companyReducer from './companySlice';
import branchesReducer from './branchesSlice';
import usersReducer from './usersSlice';
import departmentsReducer from './departmentsSlice';
import rolePermissionReducer from './rolePermissionSlice';
import dateRangeReducer from './dateRangeSlice';
import shiftReducer from './shiftSlice';
import payrollTemplateReducer from './payrolltemplateSlice';
import companysEmployeeReducer from './companysUsersSlice';
import companyDateAttendanceReducer from './companyDateAttendanceSlice'
import holidayGroupReducer from './holidayGroupSlice'
import leaveTemplateReducer from './leaveTemplateSlice'
import birthDayAnniversaryReducer from './birthdayAnniversarySlice'
import companyLeavesReducer from './leavesSlice'



// 👇 Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  themeSetting: themeSettingSlice,
  sidebarSlice: sidebarSlice,
  feature: featureReducer,
  toast: toastReducer,
  roles: rolesReducer,
  companies: companyReducer,
  branches: branchesReducer,
  users: usersReducer,
  departments:departmentsReducer,
  rolePermission: rolePermissionReducer,
  dateRange: dateRangeReducer,
  shifts: shiftReducer,
  payrollTemplate: payrollTemplateReducer,
  companysEmployees: companysEmployeeReducer,
  companyDateAttendance: companyDateAttendanceReducer,
  holidayGroup: holidayGroupReducer,
  leaveTemplate: leaveTemplateReducer,
  birthDayAnniversary: birthDayAnniversaryReducer,
  companyLeaves: companyLeavesReducer
});

// 👇 Persist config: Choose what to persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // persist only `auth`, you can add more if needed
};

// 👇 Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 👇 Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store); // 👈 export persistor

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
