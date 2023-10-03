import { Reducer } from "redux";

const SET_DATA_SCHEDULE_EDUCATOR = "SET_DATA_SCHEDULE_EDUCATOR";
const RESET_SCHEDULE_EDUCATOR = "RESET_SCHEDULE_EDUCATOR";
const SET_SELECT_ID_EDUCATOR = "SET_SELECT_ID_EDUCATOR";
const SET_TYPE_GROUP_EDUCATOR = "SET_TYPE_GROUP_EDUCATOR";
const SET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL = "SET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL";
const RESET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL = "RESET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL";
const SET_SELECT_ID_GROUP = "SET_SELECT_ID_GROUP";
const SET_IS_FULL_SCHEDULE_EDUCATOR = "SET_IS_FULL_SCHEDULE_EDUCATOR";

interface IScheduleInfo {
  idPair: number;
  roomNumber: string | null;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  nameDepartments: string;
  groupName: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string | null;
}

interface IScheduleExtramuralInfo {
  idPair: number;
  roomNumber: string | null;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  groupName: string;
  date: string | null;
}

interface IState {
  dataSchedule: {
    groupType: string;
    scheduleResident: {
      numerator: IScheduleInfo[];
      denominator: IScheduleInfo[];
    };
    scheduleExtramural: { date: string; schedule: IScheduleExtramuralInfo[] }[];
  };
  typeGroupEducator: string;
  selectIdEducator: number;
  selectIdGroup: number;
  isFullSchedule: boolean;
}

export const initialScheduleState: IState = {
  dataSchedule: {
    groupType: "resident",
    scheduleResident: {
      numerator: [],
      denominator: [],
    },
    scheduleExtramural: [],
  },
  typeGroupEducator: "",
  selectIdEducator: 0,
  selectIdGroup: 0,
  isFullSchedule: false,
};

const scheduleInfoEducatorReducer: Reducer<IState> = (
  state = initialScheduleState,
  action
) => {
  switch (action.type) {
    case SET_DATA_SCHEDULE_EDUCATOR:
      return {
        ...state,
        dataSchedule: action.dataSchedule,
      };

    case RESET_SCHEDULE_EDUCATOR:
      return {
        ...state,
        dataSchedule: {
          scheduleResident: {
            numerator: [],
            denominator: [],
          },
          scheduleExtramural: [],
        },
      };
    case SET_TYPE_GROUP_EDUCATOR:
      return {
        ...state,
        typeGroupEducator: action.typeGroup,
      };
    case SET_SELECT_ID_EDUCATOR:
      return {
        ...state,
        selectIdEducator: action.selectIdEducator,
      };
    case SET_SELECT_ID_GROUP:
      return {
        ...state,
        selectIdGroup: action.selectIdGroup,
      };
    case SET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL:
      return {
        ...state,
        dataSchedule: {
          scheduleResident: {
            numerator: state.dataSchedule.scheduleResident.numerator,
            denominator: state.dataSchedule.scheduleResident.denominator,
          },
          scheduleExtramural: action.dataScheduleExtramural,
        },
      };
    case RESET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL: {
      return {
        ...state,
        dataSchedule: {
          ...state.dataSchedule,
          scheduleExtramural: [],
        },
      };
    }
    case SET_IS_FULL_SCHEDULE_EDUCATOR:
      return {
        ...state,
        isFullSchedule: action.isFullSchedule,
      };
    default:
      return state;
  }
};

export const setDataScheduleEducator = (dataSchedule: IState) => ({
  type: SET_DATA_SCHEDULE_EDUCATOR,
  dataSchedule,
});

export const resetScheduleEducator = () => ({
  type: RESET_SCHEDULE_EDUCATOR,
});

export const setSelectIdEducator = (idEducator: number) => ({
  type: SET_SELECT_ID_EDUCATOR,
  selectIdEducator: idEducator,
});

export const setSelectIdGroupEducator = (idGroup: number) => ({
  type: SET_SELECT_ID_GROUP,
  selectIdGroup: idGroup,
});

export const resetDataScheduleEducatorExtramural = () => ({
  type: RESET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL,
});

export const setDataEducatorExtramural = (dataScheduleExtramural: IState) => ({
  type: SET_DATA_SCHEDULE_EDUCATOR_EXTRAMURAL,
  dataScheduleExtramural,
});

export const setIsFullScheduleEducator = (isFullSchedule: boolean) => ({
  type: SET_IS_FULL_SCHEDULE_EDUCATOR,
  isFullSchedule,
});

export default scheduleInfoEducatorReducer;
