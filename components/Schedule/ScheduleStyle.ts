import styled from "styled-components/native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
interface ContainerProps {
  typeWeek: any;
}
interface isColorPairProps {
  isColorPair: any;
}
interface groupTypeProps {
  groupType: any;
}
export const Container = styled.View`
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const ToggleContainer = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.theme.containerColor};
`;

export const ToggleButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 7px;
  align-items: center;
  background-color: ${(props) => props.theme.mainColor};
`;

export const ToggleButtonText = styled.Text<groupTypeProps>`
  color: ${(props) => props.groupType};
  font-size: ${screenWidth * 0.039}px;
  font-family: Montserrat-Bold;
`;

export const TextWeekday = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.06}px;
  text-align: center;
  font-family: Montserrat-SemiBold;
`;

export const ContainerPair = styled.View<isColorPairProps>`
  width: ${screenWidth * 0.93}px;
  height: auto;
  border-radius: 15px;
  margin-bottom: ${screenHeight * 0.03}px;
  padding-horizontal: ${screenWidth * 0.05}px;
  background-color: ${(props) => props.isColorPair};
  padding-bottom: ${screenHeight * 0.015}px;
`;

export const ContainerLeft = styled.View`
  width: 65%;
  height: auto;
  align-items: flex-start;
  margin-top: ${screenHeight * 0.01}px;
`;

export const ContainerRight = styled.View`
  width: 35%;
  height: auto;
  align-items: flex-end;
  justify-content: center;
`;
export const TextNameEducator = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  font-family: "Montserrat-SemiBold";
`;
export const ContainerNamePair = styled.View`
  margin-bottom: ${screenHeight * 0.01}px;
`;

export const ContainerEducator = styled.View`
  flex-direction: row;
  margin-bottom: ${screenHeight * 0.01}px;
`;

export const TextNamePair = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
  text-align: center;
  margin-top: ${screenHeight * 0.01}px;
  margin-bottom: ${screenHeight * 0.01}px;
  font-family: "Montserrat-Bold";
`;

export const TextTypePair = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;

export const TextNameGroup = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.035}px;
  font-family: "Montserrat-SemiBold";
`;

export const TextRegaliaEducator = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.04}px;
`;

export const TextNumberPair = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  margin-top: ${screenHeight * 0.01}px;
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;

export const TextRoomNumber = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  text-align: center;
  font-family: "Montserrat-SemiBold";
`;

export const TextSelfStudy = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.045}px;
  text-align: center;
  margin-top: ${screenHeight * 0.015}px;
  font-family: "Montserrat-SemiBold";
  display: flex;
  justify-content: center;
  align-items: center;
`;

// export const SelectedGroupButton = styled.TouchableOpacity`
//   height: ${screenHeight * 0.05}px;
//   width: ${screenWidth * 0.6}px;
//   background-color: #ffffff;
//   border-radius: 15px;
//   justify-content: center;
//   align-items: center;
//   margin-top: ${screenHeight * 0.03}px;
//   margin-bottom: ${screenHeight * 0.03}px;
// `;

export const TextNamePairEllipsis = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenHeight * 0.01}px;
  width: ${screenWidth * 0.7}px;
  text-align: center;
`;

export const CenterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

export const KanikulyarText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.065}px;
`;

export const TextDate = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.065}px;
  align-self: center;
  margin-bottom: ${screenHeight * 0.01}px;
`;

export const TypeWeekContainer = styled.View`
  flex-direction: row;
`;

export const TypeWeekText = styled.Text<ContainerProps>`
  color: ${(props) => props.typeWeek};
  font-size: ${screenWidth * 0.037}px;
  padding: 4px;
  text-align: center;
  font-family: Montserrat-SemiBold;
`;

export const TypeWeekButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainColor};
`;
export const CommentsText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  font-family: "Montserrat-SemiBold";
  text-align: center;
`;
export const DateText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.055}px;
  text-align: center;
  font-family: Montserrat-Bold;
  margin-bottom: ${screenHeight * 0.01}px;
`;
export const BtnGetScheduleExtramural = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 15px;
  width: ${screenWidth * 0.2}px;
  height: ${screenHeight * 0.05}px;
  justify-content: center;
  margin-top: ${screenHeight * 0.01}px;
  align-items: center;
`;
export const TimeToLesson = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.03}px;
  font-family: "Montserrat-SemiBold";
  text-align: center;
`;
export const NoConnected = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  width: ${screenWidth * 0.95}px;
  text-align: center;
`;
export const IsSession = styled.Text`
  font-size: ${screenWidth * 0.06}px;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
  font-family: Montserrat-SemiBold;
`;
export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: ${screenWidth * 0.95}px;
`;
export const ScheduleCloseView = styled.Text`
  font-size: ${screenWidth * 0.05}px;
  justify-content: center;
  color: ${(props) => props.theme.textColor};
  font-family: Montserrat-SemiBold;
`;
export const CarouselItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-vertical: 10px;
  align-items: center;
  justify-content: center;
  width: ${screenWidth * 0.8}px; // Ширина элемента карусели
`;
export const CarouselItem = styled.View`
  padding: 16px;
  background-color: #f0f0f0; // Пример цвета, можно заменить на ваш
  border-radius: 8px;
`;
