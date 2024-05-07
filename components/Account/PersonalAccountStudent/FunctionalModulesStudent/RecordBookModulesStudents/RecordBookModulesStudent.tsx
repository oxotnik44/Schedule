import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import { Text, View, FlatList } from "react-native";
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
  NoCreditBook,
  CenteredContainer,
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
  const toggleCollapsed = (index: number) => {
    const newCollapsed = [...collapsed];
    newCollapsed[index] = !newCollapsed[index];
    setCollapsed(newCollapsed);
  };

  const renderSemester = ({ item: semester, index: semesterIndex }: any) => (
    <SemesterContainer key={semesterIndex}>
      <SemesterTitle>{semester.numberSemester} семестр</SemesterTitle>
      {semester.typeComponent.map(
        (typeComponent: any, typeComponentIndex: number) => (
          <ContainerComponent key={typeComponentIndex}>
            <TableRow>
              <TableRowHeader>Компонент:</TableRowHeader>
              <TitleValue>{typeComponent.nameControl}</TitleValue>
            </TableRow>
            {typeComponent.typeControl.map(
              (typeControl: any, typeControlIndex: number) => (
                <ContainerTypeControl
                  key={typeControlIndex}
                  shouldRenderBorder={typeControlIndex > 0}
                >
                  <TableRow>
                    <TableRowHeader>Контроль:</TableRowHeader>
                    <TitleValue>{typeControl.nameTypeControl}</TitleValue>
                  </TableRow>
                  {typeControl.disciplines.map(
                    (discipline: any, disciplineIndex: number) => {
                      const isLastDiscipline =
                        disciplineIndex === typeControl.disciplines.length - 1;
                      return (
                        <View key={disciplineIndex}>
                          <TableRow>
                            <TableRowHeader>Дисциплина:</TableRowHeader>
                            <TitleValue>{discipline.nameDiscipline}</TitleValue>
                          </TableRow>
                          <TableRow>
                            <TableRowHeader>Оценка:</TableRowHeader>
                            <TitleValue>{discipline.grade}</TitleValue>
                          </TableRow>
                          <TableRow isLast={isLastDiscipline}>
                            <TableRowHeader>Код компетенции:</TableRowHeader>
                            <TitleValue>
                              {discipline.listCompetencies
                                .map(
                                  (competency: any) => competency.competencyCode
                                )
                                .join(", ")}
                            </TitleValue>
                          </TableRow>
                        </View>
                      );
                    }
                  )}
                </ContainerTypeControl>
              )
            )}
          </ContainerComponent>
        )
      )}
    </SemesterContainer>
  );

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        {semesterGradesData === null ? (
          <CenteredContainer>
            <NoCreditBook>Нет зачетной книжки или оценок в ней</NoCreditBook>
          </CenteredContainer>
        ) : (
          <FlatList
            data={semesterGradesData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <CourseContainer key={index}>
                <CourseTitle onPress={() => toggleCollapsed(index)}>
                  {item.numberCourse} курс
                </CourseTitle>
                {collapsed[index] && (
                  <FlatList
                    data={item.semesters}
                    keyExtractor={(item, index) => index.toString()}
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
