import styled from "styled-components/native";
interface ITableRowProps {
  isLast?: boolean;
}
export const MainContainer = styled.View`
  flex: 1;
  padding: 15px;
  background-color: ${(props) => props.theme.backgroundColor};
`;


export const CourseContainer = styled.View`
  margin-bottom: 20px;
`;

export const CourseTitle = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding: 10px;
  margin-bottom: 10px;
`;

export const SemesterContainer = styled.View`
`;

export const SemesterTitle = styled.Text`
  font-size: 17px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  padding: 10px;
  margin-left: 10px;
`;

export const TableRow = styled.View<ITableRowProps>`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: ${({ isLast }) => (isLast ? "0px" : "2px")};
  border-color: #ddd;
`;

export const TitleValue = styled.Text`
  width: 48%;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  flex-shrink: 0; /* Предотвращает уменьшение блока */
  overflow: hidden; /* Скрывает текст, который не помещается */
`;

export const TableRowHeader = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
  margin-right: 5px;
  text-align: center; /* Выравнивание текста по центру */
`;
export const ContainerComponent = styled.View`
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.containerColor};
`;
export const ContainerTypeControl = styled.View<{ shouldRenderBorder: boolean }>`
  margin-bottom: 5px;
  border-top-width: ${(props) => (props.shouldRenderBorder ? "2px" : "0px")};
  border-color: black;
`;

