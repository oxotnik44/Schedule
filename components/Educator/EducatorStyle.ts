import styled from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  justify-content: center;
  align-items: center;
`;

export const ContainerEducators = styled.TouchableOpacity`
  width: ${screenWidth * 0.95}px;
  height: ${screenHeight * 0.1}px;
  background-color: ${(props) => props.theme.containerColor};
  border-radius: 15px;
  margin-top: ${screenHeight * 0.025}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${screenWidth * 0.05}px;
`;

export const NameEducators = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;

export const RegaliaEducators = styled.Text`
  font-size: ${screenWidth * 0.038}px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;

export const ContainerSearchGroups = styled.View`
  margin-top: ${screenHeight * 0.02}px;
  align-items: center;
  border-radius: 20px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${screenWidth * 0.041}px;
  margin-left: 10px;
  border-radius: 13px;
  color: ${(props) => props.theme.textColor};
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

export const SearchImage = styled.Image`
  width: ${screenWidth * 0.06}px;
  height: ${screenWidth * 0.06}px;
  tint-color: ${(props) => props.theme.imageColor};
`;

export const SelectEducator = styled.Image`
  width: ${screenWidth * 0.1}px;
  height: ${screenHeight * 0.053}px;
  tint-color: ${(props) => props.theme.imageColor};
`;
export const NoConnected = styled.Text`
  font-size: ${screenWidth * 0.055}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  text-align: center;
  width: ${screenWidth * 0.95}px;
`;