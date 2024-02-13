import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  imgDepartments: {
    width: screenWidth * 0.18,
    height: screenHeight * 0.09,
    resizeMode: "contain",
    marginLeft: "auto",
    marginRight: screenWidth * 0.03,
  },
});
