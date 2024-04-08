import axios from "axios";
import { setProfileInfo } from "../redux/slices/ProfileInfoSlice";

export const AuthOnLoad = async (token: string, dispatch: Function) => {
  try {
    const response = await axios.post(
      "https://schedulemobilebackend.nspu.ru:3000/authOnLoad",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const data = response.data;
    console.log(data.lastname + " " + data.firstname + " " + data.middlename);
    dispatch(
      setProfileInfo(
        data.lastname + " " + data.firstname + " " + data.middlename
      )
    );
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
