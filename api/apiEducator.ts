import axios from "axios";
import {
  resetEducator,
  setDataEducator,
} from "../redux/reducers/educatorReducer";

const api = axios.create({
  baseURL: "http://83.234.107.43:5000/"

});
// const api = axios.create({
//   baseURL: "https://schedulebackend-oxotnik44.onrender.com"

// });

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


