import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  login: string;
  fullName: string;
  numberGroup: string;
  email: string;
  creditBook: string | undefined;
}
interface IState {
  personalDataStudent: ProfileState;
}
const initialProfileState: IState = {
  personalDataStudent: {
    login: "",
    fullName: "",
    numberGroup: "",
    email: "",
    creditBook: "",
  },
};

const ProfileInfoSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    setProfileInfo: (state, action) => {
      state.personalDataStudent = action.payload;
    },
  },
});

export const { setProfileInfo } = ProfileInfoSlice.actions;

export default ProfileInfoSlice.reducer;
