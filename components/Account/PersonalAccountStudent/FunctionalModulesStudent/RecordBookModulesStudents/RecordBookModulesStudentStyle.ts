import { Dimensions } from "react-native";
import styled, { css } from "styled-components/native";

interface ITableRowProps {
  isLast?: boolean;
  isCompetencyCode?: boolean; // Добавляем новый интерфейсный параметр
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
interface ArrowIconProps {
  isRotate: boolean;
}
export const MainContainer = styled.View`
  flex: 1;
  padding: 15px;
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const CourseContainer = styled.View``;

export const CourseTitle = styled.Text`
  font-size: ${screenWidth * 0.05}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding: 10px;
`;

export const SemesterContainer = styled.View`
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const SemesterTitle = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  padding: 10px;
  margin-left: 10px;
`;

export const TableRow = styled.View<ITableRowProps>`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: ${({ isLast, isCompetencyCode }) =>
    isLast || isCompetencyCode
      ? "0px"
      : "2px"}; /* Условие для border-bottom-width */
  border-color: #ddd;
`;

export const TitleValue = styled.Text`
  width: 48%;
  font-size: ${screenWidth * 0.037}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  flex-shrink: 0;
  overflow: hidden;
  align-self: center;
`;
export const ButtonOpenCourse = styled.Pressable`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-radius: 15px;
  background-color: ${(props) => props.theme.containerColor};
  height: ${screenHeight * 0.1}px;
  margin-top: ${screenHeight * 0.02}px;
  width: ${screenWidth * 0.4}px;
  padding: 0 ${screenWidth * 0.03}px;
`;
export const TableRowHeader = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding: 5px;
  border-radius: 5px;
  text-align: center;
`;
export const ArrowIcon = styled.Image<ArrowIconProps>`
  width: ${screenWidth * 0.05}px;
  height: ${screenHeight * 0.02}px;
  resize-mode: contain;
  tint-color: ${(props) => props.theme.imageColor};
  transform: ${({ isRotate }) =>
    isRotate ? "rotate(0deg)" : "rotate(270deg)"};
`;
export const ContainerComponent = styled.View`
  margin-bottom: ${screenHeight * 0.02}px;
  border-radius: 15px;
  border: 3px solid ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.containerColor};
`;

export const ContainerTypeControl = styled.View<{
  shouldRenderBorder: boolean;
}>`
  margin-bottom: 5px;
  border-top-width: 2px;
  border-color: black; /* обводка контроля */
`;

export const ContainerDiscipline = styled.View`
  margin-bottom: 10px;
  border-top-width: 1px;
  border-color: black; /* обводка дисциплины */
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const NoCreditBook = styled.Text`
  text-align: center;
  font-size: ${screenWidth * 0.05}px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
`;
