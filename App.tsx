import { Provider } from "react-redux";
import React from "react";
import Load from "./onLoad";
import { StatusBar } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./Navigate";
import { store } from "./redux/store";

type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};

const App = ({ navigation }: GroupsProps): JSX.Element => {
  
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <Load navigation={navigation} />
    </Provider>
  );
};

export default App;
