import React, { useEffect, useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { AuthButton, AuthButtonText } from "./AuthorizationStyle";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { Authentication } from "../../api/apiAuthentication";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
const Authorization = ({ navigation }: ScheduleProps) => {
  const dispatch = useDispatch();
  const _handlePressButtonAsync = async () => {
    const baseUrl = "https://schedulemobilebackend.nspu.ru:3000/login";
    const callbackUrl = Linking.createURL("App", { scheme: "myapp" });
    const result = await WebBrowser.openAuthSessionAsync(baseUrl, callbackUrl);
    if (result?.type === "success" && result.url) {
      const queryParams = queryString.parse(result.url.split("?")[1]);
      const accessToken = queryParams.accessToken;
      console.log(queryParams.user);

      // if (accessToken) {
      //   Authentication(accessToken, navigation, dispatch);
      // }
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
