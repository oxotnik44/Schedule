import axios from "axios";
import { setAuthTokenStorage } from "../Storage/AuthTokenStorage";
import { api } from "./baseUrl";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Navigate";

export const Authentication = async (
  token: any,
  navigation: any,
  dispatch: Function
) => {
  try {
    const response = await axios.post(
      "https://schedulemobilebackend.nspu.ru:3000/auth",
      token
    );
    const data = response.data;
    setAuthTokenStorage(data,dispatch);
    navigation.navigate("Account");
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
