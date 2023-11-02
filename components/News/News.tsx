import React from "react";
import { View, Text, Image, FlatList, Pressable, Linking } from "react-native";
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
  newsReducer: {
    newsData: INewsItem[];
  };
}
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
interface Settings {
  settingsReducer: {
    isConnected: boolean;
  };
}
const NewsItem = ({ item }: { item: INewsItem }) => {
  const handlePress = () => {
    Linking.openURL(item.link);
  };

  return (
    <View>
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
    </View>
  );
};

const News = () => {
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const dataNews = useSelector((state: IState) => state.newsReducer.newsData);
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected ? (
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
