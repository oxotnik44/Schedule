import { createSlice } from "@reduxjs/toolkit";

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
  weeks: string | null;
}

interface IScheduleExtramuralInfo {
  idPair: number;
  roomNumber: string | null;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  roomName: string;
  idEducator: number;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  groupName: string;
  date: string | null;
  typePairRetake: string;
}

interface IState {
  randomNumber: number;

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
    currentWeekNumber: string;
  };
  typeGroupEducator: string;
  selectIdEducator: number;
  selectIdGroup: number;
  isFullSchedule: boolean;
}

export const initialScheduleState: IState = {
  randomNumber: 0,

  dataSchedule: {
    lastCacheEntry: {
      currentDateCache: "",
      currentTimeCache: "",
    },
    groupType: "resident",
    extramuralIsActive: false,
    scheduleResident: {
      weekCorrection: 0,
      numerator: [],
      denominator: [],
      session: [],
    },
    scheduleExtramural: [],
    currentWeekNumber: "",
  },
  typeGroupEducator: "",
  selectIdEducator: 0,
  selectIdGroup: 0,
  isFullSchedule: false,
};
export const ScheduleInfoEducatorSlice = createSlice({
  name: "ScheduleInfoEducator",
  initialState: initialScheduleState,
  reducers: {
    setDataScheduleEducator: (state, action) => {
      state.dataSchedule = action.payload;
      state.randomNumber = Math.floor(Math.random() * 1000001); // Генерируем число от 0 до 100000
    },
    resetScheduleEducator: (state) => {
      state.dataSchedule.scheduleResident = {
        weekCorrection: 0,
        numerator: [],
        denominator: [],
        session: [],
      };
      state.dataSchedule.scheduleExtramural = [];
    },
    setSelectIdEducator: (state, action) => {
      state.selectIdEducator = action.payload;
    },
    setSelectIdGroupEducator: (state, action) => {
      state.selectIdGroup = action.payload;
    },
    resetDataScheduleEducatorExtramural: (state) => {
      state.dataSchedule.scheduleExtramural = [];
    },
    setDataEducatorExtramural: (state, action) => {
      state.dataSchedule.scheduleExtramural = action.payload;
    },
    setIsFullScheduleEducator: (state, action) => {
      state.isFullSchedule = action.payload;
    },
    setLastCacheEntryEducator: (state, action) => {
      state.dataSchedule.lastCacheEntry = action.payload;
    },
    setCurrentWeekNumberEducator: (state, action) => {
      state.dataSchedule.currentWeekNumber = action.payload;
    },
  },
});
export const {
  setDataScheduleEducator,
  resetScheduleEducator,
  setSelectIdEducator,
  setSelectIdGroupEducator,
  resetDataScheduleEducatorExtramural,
  setDataEducatorExtramural,
  setIsFullScheduleEducator,
  setLastCacheEntryEducator,
  setCurrentWeekNumberEducator,
} = ScheduleInfoEducatorSlice.actions;
export default ScheduleInfoEducatorSlice.reducer;
