import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
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

const ProfileStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataStudent = useSelector(
    (state: ProfileInfo) => state.ProfileInfoSlice.personalDataStudent
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Container style={{ marginBottom: isInfoVisible ? 300 : 0 }}>
        <ProfileImage
          resizeMode="contain"
          source={require("../../../../assets/Account.png")}
        />
        <ProfileNameText>{dataStudent.fullName}</ProfileNameText>
        <ProfileInfoContainer>
          <TouchableOpacity onPress={() => setIsInfoVisible(!isInfoVisible)}>
            <InfoTitle>Полная информация</InfoTitle>
          </TouchableOpacity>
          {isInfoVisible && (
            <InfoCard>
              <InfoItem>Номер группы: {dataStudent.numberGroup} </InfoItem>
              <InfoItem>Email: {dataStudent.email}</InfoItem>
            </InfoCard>
          )}
        </ProfileInfoContainer>
      </Container>
    </ThemeProvider>
  );
};

//<InfoItem>Дата рождения: {studentData? studentData.birthDate || "Не указана"}</InfoItem>

export default ProfileStudent;
