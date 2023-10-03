import { Reducer } from "redux";

const SET_DATA_SCHEDULE_STUDENT = "SET_DATA_SCHEDULE_STUDENT";
const RESET_SCHEDULE_STUDENT = "RESET_SCHEDULE_STUDENT";
const SET_TYPE_GROUP_STUDENT = "SET_TYPE_GROUP_STUDENT";
const SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL = "SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL";
const RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL = "RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL";
const SET_SELECT_ID_GROUP = "SET_SELECT_ID_GROUP";
const SET_IS_FULL_SCHEDULE_STUDENT = "SET_IS_FULL_SCHEDULE_STUDENT";
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
  typeGroupStudent: string;
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
  typeGroupStudent: "",
  selectIdGroup: 0,
  isFullSchedule: false,
};

const scheduleInfoStudentReducer: Reducer<IState> = (
  state = initialScheduleState,
  action
) => {
  switch (action.type) {
    case SET_DATA_SCHEDULE_STUDENT:
      return {
        ...state,
        dataSchedule: action.dataSchedule,
      };

    case RESET_SCHEDULE_STUDENT:
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
    case SET_TYPE_GROUP_STUDENT:
      return {
        ...state,
        typeGroup: action.typeGroup,
      };
   
    case SET_SELECT_ID_GROUP:
      return {
        ...state,
        selectIdGroup: action.selectIdGroup,
      };
    case SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL:
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
    case RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL: {
      return {
        ...state,
        dataSchedule: {
          ...state.dataSchedule,
          scheduleExtramural: [],
        },
      };
    }
    case SET_IS_FULL_SCHEDULE_STUDENT:
      return {
        ...state,
        isFullSchedule: action.isFullSchedule,
      };
    default:
      return state;
  }
};

export const setDataScheduleStudent = (dataSchedule: IState) => ({
  type: SET_DATA_SCHEDULE_STUDENT,
  dataSchedule,
});
export const setTypeGroup = (type: string) => ({
  type: SET_TYPE_GROUP_STUDENT,
  typeGroup: type,
});
export const resetScheduleStudent = () => ({
  type: RESET_SCHEDULE_STUDENT,
});

export const setSelectIdGroup = (idGroup: number) => ({
  type: SET_SELECT_ID_GROUP,
  selectIdGroup: idGroup,
});
export const setTypeGroupStudent = (type: string) => ({
  type: SET_TYPE_GROUP_STUDENT,
  typeGroupStudent: type,
});
export const resetDataScheduleStudentExtramural = () => ({
  type: RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL,
});
export const setDataStudentExtramural = (dataScheduleExtramural: IState) => ({
  type: SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL,
  dataScheduleExtramural,
});
export const setIsFullScheduleStudent = (isFullSchedule: boolean) => ({
  type: SET_IS_FULL_SCHEDULE_STUDENT,
  isFullSchedule,
});
export default scheduleInfoStudentReducer;
