import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearProfileInfo,
  setProfileInfo,
} from "../redux/slices/AccountSlices/ProfileInfoSlice";

export const setProfileStudentInfoStorage = async (
  personalDataStudent: object,
  dispatch: Function
) => {
  try {
    await AsyncStorage.setItem(
      "profileStudentInfoStorage",
      JSON.stringify(personalDataStudent)
    );
    dispatch(setProfileInfo(personalDataStudent));
  } catch (error) {}
};
export const deleteProfileStudentInfoStorage = async (dispatch: Function) => {
  try {
    await AsyncStorage.removeItem("profileStudentInfoStorage");
    dispatch(clearProfileInfo());
    console.log("данные удалены");
  } catch (error) {
    console.error("Ошибка при удалении токена:", error);
  }
};
