import React, { useEffect, useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { AuthButton, AuthButtonText } from "./AuthorizationStyle";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import axios from "axios";
import { setAuthTokenStorage } from "../../Storage/AuthTokenStorage";
import { setProfileInfo } from "../../redux/slices/ProfileInfoSlice";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
interface ProfileInfo {
  fullName: string;
}
const Authorization = () => {
  const dispatch = useDispatch();
  const _handlePressButtonAsync = async () => {
    const baseUrl = "https://schedulemobilebackend.nspu.ru:3000/login";
    const callbackUrl = Linking.createURL("App", { scheme: "myapp" });

    try {
      const response = await axios.post(
        "https://schedulemobilebackend.nspu.ru:3000/setIpAddressMobileForAuth",
        {
          ipAddressMobileForAuth: callbackUrl,
        }
      );

      // Проверка статуса ответа
      if (response.status === 200) {
        // Открытие браузера
        const result = await WebBrowser.openAuthSessionAsync(
          baseUrl,
          callbackUrl
        );
        if (result?.type === "success" && result.url) {
          const queryParams = queryString.parse(result.url.split("?")[1]);
          const accessToken = queryParams.accessToken;
          console.log(accessToken);
          if (
            queryParams.userData !== null &&
            typeof queryParams.userData === "string"
          ) {
            const userData = JSON.parse(queryParams.userData);
            console.log(userData.login);
            const fullName =
              userData.lastname +
              " " +
              userData.firstname +
              " " +
              userData.middlename;
              const profileInfo: ProfileInfo = {
                fullName: fullName,
              };
              
              dispatch(setProfileInfo(profileInfo));
          } else {
            console.error("queryParams.userData is null or not a string");
          }

          setAuthTokenStorage(accessToken, dispatch);
        }
      } else {
        console.error("Failed to send callbackUrl to server");
      }
    } catch (error) {
      console.error("Error sending callbackUrl to server:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Image
          source={require("../../assets/NGPYImg.png")}
          style={{
            width: screenWidth * 0.6,
            height: screenHeight * 0.6,
            resizeMode: "contain",
            alignSelf: "center",
            marginTop: -screenHeight * 0.15,
          }}
        />
        <AuthButton onPress={_handlePressButtonAsync}>
          <AuthButtonText>Авторизация</AuthButtonText>
        </AuthButton>
      </View>
    </View>
  );
};

export default Authorization;
