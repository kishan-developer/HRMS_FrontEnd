import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeaveState {
  myLeaveRequests: any[];
  myPendingLeaves: any[];
  leaveBalance: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  myLeaveRequests: [],
  myPendingLeaves: [],
  leaveBalance: null,
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setMyLeaveRequests: (state, action: PayloadAction<any[]>) => {
      state.myLeaveRequests = action.payload;
    },
    setMyPendingLeaves: (state, action: PayloadAction<any[]>) => {
      state.myPendingLeaves = action.payload;
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
  setMyLeaveRequests,
  setMyPendingLeaves,
  setLeaveBalance,
  setLoading,
  setError,
} = leaveSlice.actions;
export default leaveSlice.reducer;
