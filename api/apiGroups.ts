import axios from "axios";

import {
  resetDataGroups,
  resetGroupsExtramuralists,
  resetGroupsResidents,
  setDataGroups,
  setDataGroupsExtramuralists,
  setDataGroupsResidents,
} from "../redux/reducers/groupsInfoReducer";
import { api } from "./baseUrl";



export const getGroupsResidents = async (
  idDepartment: number,
  dispatch: Function
) => {
  try {
    const response = await api.post("/getGroupsResidents", {
      id_dep: idDepartment,
    });
    const data = response.data;
    dispatch(resetGroupsResidents());
    dispatch(setDataGroupsResidents(data));
  } catch (error) {
    console.error("Error while adding review:", error);
  }
};

export const getGroupsExtramuralists = async (
  idDepartment: number,
  dispatch: Function
) => {
  try {
    const response = await api.post("/getGroupsExtramuralists", {
      id_dep: idDepartment,
    });
    const data = response.data;
    dispatch(resetGroupsExtramuralists());
    dispatch(setDataGroupsExtramuralists(data));
  } catch (error) {
    console.error("Error while adding review:", error);
  }
};

export const getGroups = async (dispatch: Function) => {
  try {
    const response = await api.get("/getGroups");
    const data = response.data;
    dispatch(resetDataGroups());
    dispatch(setDataGroups(data));
  } catch (error) {
    console.error("Error while adding review:", error);
  }
};
