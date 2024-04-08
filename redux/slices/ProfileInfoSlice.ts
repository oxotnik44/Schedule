import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  fullName: string;
  loading: boolean;
}

const initialProfileState: ProfileState = {
  fullName: "",
  loading: false,
};

const ProfileInfoSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    setProfileInfo: (state, action) => {
      state.fullName = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfileInfo, setLoading } = ProfileInfoSlice.actions;

export default ProfileInfoSlice.reducer;
