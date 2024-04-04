import axios from "axios";

export const AuthOnLoad = async (token: string) => {
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
    console.log(data);
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
