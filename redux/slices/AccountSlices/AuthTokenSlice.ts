import { createSlice } from "@reduxjs/toolkit";

interface iTokenUser {
  accessToken: any;
}
export const initialAuthToken: iTokenUser = {
  accessToken: "",
};
const AuthTokenSlice = createSlice({
  name: "AuthTokenUser",
  initialState: initialAuthToken,
  reducers: {
    setTokenUser: (state, action) => {
      state.accessToken = action.payload;
    },
    deleteTokenUser: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setTokenUser, deleteTokenUser } = AuthTokenSlice.actions;

export default AuthTokenSlice.reducer;
