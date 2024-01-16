import React from "react";
import { Container } from "./AccountStyle";
import Profile from "./Profile/Profile";
import FunctionalModulesStudent from "./FunctionalModulesStudent/FunctionalModulesStudent";

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

const Account = () => {
  return (
    <Container style={{ flexDirection: "column" }}>
      <Profile />
      <FunctionalModulesStudent />
    </Container>
  );
};

export default Account;
