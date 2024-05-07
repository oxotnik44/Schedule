import { createSlice } from "@reduxjs/toolkit";

interface iDepartmentInfo {
  idDepartment: number;
  nameDepartment: string;
  imgDepartment: string;
  fullnameDepartment: string;
}

interface IState {
  dataDepartment: iDepartmentInfo[];
  numberDepartment: number;
  selectNameDepartments: string;
  textSearchGroup: string;
  loading: boolean;
}

export const initialDepartmentState: IState = {
  dataDepartment: [],
  numberDepartment: 0,
  textSearchGroup: "",
  selectNameDepartments: "",
  loading: false,
};
export const DepartmentInfoSlice = createSlice({
  name: "Department",
  initialState: initialDepartmentState,
  reducers: {
    setDataDepartment: (state, action) => {
      state.dataDepartment = action.payload;
    },
    resetDepartment: (state) => {
      state.dataDepartment = [];
    },
    setNumberDepartment: (state, action) => {
      state.numberDepartment = action.payload;
    },
    setSelectNameDepartments: (state, action) => {
      state.selectNameDepartments = action.payload;
    },
    setTextSearchGroup: (state, action) => {
      state.textSearchGroup = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetTextSearchGroup: (state) => {
      state.textSearchGroup = "";
    },
  },
});
export const {
  setDataDepartment,
  resetDepartment,
  setNumberDepartment,
  setSelectNameDepartments,
  setTextSearchGroup,
  setLoading,
  resetTextSearchGroup,
} = DepartmentInfoSlice.actions;

export default DepartmentInfoSlice.reducer;
