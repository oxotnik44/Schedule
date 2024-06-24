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
  width: ${screenWidth * 0.42}px;
  min-height: ${screenHeight * 0.17}px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 15px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  border-color: ${(props) => props.theme.containerStrokeColor};
  border-width: 4px;
  padding: 10px;
`;

export const ModuleName = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
  font-family: "Montserrat-SemiBold";
`;

interface ModuleImageProps {
  tintColor?: string;
}

export const ModuleImage = styled.Image<ModuleImageProps>`
  height: ${screenHeight * 0.1}px;
  width: ${screenWidth * 0.2}px;
  align-self: center;
  tint-color: ${(props) => props.tintColor || "none"};
`;

export const ServicesTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.05}px;
  font-family: "Montserrat-Bold";
  padding: 5px;
  margin-left: ${screenWidth * 0.02}px;
`;
