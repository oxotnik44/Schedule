import { Reducer } from "redux";
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
  nameGroup: string;
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
      allTypeWeeks: string[][];
    };
    scheduleExtramural: { date: string; schedule: IScheduleExtramuralInfo[] }[];
    currentWeekNumber: string;
  };
  typeGroupStudent: string;
  selectIdGroup: number;
  isExtramuralScheduleUntilToday: boolean;
}

export const initialScheduleState: IState = {
  randomNumber: 0,
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
      allTypeWeeks: [],
    },
    scheduleExtramural: [],
    currentWeekNumber: "",
  },
  typeGroupStudent: "",
  selectIdGroup: 0,
  isExtramuralScheduleUntilToday: false,
};
export const ScheduleInfoStudentSlice = createSlice({
  name: "ScheduleInfoStudentSlice",
  initialState: initialScheduleState,
  reducers: {
    setDataScheduleStudent: (state, action) => {
      state.dataSchedule = action.payload;
      state.randomNumber = Math.floor(Math.random() * 1000001); // Генерируем число от 0 до 100000
    },

    resetScheduleStudent: (state) => {
      state.dataSchedule.scheduleResident = {
        weekCorrection: 0,
        numerator: [],
        denominator: [],
        session: [],
        allTypeWeeks: [],
      };
      state.dataSchedule.scheduleExtramural = [];
    },
    setSelectIdGroup: (state, action) => {
      state.selectIdGroup = action.payload;
    },
    setTypeGroupStudent: (state, action) => {
      state.typeGroupStudent = action.payload;
    },
    resetDataScheduleStudentExtramural: (state) => {
      state.dataSchedule.scheduleExtramural = [];
    },
    setDataStudentExtramural: (state, action) => {
      state.dataSchedule.scheduleExtramural = action.payload;
    },
    setIsExtramuralScheduleUntilTodayStudent: (state, action) => {
      state.isExtramuralScheduleUntilToday = action.payload;
    },
    setLastCacheEntryStudent: (state, action) => {
      state.dataSchedule.lastCacheEntry = action.payload;
    },
    setExtramuralIsActive: (state, action) => {
      state.dataSchedule.extramuralIsActive = action.payload;
    },
    setCurrentWeekNumberStudent: (state, action) => {
      state.dataSchedule.currentWeekNumber = action.payload;
    },
  },
});

export const {
  setDataScheduleStudent,
  resetScheduleStudent,
  setSelectIdGroup,
  setTypeGroupStudent,
  resetDataScheduleStudentExtramural,
  setDataStudentExtramural,
  setIsExtramuralScheduleUntilTodayStudent,
  setLastCacheEntryStudent,
  setExtramuralIsActive,
  setCurrentWeekNumberStudent,
} = ScheduleInfoStudentSlice.actions;

export default ScheduleInfoStudentSlice.reducer;
