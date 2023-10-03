import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reducer } from "redux";

const SET_THEME = "SET_THEME";

interface ITheme {
  theme: any;
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
};

const settingsReducer: Reducer<ITheme> = (
  state = initialSettingsState,
  action
) => {
  switch (action.type) {
    case SET_THEME:
      const theme = action.theme === "lightTheme" ? lightTheme : darkTheme;
      AsyncStorage.setItem("selectedTheme", action.theme);
      return { theme };
    default:
      return state;
  }
};

export const setTheme = (theme: string) => ({
  type: SET_THEME,
  theme,
});

export default settingsReducer;
