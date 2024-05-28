import React from "react";
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import { RootStackParamList } from "../../../../../Navigate";
import {
  Container,
  NoConnected,
  InfoRow,
  InfoLabel,
  InfoValue,
} from "./FullInfoStudentStyle";

type LibraryProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

type ProfileUser = {
  ProfileInfoSlice: {
    personalDataStudent: {
      login: string;
      fullName: string;
      numberGroup: string;
      email: string;
      creditBook: string | undefined;
      faculty: string;
      formEducation: string;
      studyDirection: string;
      profileLearning: string;
      yearEntry: string;
    };
  };
};

type ITheme = {
  SettingsSlice: {
    theme: any;
  };
};

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
  };
}

interface iTokenUser {
  AuthTokenSlice: {
    accessToken: any;
  };
}

const FullInfoStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const profileUser = useSelector(
    (state: ProfileUser) => state.ProfileInfoSlice.personalDataStudent
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : (
          <View>
            <InfoRow>
              <InfoLabel>ФИО:</InfoLabel>
              <InfoValue>{profileUser.fullName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Номер группы:</InfoLabel>
              <InfoValue>{profileUser.numberGroup}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{profileUser.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Зачетная книжка:</InfoLabel>
              <InfoValue>{profileUser.creditBook}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Факультет:</InfoLabel>
              <InfoValue>{profileUser.faculty}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Форма обучения:</InfoLabel>
              <InfoValue>{profileUser.formEducation}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Направление обучения:</InfoLabel>
              <InfoValue>{profileUser.studyDirection}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Профиль обучения:</InfoLabel>
              <InfoValue>{profileUser.profileLearning}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Год поступления:</InfoLabel>
              <InfoValue>{profileUser.yearEntry}</InfoValue>
            </InfoRow>
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default FullInfoStudent;
