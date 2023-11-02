import styled from "styled-components/native";
import { Dimensions } from "react-native";
interface ContainerProps {
  currentState: string; // Замените 'other' на другие варианты, если нужно
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;
export const ToggleContainer = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.backgroundColor};
`;
export const ToggleButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 4px;
  align-items: center;
  background-color: ${(props) => props.theme.mainColor};
`;
export const ToggleButtonText = styled.Text<ContainerProps>`
  font-size: ${screenWidth * 0.043}px;
  color: ${(props) => props.currentState};
  font-family: Montserrat-Bold;
`;
export const ContainerGroup = styled.View`
  width: ${screenWidth * 0.95}px;
  min-height: ${screenHeight * 0.1}px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 15px;
  margin-top: ${screenHeight * 0.03}px;
  align-items: center;
  flex-direction: row;
`;
export const IconContainer = styled.TouchableOpacity`
  justify-content: center;
`;
export const IconDelete = styled.Image`
  height: ${screenHeight * 0.05}px;
  width: ${screenWidth * 0.2}px;
  resize-mode: center;
  tint-color: ${(props) => props.theme.imageColor};
`;

export const GroupText = styled.Text`
  font-size: ${screenWidth * 0.043}px;
  color: ${(props) => props.theme.textColor};
  flex: 1;
  margin-left: ${screenWidth * 0.05}px;
  text-align-vertical: center;
  font-family: Montserrat-SemiBold;
`;
export const TextNoFavorites = styled.Text`
  font-size: ${screenWidth * 0.06}px;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
  font-family: Montserrat-SemiBold;
`;
export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
