import React, { useCallback } from "react";
import { FlatList, Dimensions, View, ToastAndroid, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider } from "styled-components/native";
import { RootStackParamList } from "../../../../../Navigate";
import { Container, NoConnected } from "./LibraryStyle";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type LibraryProps = {
  navigation: StackNavigationProp<RootStackParamList>;
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
const Library = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );

  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : (
          <View>
            <Text>qwe</Text>
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Library;
