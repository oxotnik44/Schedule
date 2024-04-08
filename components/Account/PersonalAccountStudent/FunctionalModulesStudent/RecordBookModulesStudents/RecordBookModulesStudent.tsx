import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  MainContainer,
  CourseSemesterContainer,
  CourseSemesterTitle,
  TableRow,
  TableCell,
  TableRowHeader,
} from "./RecordBookModulesStudentStyle";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
interface SemesterGrades {
  SemesterGradesInfoSlice: {
    semesterGradesData: {};
  };
}
interface Discipline {
  component: string;
  control: string;
  name: string;
  grade: string;
  competenceCode: string;
}

const testData = [
  {
    course: "2 курс",
    semesters: [
      {
        semester: "3 семестр",
        disciplines: [
          {
            component: "Лекция",
            control: "Зачет",
            name: "Высшая математика",
            grade: "Зачтено",
            competenceCode: "ВМ1",
          },
        ],
      },
      {
        semester: "4 семестр",
        disciplines: [
          {
            component: "Лекция",
            control: "Экзамен",
            name: "Теория вероятностей",
            grade: "5",
            competenceCode: "ТВ1",
          },
        ],
      },
    ],
  },
];

const RecordBookModulesStudent = () => {
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const headerToKeyMapping: { [key: string]: keyof Discipline } = {
    Компонент: "component",
    Контроль: "control",
    Дисциплина: "name",
    Оценка: "grade",
    "Код компетенции": "competenceCode",
  };
  const semesterGradesData = useSelector(
    (state: SemesterGrades) => state.SemesterGradesInfoSlice.semesterGradesData
  );
  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        {testData.map((course, courseIndex) =>
          course.semesters.map((semester, semesterIndex) => (
            <CourseSemesterContainer key={`${courseIndex}-${semesterIndex}`}>
              <CourseSemesterTitle>
                {course.course}, {semester.semester}
              </CourseSemesterTitle>
              {Object.entries(headerToKeyMapping).map(
                ([headerName, disciplineKey]) =>
                  semester.disciplines.map((discipline, disciplineIndex) => (
                    <TableRow
                      key={`discipline-${disciplineIndex}-${disciplineKey}`}
                    >
                      <TableRowHeader>{headerName}</TableRowHeader>
                      <TableCell>{discipline[disciplineKey]}</TableCell>
                    </TableRow>
                  ))
              )}
            </CourseSemesterContainer>
          ))
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

export default RecordBookModulesStudent;
