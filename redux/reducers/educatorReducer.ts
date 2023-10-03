import { Reducer } from "redux";

const SET_DATA_EDUCATOR = "SET_DATA_EDUCATOR";
const RESET_EDUCATOR = "RESET_EDUCATOR";
const SET_SELECT_NAME_EDUCATOR = "SET_SELECT_NAME_EDUCATOR";
const SET_LOADING = "SET_LOADING";
const SET_TEXT_SEARCH_EDUCATOR = "SET_TEXT_SEARCH_EDUCATOR";
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

const educatorInfoReducer: Reducer<IState> = (
  state = initialEducatorState,
  action
) => {
  switch (action.type) {
    case SET_DATA_EDUCATOR:
      return {
        ...state,
        dataEducator: [...state.dataEducator, ...action.dataEducator],
      };

    case RESET_EDUCATOR:
      return {
        ...state,
        dataEducator: [],
      };

    case SET_SELECT_NAME_EDUCATOR:
      return {
        ...state,
        selectNameEducator: action.selectNameEducator,
      };

    case SET_TEXT_SEARCH_EDUCATOR:
      return {
        ...state,
        textSearchEducator: action.textSearchEducator,
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

export const setDataEducator = (data: iEducatorInfo[]) => ({
  type: SET_DATA_EDUCATOR,
  dataEducator: data,
});

export const resetEducator = () => ({
  type: RESET_EDUCATOR,
});

export const setNameEducator = (nameEducator: string) => ({
  type: SET_SELECT_NAME_EDUCATOR,
  selectNameEducator: nameEducator,
});

export const setTextSearchEducator = (text: string) => ({
  type: SET_TEXT_SEARCH_EDUCATOR,
  textSearchEducator: text,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  loading,
});

export default educatorInfoReducer;
