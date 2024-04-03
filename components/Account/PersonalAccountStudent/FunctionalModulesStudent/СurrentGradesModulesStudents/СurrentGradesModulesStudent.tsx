import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  MainContainer,
  DisciplinesContainer,
  DisciplineItem,
  DisciplineTitle,
  GradesContainer,
  GradeItem,
  GradeText,
  GradeDate,
} from "./СurrentGradesModulesStudentStyle";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}

const СurrentGradesModulesStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);

  // Обновленная структура данных оценок с датами
  const gradesData = [
    {
      discipline: "Компьютерные технологии",
      grades: [
        { grade: 5, date: "03.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
      ],
    },
    {
      discipline: "Философия",
      grades: [
        { grade: 4, date: "01.04.2024" },
        { grade: 3, date: "31.03.2024" },
      ],
    },
    {
      discipline: "Психология общения",
      grades: [
        { grade: 5, date: "03.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
      ],
    },
    {
      discipline: "Разработка и тестирование программных модулей",
      grades: [
        { grade: 5, date: "03.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
        { grade: 4, date: "02.04.2024" },
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <DisciplinesContainer>
          {gradesData.map((item, index) => (
            <DisciplineItem key={index}>
              <DisciplineTitle>{item.discipline}</DisciplineTitle>
              <GradesContainer horizontal>
                {item.grades.map((gradeData, gradeIndex) => (
                  <GradeItem key={gradeIndex} grade={gradeData.grade}>
                    <GradeText>{gradeData.grade.toString()}</GradeText>
                    <GradeDate>{gradeData.date}</GradeDate>
                  </GradeItem>
                ))}
              </GradesContainer>
            </DisciplineItem>
          ))}
        </DisciplinesContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default СurrentGradesModulesStudent;
