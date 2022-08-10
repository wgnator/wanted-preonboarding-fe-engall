import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_TIME_ZONE } from "../consts/config";
import { timeZoneNames } from "../consts/timeZoneNames";

const timeZoneSlice = createSlice({
  name: "timeZone",
  initialState: INITIAL_TIME_ZONE,
  reducers: {
    timeZoneSwitched: (state, action) => {
      return (state = timeZoneNames.find((timeZoneName: string) => timeZoneName.includes(action.payload)) || this.initialState);
    },
  },
});

export const { timeZoneSwitched } = timeZoneSlice.actions;
export default timeZoneSlice.reducer;
