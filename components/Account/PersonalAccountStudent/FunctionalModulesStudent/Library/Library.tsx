import React, { useEffect } from "react";
import { FlatList, Dimensions, View, Text, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import { RootStackParamList } from "../../../../../Navigate";
import {
  Container,
  NoConnected,
  ErrorMessage,
  BookItemContainer,
  BookCover,
  BookInfo,
  BookTitle,
  BookReturnDate,
} from "./LibraryStyle";

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

interface BookState {
  bookCover: string | null;
  bookTitle: string;
  dataReturn: string;
  url: string;
}

interface Library {
  LibraryInfoSlice: {
    dateLibrary: {
      booksList: BookState[];
      status: number | null;
    };
  };
}
const Library = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);

  const { booksList, status } = useSelector(
    (state: Library) => state.LibraryInfoSlice.dateLibrary
  );

  const renderBookItem = ({ item }: { item: BookState }) => (
    <BookItemContainer>
      <BookCover source={{ uri: item.bookCover }} />
      <BookInfo>
        <BookTitle>{item.bookTitle}</BookTitle>
        <BookReturnDate>Дата возврата: {item.dataReturn}</BookReturnDate>
      </BookInfo>
    </BookItemContainer>
  );

  const getContent = () => {
    if (!isConnected) {
      return <NoConnected>Нет соединения с интернетом</NoConnected>;
    }
    switch (status) {
      case 204:
        return <ErrorMessage>Нет доступных книг</ErrorMessage>;
      case 404:
        return (
          <ErrorMessage>У вас нет читательского билета.</ErrorMessage>
        );
      case 500:
        return (
          <ErrorMessage>Что-то пошло не так. Попробуйте позже</ErrorMessage>
        );
      default:
        return (
          <FlatList
            data={booksList}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.url}
            showsVerticalScrollIndicator={false}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>{getContent()}</Container>
    </ThemeProvider>
  );
};

export default Library;
