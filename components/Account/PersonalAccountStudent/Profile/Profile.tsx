import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BtnELogoutText,
  BtnLogout,
  Container,
  ProfileImage,
} from "./ProfileStyle";
import { ThemeProvider } from "styled-components/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../Navigate";
import { deleteAccessToken } from "../../../../Storage/AuthTokenStorage";

type ProfileProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}

interface ProfileInfo {
  ProfileInfoSlice: {
    personalDataStudent: {
      fullName: string;
      numberGroup: string;
      email: string;
      creditBook: string;
    };
  };
}

interface UserToken {
  AuthTokenSlice: {
    accessToken: string | null;
  };
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataStudent = useSelector(
    (state: ProfileInfo) => state.ProfileInfoSlice.personalDataStudent
  );
  const accessToken = useSelector(
    (state: UserToken) => state.AuthTokenSlice.accessToken
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ marginBottom: isInfoVisible ? 300 : 0 }}>
        <ProfileImage
          resizeMode="contain"
          source={require("../../../../assets/Account.png")}
        />
        <BtnLogout
          onPress={() => {
            deleteAccessToken(dispatch);
            navigation.navigate("Account");
            console.log("Токен успешно удалён");
          }}
        >
          <BtnELogoutText>Выход</BtnELogoutText>
        </BtnLogout>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
