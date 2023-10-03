import { Reducer } from "redux";

const SET_DATA_DEPARTMENT = "SET_DATA_DEPARTMENT";
const RESET_DEPARTMENT = "RESET_DEPARTMENT";
const SET_NUMBER_DEPARTMENT = "SET_NUMBER_DEPARTMENT";
const SET_TEXT_SEARCH_GROUP = "SET_TEXT_SEARCH_GROUP";
const SET_LOADING = "SET_LOADING";
const RESET_TEXT_SEARCH_GROUP = "RESET_TEXT_SEARCH_GROUP";
const SET_SELECT_NAME_DEPARTMENTS = "SET_SELECT_NAME_DEPARTMENTS";
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

const departmentInfoReducer: Reducer<IState> = (
  state = initialDepartmentState,
  action
) => {
  switch (action.type) {
    case SET_DATA_DEPARTMENT:
      return {
        ...state,
        dataDepartment: [...state.dataDepartment, ...action.dataDepartment],
      };

    case RESET_DEPARTMENT:
      return {
        ...state,
        dataDepartment: [],
      };
    case SET_SELECT_NAME_DEPARTMENTS:
      return {
        ...state,
        selectNameDepartments: action.selectNameDepartments,
      };
    case SET_NUMBER_DEPARTMENT:
      return {
        ...state,
        numberDepartment: action.numberDepartment,
      };

    case SET_TEXT_SEARCH_GROUP:
      return {
        ...state,
        textSearchGroup: action.textSearchGroup,
      };
    case RESET_TEXT_SEARCH_GROUP:
      return {
        ...state,
        textSearchGroup: "",
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };

    default:
      return state;
  }
};

export const setDataDepartment = (data: iDepartmentInfo[]) => ({
  type: SET_DATA_DEPARTMENT,
  dataDepartment: data,
});
export const setSelectNameDepartments = (selectNameDepartments: string) => ({
  type: SET_SELECT_NAME_DEPARTMENTS,
  selectNameDepartments,
});
export const resetDepartment = () => ({
  type: RESET_DEPARTMENT,
});

export const setNumberDepartment = (number: number) => ({
  type: SET_NUMBER_DEPARTMENT,
  numberDepartment: number,
});

export const setTextSearchGroup = (text: string) => ({
  type: SET_TEXT_SEARCH_GROUP,
  textSearchGroup: text,
});
export const resetTextSearchGroup = () => ({
  type: RESET_TEXT_SEARCH_GROUP,
});
export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  loading,
});

export default departmentInfoReducer;
