import styled from "styled-components/native";

export const MainContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    padding: 15,
  },
}))`
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const DisciplinesContainer = styled.View`
  margin-top: 20px;
`;

export const DisciplineItem = styled.View`
  margin-bottom: 20px;
`;

export const DisciplineTitle = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
  margin-bottom: 10px;
`;

export const GradesContainer = styled.ScrollView.attrs(() => ({
  horizontal: true,
}))`
  flex-direction: row;
  margin-bottom: 10px;
  padding-bottom: 15px;
`;


export const GradeItem = styled.View<{ grade: number }>`
  background-color: ${(props) => {
    switch (props.grade) {
      case 2:
        return "red";
      case 3:
        return "orange";
      case 4:
        return "lightgreen";
      case 5:
        return "darkgreen";
      default:
        return "gray";
    }
  }};
  border-radius: 5px;
  padding: 10px;
  margin-right: 10px;
`;

export const GradeText = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  font-family: "Montserrat-Bold";
`;

export const GradeDate = styled.Text`
  font-size: 12px;
  color: white;
  font-family: "Montserrat-SemiBold";
`;
