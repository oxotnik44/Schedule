import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

import {
  MainContainer,
  CourseContainer,
  CourseTitle,
  SemesterContainer,
  SemesterTitle,
  TableRow,
  TitleValue,
  TableRowHeader,
  ContainerComponent,
  ContainerTypeControl,
  ContainerDiscipline,
  NoCreditBook,
  CenteredContainer,
  ArrowIcon,
  ButtonOpenCourse,
} from "./RecordBookModulesStudentStyle";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}

interface ISemesterGrades {
  SemesterGradesInfoSlice: {
    dataSemesterGrades: {
      numberCourse: number;
      nameCourse: string;
      semesters: {
        nameSemester: string;
        numberSemester: number;
        typeComponent: {
          nameControl: string;
          typeControl: {
            nameTypeControl: string;
            disciplines: {
              nameDiscipline: string;
              codeDiscipline: string;
              grade: string;
              listCompetencies: {
                competencyCode: string;
                competencyName: string;
              }[];
            }[];
          }[];
        }[];
      }[];
    }[];
  };
}

const RecordBookModulesStudent = () => {
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const semesterGradesData = useSelector(
    (state: ISemesterGrades) => state.SemesterGradesInfoSlice.dataSemesterGrades
  );
  const [collapsed, setCollapsed] = useState<boolean[]>([]);

  const toggleCourse = (index: number) => {
    const newCollapsedState = [...collapsed];
    newCollapsedState[index] = !newCollapsedState[index];
    setCollapsed(newCollapsedState);
  };

  const renderSemester = ({ item: semester, index: semesterIndex }) => (
    <SemesterContainer key={semesterIndex}>
      <SemesterTitle>{semester.numberSemester} семестр</SemesterTitle>
      {semester.typeComponent.map((typeComponent, typeComponentIndex) => (
        <ContainerComponent key={typeComponentIndex}>
          <TableRow>
            <TableRowHeader>Компонент:</TableRowHeader>
            <TitleValue>{typeComponent.nameControl}</TitleValue>
          </TableRow>
          {typeComponent.typeControl.map((typeControl, typeControlIndex) => (
            <ContainerTypeControl
              key={typeControlIndex}
              shouldRenderBorder={typeControlIndex > 0}
            >
              <TableRow>
                <TableRowHeader>Контроль:</TableRowHeader>
                <TitleValue>{typeControl.nameTypeControl}</TitleValue>
              </TableRow>
              {typeControl.disciplines.map((discipline, disciplineIndex) => {
                const isLastDiscipline =
                  disciplineIndex === typeControl.disciplines.length - 1;
                return (
                  <ContainerDiscipline key={disciplineIndex}>
                    <TableRow>
                      <TableRowHeader>Дисциплина:</TableRowHeader>
                      <TitleValue>{discipline.nameDiscipline}</TitleValue>
                    </TableRow>
                    <TableRow>
                      <TableRowHeader>Оценка:</TableRowHeader>
                      <TitleValue>{discipline.grade}</TitleValue>
                    </TableRow>
                    <TableRow isLast={isLastDiscipline} isCompetencyCode={true}>
                      <TableRowHeader>Код компетенции:</TableRowHeader>
                      <TitleValue>
                        {discipline.listCompetencies
                          .map((competency) => competency.competencyCode)
                          .join(", ")}
                      </TitleValue>
                    </TableRow>
                  </ContainerDiscipline>
                );
              })}
            </ContainerTypeControl>
          ))}
        </ContainerComponent>
      ))}
    </SemesterContainer>
  );
  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        {semesterGradesData === null ? (
          <CenteredContainer>
            <NoCreditBook>Нет зачетной книжки или оценок в ней.</NoCreditBook>
          </CenteredContainer>
        ) : (
          <FlatList
            data={semesterGradesData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <CourseContainer key={index}>
                <ButtonOpenCourse onPress={() => toggleCourse(index)}>
                  <CourseTitle>{item.numberCourse} курс</CourseTitle>
                  <ArrowIcon
                    source={require("../../../../../assets/ArrowBack.png")}
                    isRotate={collapsed[index]}
                  />
                </ButtonOpenCourse>
                {collapsed[index] && (
                  <FlatList
                    data={item.semesters}
                    keyExtractor={(item, semesterIndex) =>
                      semesterIndex.toString()
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={renderSemester}
                    initialNumToRender={2}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                  />
                )}
              </CourseContainer>
            )}
          />
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

export default RecordBookModulesStudent;
