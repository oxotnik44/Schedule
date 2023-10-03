import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const SelectGroup = styled.Image`
  height: ${screenHeight * 0.05}px;
  width: ${screenWidth * 0.1}px;
  tint-color: ${(props) => props.theme.imageColor};
`;
