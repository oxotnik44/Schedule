import React from "react";
import { Container } from "./AccountStyle";
import Profile from "./PersonalAccountStudent/Profile/Profile";
import Authorization from "../Authorization/Authorization";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import FunctionalModulesStudent from "./PersonalAccountStudent/FunctionalModulesStudent/FunctionalModulesStudent";

type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

interface AuthUserTokenState {
  AuthTokenSlice: {
    accessToken: string | null;
  };
}

const Account: React.FC<NavigationProps> = ({ navigation }) => {
  const authTokenUser = useSelector(
    (state: AuthUserTokenState) => state.AuthTokenSlice.accessToken
  );
  console.log(authTokenUser)
  const dispatch = useDispatch();

  return (
    <Container style={{ flexDirection: "column" }}>
      {authTokenUser == null ? (
        <Authorization />
      ) : (
        <View>
          <Profile navigation={navigation} />
          <FunctionalModulesStudent navigation={navigation} />
        </View>
      )}
    </Container>
  );
};

export default Account;
