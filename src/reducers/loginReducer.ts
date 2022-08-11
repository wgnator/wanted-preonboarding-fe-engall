import { createSlice } from "@reduxjs/toolkit";

type LoginState = {
  userName: string | null;
};
const loginSlice = createSlice({
  name: "login",
  initialState: { userName: localStorage.getItem("userID") } as LoginState,
  reducers: {
    loggedIn: (state, action) => {
      localStorage.setItem("userID", action.payload);
      state.userName = localStorage.getItem("userID");
    },
    loggedOut: (state) => {
      localStorage.removeItem("userID");
      state.userName = localStorage.getItem("userID");
    },
  },
});

export const { loggedIn, loggedOut } = loginSlice.actions;
export default loginSlice.reducer;
