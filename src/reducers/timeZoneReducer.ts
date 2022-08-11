import { createSlice } from "@reduxjs/toolkit";
import { timeZoneNames } from "../consts/timeZoneNames";

const timeZoneSlice = createSlice({
  name: "timeZone",
  initialState: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reducers: {
    timeZoneSwitched: (state, action) => {
      return (state = timeZoneNames.find((timeZoneName: string) => timeZoneName.includes(action.payload)));
    },
  },
});

export const { timeZoneSwitched } = timeZoneSlice.actions;
export default timeZoneSlice.reducer;
