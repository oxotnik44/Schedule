import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTokenUser, setTokenUser } from "../redux/slices/AccountSlices/AuthTokenSlice";

export const setAuthTokenStorage = async (accessToken: any, dispatch: Function) => {
  try {
    await AsyncStorage.setItem("authTokenStorage", JSON.stringify(accessToken));
    dispatch(setTokenUser(accessToken));
  } catch (error) {
    console.error("Ошибка при сохранении токена:", error);
  }
};

export const deleteAccessToken = async (dispatch: Function) => {
  try {
    await AsyncStorage.removeItem("authTokenStorage");
    dispatch(deleteTokenUser(null));
    console.log("Токен успешно удалён");
  } catch (error) {
    console.error("Ошибка при удалении токена:", error);
  }
};
