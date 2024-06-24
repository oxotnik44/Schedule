import { Dimensions } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const NoConnected = styled.Text`
  font-size: ${screenWidth * 0.055}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  width: ${screenWidth * 0.95}px;
`;

export const ErrorMessage = styled.Text`
  font-size: ${screenWidth * 0.05}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  width: ${screenWidth * 0.95}px;
`;

export const BookItemContainer = styled.View`
  flex-direction: row;
  padding: ${screenHeight * 0.012}px;
  border-bottom-width: ${screenHeight * 0.002}px;
  border-bottom-color: ${(props) => props.theme.borderColor};
  width: ${screenWidth * 0.9}px;
  align-items: center;
`;

export const BookCover = styled.Image`
  width: ${screenWidth * 0.25}px;
  height: ${screenHeight * 0.19}px;
  margin-right: ${screenWidth * 0.03}px;
`;

export const BookInfo = styled.View`
  flex: 1;
`;

export const BookTitle = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
`;

export const BookReturnDate = styled.Text`
  font-size: ${screenWidth * 0.035}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Regular";
`;
