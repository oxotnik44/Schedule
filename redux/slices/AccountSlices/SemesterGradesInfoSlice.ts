import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface ISemesterGrades {
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
}

export const initialState: ISemesterGrades = {
  dataSemesterGrades: [
    {
      numberCourse: 0,
      nameCourse: "",
      semesters: []
    }
  ]
};


const SemesterGradesInfoSlice = createSlice({
  name: "Grades",
  initialState,
  reducers: {
    // Редуктор для установки курсов
    setSessionGrades(state, action) {
      state.dataSemesterGrades = action.payload;
    },
  },
});

// Экспорт экшенов (действий) и редуктора
export const { setSessionGrades } = SemesterGradesInfoSlice.actions;
export default SemesterGradesInfoSlice.reducer;
