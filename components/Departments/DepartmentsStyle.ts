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

export const ContainerDepartments = styled.TouchableOpacity`
  width: ${screenWidth * 0.9}px;
  min-height: ${screenHeight * 0.1}px;
  height: auto;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 20px;
  margin-top: ${screenHeight * 0.025}px;
  flex-direction: row;
  align-items: center;
  padding: 0 ${screenWidth * 0.05}px;
`;

export const NameDepartments = styled.Text`
  margin-left: ${screenWidth * 0.01}px;
  width: ${screenWidth * 0.6}px;
  height: auto;
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
  font-family: "Montserrat-SemiBold";
  padding-vertical:10px;
`;

export const ContainerSearchGroups = styled.View`
  align-items: center;
  border-radius: 20px;
  margin-top: ${screenHeight * 0.02}px;
`;

export const SearchInput = styled.TextInput`
  font-size: ${screenWidth * 0.045}px;
  border-radius: 13px;
  flex: 1;
  margin-left: 10px;
  color: ${(props) => props.theme.textSearchColor};
`;

export const SearchButton = styled.TouchableOpacity`
  width: ${screenWidth * 0.3}px;
  height: ${screenHeight * 0.05}px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #babfcf;
  margin-top: ${screenHeight * 0.015}px;
`;

export const SearchButtonText = styled.Text`
  color: black;
  font-size: ${screenWidth * 0.05}px;
`;

export const SearchImage = styled.Image`
  width: ${screenWidth * 0.06}px;
  height: ${screenWidth * 0.06}px;
  tint-color: ${(props) => props.theme.imageColor};
`;
export const SearchContainer = styled.View`
  width: ${screenWidth * 0.9}px;
  height: ${screenHeight * 0.06}px;
  flex-direction: row;
  align-items: center;
  border-radius: 13px;
  background-color: ${(props) => props.theme.containerSearchColor};
  elevation: 4;
  padding-horizontal: ${screenWidth * 0.03}px;
`;
