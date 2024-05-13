import AsyncStorage from "@react-native-async-storage/async-storage";
import { setProfileInfo } from "../redux/slices/AccountSlices/ProfileInfoSlice";

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
