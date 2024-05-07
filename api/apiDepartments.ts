
import { resetDepartment, setDataDepartment } from "../redux/slices/DepartmentsInfoSlice";
import { api } from "./baseUrl";

export const getDepartments = async (dispatch: Function) => {
  try {
    const response = await api.get("/getDepartments");
    const data = response.data;
    console.log;
    dispatch(resetDepartment());
    dispatch(setDataDepartment(data));
  } catch (error) {
    console.error("Error while adding review:", error);
  }
};
