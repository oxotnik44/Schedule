import React from "react";
import { Container } from "./AccountStyle";
import Profile from "./PersonalAccountStudent/Profile/Profile";
import FunctionalModulesStudent from "./PersonalAccountStudent/FunctionalModulesStudent/FunctionalModulesStudent";
import Authorization from "../Authorization/Authorization";
import { useSelector } from "react-redux";
import { View } from "react-native";

interface AuthUserTokenState {
  AuthTokenSlice: {
    token: string | null;
  };
}
const Account = () => {
  const authTokenUser = useSelector(
    (stata: AuthUserTokenState) => stata.AuthTokenSlice.token
  );
  return (
    <Container style={{ flexDirection: "column" }}>
      {authTokenUser === null ? (
        <Authorization />
      ) : (
        <View>
          <Profile />
          <FunctionalModulesStudent />
        </View>
      )}
    </Container>
  );
};

export default Account;
