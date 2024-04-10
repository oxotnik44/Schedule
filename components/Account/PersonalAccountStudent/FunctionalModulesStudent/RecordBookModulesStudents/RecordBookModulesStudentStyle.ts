import styled from "styled-components/native";

export const MainContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    padding: 15,
  },
}))`
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const CourseContainer = styled.View`
  margin-bottom: 20px;
`;

export const CourseTitle = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
  padding: 10px;
  margin-bottom: 10px;
`;

export const SemesterContainer = styled.View`
  margin-bottom: 20px;
`;

export const SemesterTitle = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding: 10px;
`;

export const TableRow = styled.View`
  flex-direction: row;
  justify: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-color: #ddd;
`;

export const TableCell = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-SemiBold";
`;

export const TableRowHeader = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  padding-right: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-right: 5px;
`;
