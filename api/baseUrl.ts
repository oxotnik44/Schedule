import axios from "axios";

export const api = axios.create({
  //продакшен
//   baseURL: "http://83.234.107.43:5000/",
  //разработка
  baseURL: "http://26.129.173.168:5000/",
});
