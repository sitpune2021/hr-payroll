import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

interface DateRangeState {
  start: moment.Moment;
  end: moment.Moment;
}

const initialState: DateRangeState = {
  start: moment().subtract(6, 'days'),
  end: moment(),
};

const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ start: moment.Moment, end: moment.Moment }>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
    },
  },
});

export const { setDateRange } = dateRangeSlice.actions;
export default dateRangeSlice.reducer;
