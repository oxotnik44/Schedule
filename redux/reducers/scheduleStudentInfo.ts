import { Reducer } from "redux";

const SET_DATA_SCHEDULE_STUDENT = "SET_DATA_SCHEDULE_STUDENT";
const RESET_SCHEDULE_STUDENT = "RESET_SCHEDULE_STUDENT";
const SET_TYPE_GROUP_STUDENT = "SET_TYPE_GROUP_STUDENT";
const SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL =
  "SET_DATA_SCHEDULE_STUDENT_EXTRAMURAL";
const RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL =
  "RESET_DATA_SCHEDULE_STUDENT_EXTRAMURAL";
const SET_SELECT_ID_GROUP = "SET_SELECT_ID_GROUP";
const SET_IS_FULL_SCHEDULE_STUDENT = "SET_IS_FULL_SCHEDULE_STUDENT";
const SET_LAST_CACHE_ENTRY_STUDENT = "SET_LAST_CACHE_ENTRY_STUDENT";
const SET_EXTRAMURAL_IS_ACTIVE = "SET_EXTRAMURAL_IS_ACTIVE";
interface IScheduleInfo {
  idPair: number;
  roomNumber: string | null;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  nameDepartments: string;
  groupName: string;
  nameGroup: string;
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
  roomName: string;
  nameGroup: string;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  groupName: string;
  date: string | null;
  typePairRetake: string;
}
interface IState {
  dataSchedule: {
    lastCacheEntry: {
      currentDateCache: string;
      currentTimeCache: string;
    };
    groupType: string;
    extramuralIsActive: boolean;
    scheduleResident: {
      weekCorrection: number;
      numerator: IScheduleInfo[];
      denominator: IScheduleInfo[];
      session: {
        date: string;
        schedule: IScheduleExtramuralInfo[];
      }[];
    };
    scheduleExtramural: { date: string; schedule: IScheduleExtramuralInfo[] }[];
  };
  typeGroupStudent: string;
  selectIdGroup: number;
  isExtramuralScheduleUntilToday: boolean;
}

export const initialScheduleState: IState = {
  dataSchedule: {
    lastCacheEntry: {
      currentDateCache: "",
      currentTimeCache: "",
    },
    groupType: "",
    extramuralIsActive: false,
    scheduleResident: {
      weekCorrection: 1,
      numerator: [],
      denominator: [],
      session: [],
    },
    scheduleExtramural: [],
  },
  typeGroupStudent: "",
  selectIdGroup: 0,
  isExtramuralScheduleUntilToday: false,
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
            session: [],
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
          ...state.dataSchedule,
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
        isExtramuralScheduleUntilToday: action.isExtramuralScheduleUntilToday,
      };
    case SET_LAST_CACHE_ENTRY_STUDENT:
      return {
        ...state,
        dataSchedule: {
          ...state.dataSchedule,
          lastCacheEntry: action.lastCacheEntryStudent,
        },
      };
    case SET_EXTRAMURAL_IS_ACTIVE:
      return {
        ...state,
        dataSchedule: {
          ...state.dataSchedule,
          extramuralIsActive: action.extramuralIsActive,
        },
      };
    default:
      return state;
  }
};

export const setDataScheduleStudent = (dataSchedule: IState) => ({
  type: SET_DATA_SCHEDULE_STUDENT,
  dataSchedule,
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
export const setIsExtramuralScheduleUntilTodayStudent = (
  isExtramuralScheduleUntilToday: boolean
) => ({
  type: SET_IS_FULL_SCHEDULE_STUDENT,
  isExtramuralScheduleUntilToday,
});
export const setLastCacheEntryStudent = (lastCacheEntryStudent: any) => ({
  type: SET_LAST_CACHE_ENTRY_STUDENT,
  lastCacheEntryStudent,
});
export const setExtramuralIsActive = (extramuralIsActive: boolean) => ({
  type: SET_EXTRAMURAL_IS_ACTIVE,
  extramuralIsActive,
})
export default scheduleInfoStudentReducer;
