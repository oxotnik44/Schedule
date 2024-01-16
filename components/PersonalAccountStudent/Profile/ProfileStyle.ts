import styled from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  width: auto;
  height: 150px;
  flex-direction: row;
`;

export const ProfileImage = styled.Image`
  width: ${screenWidth * 0.25}px;
  height: ${screenWidth * 0.25}px;
  tint-color: ${(props) => props.theme.imageColor};
  margin-left: 10px;
`;
export const ProfileInfoContainer = styled.View`
  height: ${screenWidth * 0.4}px;
  tint-color: ${(props) => props.theme.imageColor};
  margin: ${screenWidth * 0.05}px;
`;
export const ProfileInfoText = styled.Text`
  font-size: ${screenWidth * 0.03}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
`;
