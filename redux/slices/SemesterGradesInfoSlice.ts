import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определение интерфейсов Discipline, ControlType, Component, Period и Course
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

interface IState {
  semesterGradesData: { [key: string]: Course };
}

export const initialState: IState = {
  semesterGradesData: {},
};

const SemesterGradesInfoSlice = createSlice({
  name: "Grades",
  initialState,
  reducers: {
    // Редуктор для установки курсов
    setSessionGrades(state, action) {
      state.semesterGradesData = action.payload;
    },
  },
});

// Экспорт экшенов (действий) и редуктора
export const { setSessionGrades } = SemesterGradesInfoSlice.actions;
export default SemesterGradesInfoSlice.reducer;
