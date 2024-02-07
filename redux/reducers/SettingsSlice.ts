import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface ITheme {
  theme: any;
  isConnected: boolean | null;
}

export const lightTheme = {
  backgroundColor: "#FFFFFF",
  textColor: "#004C6F",
  containerColor: "#d9d9d999",
  imageColor: "#004C6F",
  containerSearchColor: "#FFFFFF",
  textSearchColor: "#BABFCF",
  mainColor: "#004C6F",
  navigateColor: "#FFFFFF",
};

export const darkTheme = {
  backgroundColor: "#202123",
  textColor: "#FFFFFF",
  containerColor: "#46464699",
  imageColor: "#FFFFFF",
  containerSearchColor: "#7C808F",
  textSearchColor: "#FBFBFB",
  mainColor: "#FFFFFF",
  navigateColor: "#004C6F",
};

const initialSettingsState: ITheme = {
  theme: lightTheme,
  isConnected: false,
};

export const setThemeAsync = createAsyncThunk('settings/setThemeAsync', async (theme: string) => {
  await AsyncStorage.setItem("selectedTheme", theme);
  return theme;
});

export const SettingsSlice = createSlice({
  name: "Settings",
  initialState: initialSettingsState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean | null>) => {
      state.isConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setThemeAsync.fulfilled, (state, action) => {
        state.theme = action.payload === "lightTheme" ? lightTheme : darkTheme;
      });
  },
});

export const { setConnectionStatus } = SettingsSlice.actions;
export { setThemeAsync as setTheme };
export default SettingsSlice.reducer;
