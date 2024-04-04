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
  courseData: { [key: string]: Course };
}

export const initialState: IState = {
  courseData: {},
};

const aSlice = createSlice({
  name: "a",
  initialState,
  reducers: {
    // Редуктор для установки курсов
    setCourses(state, action: PayloadAction<{ [key: string]: Course }>) {
      state.courseData = action.payload;
    },
  },
});

// Экспорт экшенов (действий) и редуктора
export const { setCourses } = aSlice.actions;
export default aSlice.reducer;
