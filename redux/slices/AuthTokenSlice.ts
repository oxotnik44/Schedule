import { createSlice } from "@reduxjs/toolkit";

interface iTokenUser {
  token: any;
}
export const initialAuthToken: iTokenUser = {
  token: "",
};
const AuthTokenSlice = createSlice({
  name: "AuthTokenUser",
  initialState: initialAuthToken,
  reducers: {
    setTokenUser: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setTokenUser } = AuthTokenSlice.actions;

export default AuthTokenSlice.reducer;
