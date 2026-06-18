import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttendanceState {
  todayAttendance: any | null;
  attendanceRecords: any[];
  attendanceStats: any | null;
  leaveBalance: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  todayAttendance: null,
  attendanceRecords: [],
  attendanceStats: null,
  leaveBalance: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setTodayAttendance: (state, action: PayloadAction<any>) => {
      state.todayAttendance = action.payload;
    },
    setAttendanceRecords: (state, action: PayloadAction<any[]>) => {
      state.attendanceRecords = action.payload;
    },
    setAttendanceStats: (state, action: PayloadAction<any>) => {
      state.attendanceStats = action.payload;
    },
    setLeaveBalance: (state, action: PayloadAction<any>) => {
      state.leaveBalance = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTodayAttendance,
  setAttendanceRecords,
  setAttendanceStats,
  setLeaveBalance,
  setLoading,
  setError,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
