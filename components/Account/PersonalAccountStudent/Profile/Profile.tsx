import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BtnELogoutText,
  BtnLogout,
  Container,
  InfoCard,
  InfoItem,
  InfoTitle,
  ProfileImage,
  ProfileInfoContainer,
  ProfileNameText,
} from "./ProfileStyle";
import { ThemeProvider } from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { logoutUser } from "../../../../api/apiUserStudent";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../Navigate";

type ProfileProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}

interface ProfileInfo {
  ProfileInfoSlice: {
    personalDataStudent: {
      fullName: string;
      numberGroup: string;
      email: string;
      creditBook: string;
    };
  };
}

interface UserToken {
  AuthTokenSlice: {
    accessToken: string | null;
  };
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataStudent = useSelector(
    (state: ProfileInfo) => state.ProfileInfoSlice.personalDataStudent
  );
  const accessToken = useSelector(
    (state: UserToken) => state.AuthTokenSlice.accessToken
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ marginBottom: isInfoVisible ? 300 : 0 }}>
        <BtnLogout
          onPress={() => {
            logoutUser(dispatch, accessToken, navigation);
          }}
        >
          <BtnELogoutText>Выход</BtnELogoutText>
        </BtnLogout>
        <ProfileImage
          resizeMode="contain"
          source={require("../../../../assets/Account.png")}
        />
        <ProfileNameText>{dataStudent.fullName}</ProfileNameText>
        {/* <ProfileInfoContainer>
          <TouchableOpacity onPress={() => setIsInfoVisible(!isInfoVisible)}>
            <InfoTitle>Полная информация</InfoTitle>
          </TouchableOpacity>
          {isInfoVisible && (
            <InfoCard>
              <InfoItem>Номер группы: {dataStudent.numberGroup} </InfoItem>
              <InfoItem>Email: {dataStudent.email}</InfoItem>
            </InfoCard>
          )}
        </ProfileInfoContainer> */}
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
