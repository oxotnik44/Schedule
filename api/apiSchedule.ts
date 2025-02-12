import axios from "axios";
import {
  resetDataScheduleStudentExtramural,
  resetScheduleStudent,
  setDataScheduleStudent,
  setDataStudentExtramural,
  setExtramuralIsActive,
} from "../redux/slices/ScheduleStudentInfoSlice";
import {
  resetDataScheduleEducatorExtramural,
  resetScheduleEducator,
  setDataEducatorExtramural,
  setDataScheduleEducator,
} from "../redux/slices/ScheduleEducatorInfoSlice";
import { api } from "./baseUrl";

export const getSchedule = async (
  idGroup: number,
  dispatch: Function,
  nameGroup: string,
  isNotification: boolean
) => {
  try {
    const response = await api.post("/getScheduleStudent", {
      id_group: idGroup,
      name: nameGroup,
    });
    const data = response.data;
    dispatch(resetScheduleStudent());
    dispatch(setDataScheduleStudent(data));
    if (isNotification) {
      return data;
    }
  } catch (error) {
    console.error("Error while getting schedule:", error);
  }
};
export const getScheduleStudentByWeek = async (
  idGroup: number,
  dispatch: Function,
  nameGroup: string,
  isNotification: boolean,
  currentWeek: number,
  currentWeekNumber: number
) => {
  try {
    const response = await api.post("/getScheduleStudentByWeek", {
      id_group: idGroup,
      name: nameGroup,
      currentWeek: currentWeek,
      currentWeekNumber: currentWeekNumber,
    });
    const data = response.data;
    dispatch(resetScheduleStudent());
    dispatch(setDataScheduleStudent(data));
    if (isNotification) {
      return data;
    }
  } catch (error) {
    console.error("Error while getting schedule:", error);
  }
};
export const getScheduleEducatorByWeek = async (
  idEducator: number,
  dispatch: Function,
  nameEducator: string,
  isNotification: boolean,
  currentWeek: number,
  currentWeekNumber: number
) => {
  try {
    const response = await api.post("/getScheduleEducatorByWeek", {
      id_prep: idEducator,
      name: nameEducator,
      currentWeek: currentWeek,
      currentWeekNumber: currentWeekNumber,
    });
    const data = response.data;
    dispatch(resetScheduleEducator());
    dispatch(setDataScheduleEducator(data));
    if (isNotification) {
      return data;
    }
  } catch (error) {
    console.error("Error while getting schedule:", error);
  }
};
export const getScheduleEducator = async (
  dispatch: Function,
  idEducator: number
) => {
  try {
    const responce = await api.post("/getScheduleEducator", {
      id_prep: idEducator,
    });
    const data = responce.data;
    dispatch(resetScheduleEducator());
    dispatch(setDataScheduleEducator(data));
  } catch (error) {
    dispatch(resetScheduleEducator());
    console.error("Error while getting educatorSchedule:", error);
  }
};

export const getFullScheduleStudentExtramuralist = async (
  dispatch: Function,
  idGroup: number
) => {
  try {
    const responce = await api.post("/getFullScheduleStudentExtramuralist", {
      id_group: idGroup,
    });
    const data = responce.data;
    dispatch(resetDataScheduleStudentExtramural());
    dispatch(setDataStudentExtramural(data));
  } catch (error) {
    console.error("Error while getting scheduleExtramural:", error);
  }
};

export const getFullScheduleEducatorExtramural = async (
  dispatch: Function,
  idEducator: number
) => {
  try {
    const responce = await api.post("/getFullScheduleEducatorExtramural", {
      id_prep: idEducator,
    });
    const data = responce.data;
    dispatch(resetDataScheduleEducatorExtramural());
    dispatch(setDataEducatorExtramural(data));
  } catch (error) {
    console.error("Error while getting scheduleExtramural:", error);
  }
};
// export const getIsActive = async (dispatch: Function, idGroup: number) => {
//   try {
//     const responce = await api.post("/getIsActive", {
//       id_group: idGroup,
//     });
//     const data = responce.data;
//     dispatch(setExtramuralIsActive(data));
//   } catch (error) {
//     console.error("Error while getting scheduleExtramural:", error);
//   }
// };
