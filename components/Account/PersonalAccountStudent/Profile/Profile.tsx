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
    fullName: string;
  };
}

const ProfileStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const fullNameStudent = useSelector(
    (state: ProfileInfo) => state.ProfileInfoSlice.fullName
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
        <ProfileNameText>{fullNameStudent && fullNameStudent}</ProfileNameText>
        <ProfileInfoContainer>
          <TouchableOpacity onPress={() => setIsInfoVisible(!isInfoVisible)}>
            <InfoTitle>Полная информация</InfoTitle>
          </TouchableOpacity>
          {isInfoVisible && (
            <InfoCard>
              <InfoItem>Телефон: +1234567890</InfoItem>
              <InfoItem>Дата рождения: 01.01.1990</InfoItem>
              <InfoItem>Учебный план: 0000000000000</InfoItem>
            </InfoCard>
          )}
        </ProfileInfoContainer>
      </Container>
    </ThemeProvider>
  );
};

//<InfoItem>Дата рождения: {studentData? studentData.birthDate || "Не указана"}</InfoItem>

export default ProfileStudent;
