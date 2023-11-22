import React, { useCallback, useState } from "react";
import {
  FlatList,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../../Navigate";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  AuthButton,
  AuthButtonText,
  AuthInput,
  Container,
  ContainerAuthorization,
  NoConnected,
} from "./AuthorizationStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type AuthorizationProps = {
  navigation: StackNavigationProp<RootStackParamList, "Departments">;
};
interface Settings {
  settingsReducer: {
    isConnected: boolean;
    theme: any;
  };
}
const Authorization: React.FC<AuthorizationProps> = ({ navigation }) => {
  const theme = useSelector((state: Settings) => state.settingsReducer.theme);

  const dispatch = useDispatch();
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const handleAuthorization = () => {
    if (login === "") {
      alert("Введите логин");
    } else if (password === "") {
      alert("Введите пароль");
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <KeyboardAwareScrollView>
          {!isConnected ? (
            <NoConnected>Нет соединения с интернетом</NoConnected>
          ) : (
            <View style={{ flex: 1 }}>
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
              <ContainerAuthorization>
                <AuthInput
                  value={login}
                  placeholder="Введите имя пользователя"
                  style={{ marginBottom: 10 }}
                  onChangeText={(value) => {
                    setLogin(value);
                  }}
                />
                <AuthInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                  }}
                  placeholder="Введите пароль"
                  secureTextEntry={true}
                  style={{ marginBottom: 20 }}
                />
                <AuthButton onPress={handleAuthorization}>
                  <AuthButtonText>Авторизация</AuthButtonText>
                </AuthButton>
              </ContainerAuthorization>
            </View>
          )}
        </KeyboardAwareScrollView>
      </Container>
    </ThemeProvider>
  );
};

export default Authorization;
