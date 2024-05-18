import styled from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  width: auto;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2px;
  margin-top: 20px;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const ProfileImage = styled.Image`
  width: ${screenWidth * 0.25}px;
  height: ${screenHeight * 0.1}px;
  tint-color: ${(props) => props.theme.imageColor};
  margin-top: 20px;
`;

export const ProfileInfoContainer = styled.View`
  width: 80%;
  align-items: center;
  tint-color: ${(props) => props.theme.imageColor};
  margin: ${screenWidth * 0.05}px;
`;

export const ProfileNameText = styled.Text`
  font-size: ${screenWidth * 0.05}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  text-align: center;
  align-self: center;
  padding-top: 10px;
`;

export const DropdownContainer = styled.View`
  padding: 10px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 5px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: { width: 0, height: 2 };
  elevation: 5; 
  margin: 10px; 
  align-items: center; 
`;

export const InfoCard = styled.View`
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.containerColor};
  width: 90%;
  align-self: center;
`;

export const InfoItem = styled.Text`
  font-size: 12px;
  font-family: "Montserrat-SemiBold";
  color: ${(props) => props.theme.textColor};
  padding: 5px;
`;

export const InfoTitle = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  width: 100%;
  text-align: center;
  padding-bottom: 5px;
`;
export const BtnLogout = styled.Pressable`
  border-radius: 10px;
  padding: 10px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: ${(props) => props.theme.containerColor};
`;
export const BtnELogoutText = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  text-align: center;
`;
