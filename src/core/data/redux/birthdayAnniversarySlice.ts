// features/events/eventsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

  interface EmployeeEvent {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    joiningDate: string | null;
    designation: string;
    companyId: number;
    branchId: number | null;
  }

  interface BirthdayAnniversaryState {
    birthdays: EmployeeEvent[];
    anniversaries: EmployeeEvent[];
  }


const initialState: BirthdayAnniversaryState = {
  birthdays: [],
  anniversaries: []
};

const eventsSlice = createSlice({
  name: "birthDayAnniversary",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<BirthdayAnniversaryState>) => {
      state.birthdays = action.payload.birthdays || [];
      state.anniversaries = action.payload.anniversaries || [];
    },
    clearEvents: (state) => {
      state.birthdays = [];
      state.anniversaries = [];
    }
  }
});

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
