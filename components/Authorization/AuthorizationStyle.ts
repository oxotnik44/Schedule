import { Dimensions } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View<{ px: number }>`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  bottom: ${(props) => props.px}px; /* Обратите внимание на добавление "px" для значения */
`;


export const NoConnected = styled.Text`
  font-size: ${screenWidth * 0.055}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  width: ${screenWidth * 0.95}px;
`;

export const ContainerAuthorization = styled.View`
  align-items: center;
  margin-top: ${-screenHeight * 0.1}px;
`;

export const AuthButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.containerColor};
  padding: 10px 20px;
  border-radius: 11px;
  margin-top: ${screenHeight * 0.02}px;
`;

export const AuthButtonText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  font-size: ${screenWidth * 0.05}px;
`;

export const AuthInput = styled.TextInput`
  width: ${screenWidth * 0.8}px;
  height: ${screenHeight * 0.06}px;
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 5px;
  padding: 10px;
  font-family: "Montserrat-SemiBold";
  font-size: ${screenWidth * 0.04}px;
  color: ${(props) => props.theme.textColor};
  margin-vertical: ${screenHeight * 0.01}px;
`;
export const AuthImage = styled.Image`
  width: ${screenWidth * 0.5}px;
  height: ${screenHeight * 0.5}px;
  resize-mode: contain;
  align-self: center;
  margin-bottom: ${screenHeight * 0.1}px;
`;
