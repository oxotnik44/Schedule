import axios from "axios";
import {
  resetEducator,
  setDataEducator,
} from "../redux/slices/EducatorSlice";
import { api } from "./baseUrl";




export const getEducator = async (dispatch: Function) => {
  try {
    const response = await api.get("/getEducator");
    const data = response.data;
    dispatch(resetEducator());
    dispatch(setDataEducator(data));
  } catch (error) {
    console.error("Ошибка при получении данных об образователе:", error);
  }
};


