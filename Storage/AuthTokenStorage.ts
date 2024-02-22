import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAuthTokenStorage = async (AuthToken: any) => {
  try {
    await AsyncStorage.setItem("authTokenStorage", JSON.stringify(AuthToken));
  } catch (error) {}
};
