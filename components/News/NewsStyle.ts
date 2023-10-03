import { Dimensions } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export const Container = styled.View`
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
`;
export const PhotoNews = styled.Image`
  width: ${screenWidth * 0.9}px;
  height: ${screenHeight * 0.3}px;
  align-self: center;
  margin-bottom: ${screenHeight * 0.01}px;
  margin-top: ${screenHeight * 0.01}px;
  border-radius: 15px;
`;

export const PublicationDateContainer = styled.View`
  align-items: flex-end;
`;

export const PublicationDate = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  color: ${(props) => props.theme.textColor};
  margin-top: ${screenHeight * 0.01}px;
  font-family: "Montserrat-SemiBold";
  margin-right: ${screenWidth * 0.07}px;
`;

export const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.05}px;
  font-weight: bold;
  margin-left: ${screenWidth * 0.03}px;
  font-family: "Montserrat-Bold";
  height: auto;
  padding-horizontal: ${screenWidth * 0.02}px;
`;

export const TextNews = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  font-size: ${screenWidth * 0.04}px;
  text-align: left;
  height: auto;
  padding-horizontal: ${screenWidth * 0.05}px;
`;
