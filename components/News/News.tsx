import React from "react";
import { View, FlatList, Pressable, Linking, ToastAndroid } from "react-native";
import { useSelector } from "react-redux";
import {
  Container,
  NoConnected,
  PhotoNews,
  PublicationDate,
  PublicationDateContainer,
  TextNews,
  Title,
} from "./NewsStyle";
import { ThemeProvider } from "styled-components/native";

interface INewsItem {
  title: string;
  link: string;
  textNews: string;
  photoNews: string;
  publicationDate: string;
}

interface IState {
  NewsSlice: {
    newsData: INewsItem[];
  };
}
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
const NewsItem = ({ item }: { item: INewsItem }) => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const handlePress = () => {
    if (!isConnected) {
      ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
    } else {
      Linking.openURL(item.link);
    }
  };

  return (
    <View>
      <Pressable onPress={handlePress}>
        <PublicationDateContainer>
          <PublicationDate>{item.publicationDate}</PublicationDate>
        </PublicationDateContainer>
        <PhotoNews source={{ uri: item.photoNews }} resizeMode="cover" />
        <Title>{item.title}</Title>
      </Pressable>
      <TextNews style={{ alignSelf: "center" }}>{item.textNews}</TextNews>
    </View>
  );
};

const News = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataNews = useSelector((state: IState) => state.NewsSlice.newsData);
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected && !dataNews.length ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : (
          <FlatList
            data={dataNews}
            renderItem={({ item }) => <NewsItem item={item} />}
            keyExtractor={(item) => item.title}
            initialNumToRender={5}
            windowSize={5}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default News;
