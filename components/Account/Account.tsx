import React from "react";
import { Container } from "./AccountStyle";
import Profile from "./PersonalAccountStudent/Profile/Profile";
import Authorization from "../Authorization/Authorization";
import { useSelector } from "react-redux";
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import СurrentGradesModulesStudent from "./PersonalAccountStudent/FunctionalModulesStudent/СurrentGradesModulesStudents/СurrentGradesModulesStudent";
import RecordBookModulesStudent from "./PersonalAccountStudent/FunctionalModulesStudent/RecordBookModulesStudents/RecordBookModulesStudent";
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
interface AuthUserTokenState {
  AuthTokenSlice: {
    token: string | null;
  };
}
const Account = ({ navigation }: ScheduleProps) => {
  const authTokenUser = useSelector(
    (stata: AuthUserTokenState) => stata.AuthTokenSlice.token
  );
  return (
    <Container style={{ flexDirection: "column" }}>
      {authTokenUser !== null ? (
        <Authorization navigation={navigation}/>
      ) : (
        <View>
          {/* <Profile/> */}
          {/* <FunctionalModulesStudent navigation={navigation}/> */}
        </View>
      )}
    </Container>
  );
};

export default Account;
