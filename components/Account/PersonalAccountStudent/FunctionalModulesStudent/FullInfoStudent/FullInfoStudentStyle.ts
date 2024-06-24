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

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${screenHeight * 0.01}px;
  width: ${screenWidth * 0.9}px;
`;

export const InfoLabel = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  width: ${screenWidth * 0.4}px;
`;

export const InfoValue = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Regular";
  width: ${screenWidth * 0.5}px;
  user-select: text;
`;

export const NoConnected = styled.Text`
  font-size: ${screenWidth * 0.055}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  width: ${screenWidth * 0.95}px;
`;
export const CopyButtonContainer = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 5px;
  margin-top: 10px;
  width: ${screenWidth * 0.9}px;
  align-self: center;
`;

export const CopyButtonText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;
