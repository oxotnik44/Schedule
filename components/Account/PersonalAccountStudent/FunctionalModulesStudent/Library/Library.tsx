import React, { useCallback } from "react";
import {
  FlatList,
  Dimensions,
  View,
  ToastAndroid,
  Text,
  Pressable,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider } from "styled-components/native";
import { RootStackParamList } from "../../../../../Navigate";
import { Container, NoConnected, NoLibraryCard } from "./LibraryStyle";
import { getCreditBookStudent } from "../../../../../api/apiUserStudent";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
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
interface BooksState {
  idBook: number;
  dateReceipt: string | null;
  nameBook: string;
}
interface Library {
  LibraryInfoSlice: {
    dateLibrary: {
      cardLibrary: string | null;
      booksList: BooksState[];
    };
  };
}
const Library = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const profileUser = useSelector(
    (state: ProfileUser) => state.ProfileInfoSlice.personalDataStudent
  );
  const accessToken = useSelector(
    (state: iTokenUser) => state.AuthTokenSlice.accessToken
  );
  const Library = useSelector(
    (state: Library) => state.LibraryInfoSlice.dateLibrary
  );
  const isLibraryCard = true;
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : isLibraryCard ? (
          <Pressable
            onPress={() => {
              getCreditBookStudent(accessToken, dispatch, profileUser.login);
            }}
          >
            <Text>Список библиотечных книг на руках</Text>
          </Pressable>
        ) : (
          <NoLibraryCard>У вас нет читательского билета.</NoLibraryCard>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Library;
