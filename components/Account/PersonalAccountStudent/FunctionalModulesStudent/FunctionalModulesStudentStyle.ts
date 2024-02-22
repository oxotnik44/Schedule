import styled from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const ContainerFunctionalModule = styled.View`
  height: ${screenHeight * 0.4}px;
  width: ${screenWidth * 0.4}px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 15px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;
export const ModuleName = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
  font-family: "Montserrat-SemiBold";
`;
export const ModuleImage = styled.Image`
  height: ${screenHeight * 0.15}px;
  width: ${screenWidth * 0.3}px;
`;
