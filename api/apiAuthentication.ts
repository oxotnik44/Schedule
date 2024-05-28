import axios from "axios";
import { setProfileInfo } from "../redux/slices/AccountSlices/ProfileInfoSlice";
interface ProfileState {
  login: string;
  fullName: string;
  numberGroup: string;
  email: string;
  gradeBook: string;
}
interface IState {
  personalDataStudent: ProfileState;
}
export const AuthOnLoad = async (
  token: string,
  dispatch: Function,
  personalDataStudent: IState
) => {
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
    if (response.status === 200) {
      dispatch(setProfileInfo(personalDataStudent));
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
