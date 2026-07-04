import { configureStore } from '@reduxjs/toolkit';
import { userApi, employeeApi } from './services/userApi';
import { attendanceApi } from './services/attendanceApi';
import { leaveApi } from './services/leaveApi';
import { notificationApi } from './services/notificationApi';
import { payslipApi } from './services/payslipApi';
import { recruitmentApi } from './services/recruitmentApi';
import { assetsApi } from './services/assetsApi';
import { offboardingApi } from './services/offboardingApi';
import { reportsApi } from './services/reportsApi';
import { onboardingApi } from './services/onboardingApi';
import { performanceApi } from './services/performanceApi';
import { departmentsApi } from './services/departmentsApi';
import { shiftsApi } from './services/shiftsApi';
import { overtimeApi } from './services/overtimeApi';
import { companyApi } from './services/companyApi';
import { dashboardApi } from './services/dashboardApi';
import userReducer from './slices/userSlice';
import attendanceReducer from './slices/attendanceSlice';
import leaveReducer from './slices/leaveSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    notification: notificationReducer,
    [userApi.reducerPath]: userApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [payslipApi.reducerPath]: payslipApi.reducer,
    [recruitmentApi.reducerPath]: recruitmentApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
    [offboardingApi.reducerPath]: offboardingApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
    [performanceApi.reducerPath]: performanceApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [shiftsApi.reducerPath]: shiftsApi.reducer,
    [overtimeApi.reducerPath]: overtimeApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      employeeApi.middleware,
      attendanceApi.middleware,
      leaveApi.middleware,
      notificationApi.middleware,
      payslipApi.middleware,
      recruitmentApi.middleware,
      assetsApi.middleware,
      offboardingApi.middleware,
      reportsApi.middleware,
      onboardingApi.middleware,
      performanceApi.middleware,
      departmentsApi.middleware,
      shiftsApi.middleware,
      overtimeApi.middleware,
      companyApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
