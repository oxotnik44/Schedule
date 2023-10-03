import styled, { css } from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
interface ArrowIconProps {
  isRotate: boolean;
}
export const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const ChoiceGroup = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  width: ${screenWidth * 0.7}px;
  height: ${screenHeight * 0.1}px;
  margin-top: ${screenHeight * 0.01}px;
  justify-content: center;
  padding-left: ${screenWidth * 0.05}px;
`;

export const ContainerGroups = styled.TouchableOpacity`
  width: ${screenWidth * 0.9}px;
  height: ${screenHeight * 0.1}px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 15px;
  margin-top: ${screenHeight * 0.025}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${screenWidth * 0.04}px;
`;

export const ArrowIcon = styled.Image<ArrowIconProps>`
  width: ${screenWidth * 0.06}px;
  height: ${screenHeight * 0.06}px;
  resize-mode: contain;
  tint-color: ${(props) => props.theme.imageColor};

  transform: rotate(270deg);
  ${(props) =>
    props.isRotate &&
    css`
      transform: rotate(360deg);
    `}
`;

export const NameGroup = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.045}px;
  font-family: "Montserrat-SemiBold";
  width: ${screenWidth * 0.6}px;
`;

export const ContainerChoiceGroup = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: ${screenHeight * 0.015}px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.containerColor};
  height: ${screenHeight * 0.1}px;
  margin-top: ${screenHeight * 0.02}px;
  width: ${screenWidth * 0.8}px;
  align-self: center;
  padding: 0 ${screenWidth * 0.055}px;
`;

export const TextChoiceGroups = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.05}px;
  font-family: "Montserrat-SemiBold";
`;

export const RotatedArrow = styled(ArrowIcon)`
  top: 50%;
  transform: translateY(-10px) rotate(270deg);
`;
