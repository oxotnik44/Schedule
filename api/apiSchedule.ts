import axios from "axios";
import {
  resetDataScheduleStudentExtramural,
  resetScheduleStudent,
  setDataScheduleStudent,
  setDataStudentExtramural,
} from "../redux/reducers/scheduleStudentInfo";
import { resetDataScheduleEducatorExtramural, resetScheduleEducator, setDataEducatorExtramural, setDataScheduleEducator } from "../redux/reducers/scheduleEducatorInfo";

const api = axios.create({
  baseURL: "http://83.234.107.43:5000/",
});

export const getSchedule = async (idGroup: number, dispatch: Function) => {
  try {
    const response = await api.post("/getScheduleStudent", {
      id_group: idGroup,
    });
    const data = response.data;
    dispatch(resetScheduleStudent());
    dispatch(setDataScheduleStudent(data));
  } catch (error) {
    console.error("Error while getting schedule:", error);
  }
};

export const getScheduleEducator = async (
  dispatch: Function,
  idEducator: number
) => {
  try {
    console.log(idEducator)
    const responce = await api.post("/getScheduleEducator", {
      id_prep: idEducator,
    });
    const data = responce.data;

    dispatch(resetScheduleEducator());
    dispatch(setDataScheduleEducator(data));
  } catch (error) {
    console.error("Error while getting groups:", error);
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