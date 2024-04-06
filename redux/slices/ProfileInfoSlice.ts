import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileInfo {
  fullName: string;
  birthDate: string;
  login: string;
}

interface ProfileState {
  profileInfo: ProfileInfo | null;
  loading: boolean;
}

const initialProfileState: ProfileState = {
  profileInfo: null,
  loading: false,
};

const ProfileInfoSlice = createSlice({
  name: "Profile",
  initialState: initialProfileState,
  reducers: {
    setProfileInfo: (state, action: PayloadAction<ProfileInfo>) => {
      state.profileInfo = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setProfileInfo,
  setLoading,
} = ProfileInfoSlice.actions;

export default ProfileInfoSlice.reducer;
