export interface IScheduleInfo {
  idPair: number;
  comments: string;
  roomNumber: string;
  weekday: string;
  nameGroup: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string;
  weeks: string;
}
export interface IScheduleExtramuralInfo {
  idPair: number;
  weekday: string;
  comments: string;
  nameGroup: string;
  roomNumber: string | null;
  numberPair: string;
  typePair: string;
  namePair: string;
  roomName: string;
  typePairRetake: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string | null;
  weeks: string;
}
export interface ScheduleState {
  ScheduleInfoStudentSlice: {
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
      scheduleExtramural: {
        date: string;
        schedule: IScheduleExtramuralInfo[];
      }[];
      currentWeekNumber: string;
    };
    selectIdEducator: number;
    selectIdGroup: number;
    isExtramuralScheduleUntilToday: boolean;
  };
}
export interface ScheduleStateEducators {
  ScheduleInfoEducatorSlice: {
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
      scheduleExtramural: {
        date: string;
        schedule: IScheduleExtramuralInfo[];
      }[];
      currentWeekNumber: string;
    };
    selectIdEducator: number;
    isFullSchedule: boolean;
  };
}
export interface IScheduleExtramuralInfoEducators {
  idPair: number;
  idGroup: number;
  comments: string;
  groupName: string;
  roomNumber: string | null;
  roomName: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  date: string | null;
  typePairRetake: string | null;
}

export interface IScheduleInfoEducators {
  idPair: number;
  idGroup: number;
  groupName: string;
  comments: string;
  roomNumber: string;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;

  idEducator: number;
  nameEducator: string;
  nameDepartments: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string;
  weeks: string;
}
