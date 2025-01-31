import { Provider, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import Load from "./onLoad";
import { StatusBar } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./Navigate";
import { store } from "./redux/store";
import moment from "moment";

type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};
moment.tz.setDefault("Asia/Novosibirsk");

const App = ({ navigation }: GroupsProps): JSX.Element => {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <Load navigation={navigation} />
    </Provider>
  );
};

export default App;
