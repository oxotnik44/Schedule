import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import axios from "axios";

import {
  AuthButton,
  AuthButtonText,
  Container,
  NoConnected,
} from "./AuthorizationStyle";
import { authorization } from "../../api/apiAuthorization";
import { useSelector } from "react-redux";
import Account from "../PersonalAccountStudent/Account";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
interface AuthUserTokenState {
  AuthTokenSlice: {
    token: string | null;
  };
}
const Authorization = () => {
  const [isWebsiteOpened, setIsWebsiteOpened] = useState(false);
  const authTokenUser = useSelector(
    (stata: AuthUserTokenState) => stata.AuthTokenSlice.token
  );
  const handleMessage = (event: WebViewMessageEvent) => {
    const { data } = event.nativeEvent;
    if (data.startsWith("authToken:")) {
      const authToken = data.replace("authToken:", "").trim();
      console.log("Received Auth Token:", authToken);
      // Дополнительные действия с authToken, например, сохранение в состоянии приложения

      // Закрываем WebView после успешной авторизации
      setIsWebsiteOpened(false);
      console.log("WebView closed after successful authorization");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!isWebsiteOpened ? (
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
          <AuthButton onPress={authorization}>
            <AuthButtonText>Авторизация</AuthButtonText>
          </AuthButton>
        </View>
      ) : (
        <WebView
          source={{
            uri: "https://sso.nspu.ru/module.php/core/loginuserpass.php?AuthState=_3856661352b79d0c687d5faeeeb40af4760ad7ae36%3Ahttps%3A%2F%2Fsso.nspu.ru%2Fsaml2%2Fidp%2FSSOService.php%3Fspentityid%3Dhttps%253A%252F%252Flk.nspu.ru%252Fsaml2%252Fpassport%252Fmetadata%26cookieTime%3D1708526768%26RelayState%3D%252Fhome",
          }}
          onMessage={handleMessage}
          originWhitelist={["*"]}
          style={{
            width: screenWidth,
            height: screenHeight,
          }}
        />
      )}
    </View>
  );
};

export default Authorization;
