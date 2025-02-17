import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, ToastAndroid } from "react-native";
import { AuthButton, AuthButtonText } from "./AuthorizationStyle";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import axios from "axios";
import { setAuthTokenStorage } from "../../Storage/AuthTokenStorage";
import {
  deleteProfileStudentInfoStorage,
  setProfileStudentInfoStorage,
} from "../../Storage/ProfileInfoStorage";
import { getCreditBookStudent } from "../../api/apiUserStudent";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
interface ProfileState {
  fullName: string;
  numberGroup: string;
  email: string;
  gradeBook: string;
}
interface IState {
  personalDataStudent: ProfileState;
}
interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
const Authorization = () => {
  const dispatch = useDispatch();
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const _handlePressButtonAsync = async () => {
    if (!isConnected) {
      ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
    } else {
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
          const result = await WebBrowser.openAuthSessionAsync(
            baseUrl,
            callbackUrl
          );
          if (result?.type === "success" && result.url) {
            const queryParams = queryString.parse(result.url.split("?")[1]);
            const accessToken = Array.isArray(queryParams.accessToken)
              ? queryParams.accessToken[0]
              : queryParams.accessToken;
            const userData = Array.isArray(queryParams.userData)
              ? queryParams.userData[0]
              : queryParams.userData;

            if (userData && typeof userData === "string") {
              const {
                lastname,
                firstname,
                middlename,
                edu_groups,
                mail,
                gradebooks,
                login,
              } = JSON.parse(userData);
              const fullName = `${lastname} ${firstname} ${middlename}`;
              setAuthTokenStorage(accessToken, dispatch);
              const dataStudent = await getCreditBookStudent(
                accessToken,
                dispatch,
                login
              );
              deleteProfileStudentInfoStorage(dispatch);
              setProfileStudentInfoStorage(
                {
                  login,
                  fullName,
                  numberGroup: edu_groups,
                  email: mail,
                  creditBook: gradebooks,
                  faculty: dataStudent.faculty,
                  formEducation: dataStudent.formEducation,
                  studyDirection: dataStudent.studyDirection,
                  profileLearning: dataStudent.profileLearning,
                  yearEntry: dataStudent.yearEntry,
                },
                dispatch
              );
            } else {
              console.error("queryParams.userData is null or not a string");
            }
          }
        } else {
          console.error("Failed to send callbackUrl to server");
        }
      } catch (error) {
        console.error("Error sending callbackUrl to server:", error);
      }
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
