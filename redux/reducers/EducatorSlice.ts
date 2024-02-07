import { createSlice } from "@reduxjs/toolkit";

interface iEducatorInfo {
  idEducator: number;
  nameEducator: string;
  regaliaEducator: string;
}

interface IState {
  dataEducator: iEducatorInfo[];
  selectNameEducator: string;
  textSearchEducator: string;
  loading: boolean;
  typeGroup: string;
}

export const initialEducatorState: IState = {
  dataEducator: [],
  selectNameEducator: "",
  textSearchEducator: "",
  loading: false,
  typeGroup: "",
};
export const EducatorInfoSlice = createSlice({
  name: "Educator",
  initialState: initialEducatorState,
  reducers: {
    setDataEducator: (state, action) => {
      state.dataEducator = action.payload;
    },
    resetEducator: (state, action) => {
      state.dataEducator = [];
    },
    setNameEducator: (state, action) => {
      state.selectNameEducator = action.payload;
    },

    setTextSearchEducator: (state, action) => {
      state.textSearchEducator = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setDataEducator,
  resetEducator,
  setNameEducator,
  setTextSearchEducator,
  setLoading,
} = EducatorInfoSlice.actions;

export default EducatorInfoSlice.reducer;
