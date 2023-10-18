import { Dimensions } from "react-native";
import styled from "styled-components/native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const TextSwitchTheme = styled.Text`
  font-size: ${screenWidth * 0.05}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  margin-top: ${screenHeight * 0.02}px;
`;
export const TextIncorporateTheme = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  margin-top: ${screenHeight * -0.01}px;
`;
export const TextPrivacyPolicy = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  margin-top: ${screenHeight * 0.02}px;
`;
export const BtnPrivacyPolicy = styled.Pressable`
  height: ${screenHeight * 0.05}px;
  width: ${screenWidth * 0.5}px;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 20px;
  margin-top: ${screenHeight * 0.02}px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;
