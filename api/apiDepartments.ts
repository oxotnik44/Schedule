import axios from "axios";
import {
  resetDepartment,
  setDataDepartment,
} from "../redux/reducers/departmentsInfoReducer";

const api = axios.create({
  baseURL: "http://83.234.107.43:5000/"
});


export const getDepartments = async (dispatch: Function) => {
  try {
    const response = await api.get("/getDepartments");
    const data = response.data;
    console.log
    dispatch(resetDepartment());
    dispatch(setDataDepartment(data));
  } catch (error) {
    console.error("Error while adding review:", error);
  }
};
