import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTokenUser, setTokenUser } from "../redux/slices/AccountSlices/AuthTokenSlice";

export const setAuthTokenStorage = async (
  accessToken: any,
  dispatch: Function
) => {
  try {
    await AsyncStorage.setItem("authTokenStorage", JSON.stringify(accessToken));
    dispatch(setTokenUser(accessToken));
  } catch (error) {}
};
export const deleteAccessToken = async (dispatch:Function,accessToken:string) => {
  try {
    await AsyncStorage.removeItem(accessToken);
    dispatch(deleteTokenUser(null))
    console.log("Токен успешно удалён");
  } catch (error) {
    console.error("Ошибка при удалении токена:", error);
  }
};
