import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  login: string;
  fullName: string;
  numberGroup: string;
  email: string;
  creditBook: string | undefined;
  faculty: string;
  formEducation: string;
  studyDirection: string;
  profileLearning: string;
  yearEntry: string;
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
    faculty: "",
    formEducation: "",
    studyDirection: "",
    profileLearning: "",
    yearEntry: "",
  },
};

const ProfileInfoSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    setProfileInfo: (state, action: PayloadAction<Partial<ProfileState>>) => {
      state.personalDataStudent = {
        ...state.personalDataStudent,
        ...action.payload,
      };
    },
    clearProfileInfo: (state) => {
      state.personalDataStudent = initialProfileState.personalDataStudent;
    },
  },
});

export const { setProfileInfo, clearProfileInfo } = ProfileInfoSlice.actions;

export default ProfileInfoSlice.reducer;
