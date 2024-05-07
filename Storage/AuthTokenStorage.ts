import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTokenUser } from "../redux/slices/AuthTokenSlice";

export const setAuthTokenStorage = async (
  accessToken: any,
  dispatch: Function
) => {
  try {
    await AsyncStorage.setItem("authTokenStorage", JSON.stringify(accessToken));
    dispatch(setTokenUser(accessToken));
  } catch (error) {}
};
