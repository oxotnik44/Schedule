import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTokenUser } from "../redux/slices/AuthTokenSlice";

export const setAuthTokenStorage = async (
  AuthToken: any,
  dispatch: Function
) => {
  try {
    await AsyncStorage.setItem("authTokenStorage", JSON.stringify(AuthToken));
    dispatch(setTokenUser(AuthToken));
  } catch (error) {}
};
