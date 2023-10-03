import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import React from "react";
import Load from "./onLoad";
import { StatusBar } from "react-native";
const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <Load />
    </Provider>
  );
};

export default App;
