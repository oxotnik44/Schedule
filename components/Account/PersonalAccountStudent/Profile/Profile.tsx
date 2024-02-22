import React from "react";
import { useSelector } from "react-redux";
import {
  Container,
  ProfileImage,
  ProfileInfoContainer,
  ProfileInfoText,
} from "./ProfileStyle";
import { ThemeProvider } from "styled-components/native";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
const ProfileStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <ProfileImage
          resizeMode="contain"
          source={require("../../../assets/Educator.png")}
        />
        <ProfileInfoContainer>
          <ProfileInfoText>ФИО:Новиков Артём Витальевич</ProfileInfoText>
          <ProfileInfoText>Телефон:+79133726299</ProfileInfoText>
          <ProfileInfoText>Email:artemnovikov1969@gmail.com</ProfileInfoText>
        </ProfileInfoContainer>
      </Container>
    </ThemeProvider>
  );
};

export default ProfileStudent;
