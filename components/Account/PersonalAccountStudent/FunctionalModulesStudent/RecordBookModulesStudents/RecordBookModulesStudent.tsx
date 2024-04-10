import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import Collapsible from 'react-native-collapsible';
import {
  MainContainer,
  CourseContainer,
  CourseTitle,
  SemesterContainer,
  SemesterTitle,
  TableRow,
  TableCell,
  TableRowHeader,
} from "./RecordBookModulesStudentStyle";
import { getSemesterGrades } from "../../../../../api/apiUserStudent";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
interface Competency {
  competencyCode: string;
  competencyName: string;
}

interface Discipline {
  name: string;
  uid: string;
  grade: string;
  competencies: Competency[];
}

interface ControlType {
  name: string;
  disciplines: Discipline[];
}

interface Component {
  name: string;
  controlTypes: ControlType[];
}

interface ControlPeriod {
  name: string;
  numberPeriodControl: number;
  components: Component[];
}

interface Course {
  name: string;
  number: number;
  controlPeriods: ControlPeriod[];
}

interface SemesterGrades {
  SemesterGradesInfoSlice: {
    semesterGradesData: { [key: string]: Course };
  };
}

const RecordBookModulesStudent = () => {
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const semesterGradesData = useSelector((state: SemesterGrades) => state.SemesterGradesInfoSlice.semesterGradesData);
  const dispatch = useDispatch();
  
  useEffect(() => {
    getSemesterGrades(dispatch);
  }, [dispatch]);
  
  const [collapsed, setCollapsed] = useState<boolean[]>([]);

  useEffect(() => {
    // Преобразование объекта в массив курсов и инициализация collapsed на основе их количества
    const coursesArray = Object.values(semesterGradesData);
    if (coursesArray.length > 0) {
      setCollapsed(coursesArray.map(() => true));
    }
  }, [semesterGradesData]);

  const toggleCollapsed = (index: number) => {
    const newCollapsed = [...collapsed];
    newCollapsed[index] = !newCollapsed[index];
    setCollapsed(newCollapsed);
  };
  
    return (
      <ThemeProvider theme={theme}>
        <MainContainer>
          {Object.values(semesterGradesData).map((course, courseIndex) => (
            <CourseContainer key={courseIndex}>
              <CourseTitle onPress={() => toggleCollapsed(courseIndex)}>
                {course.name} - {course.number}
              </CourseTitle>
              <Collapsible collapsed={collapsed[courseIndex]}>
                {course.controlPeriods.map((period, periodIndex) => (
                  <SemesterContainer key={periodIndex}>
                    <SemesterTitle>{period.name}</SemesterTitle>
                    {period.components.flatMap((component) => 
                      component.controlTypes.flatMap((controlType) =>
                        controlType.disciplines.map((discipline, disciplineIndex) => (
                          <React.Fragment key={`discipline-${disciplineIndex}`}>
                            <TableRow>
                              <TableRowHeader>Компонент</TableRowHeader>
                              <TableCell>{component.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableRowHeader>Контроль</TableRowHeader>
                              <TableCell>{controlType.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableRowHeader>Дисциплина</TableRowHeader>
                              <TableCell>{discipline.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableRowHeader>Оценка</TableRowHeader>
                              <TableCell>{discipline.grade}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableRowHeader>Код компетенции</TableRowHeader>
                              <TableCell>{discipline.competencies.map(comp => comp.competencyCode).join(", ")}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))
                      )
                    )}
                  </SemesterContainer>
                ))}
              </Collapsible>
            </CourseContainer>
          ))}
        </MainContainer>
      </ThemeProvider>
    );
  };

  export default RecordBookModulesStudent
