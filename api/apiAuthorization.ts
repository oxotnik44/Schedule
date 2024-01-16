import { api } from "./baseUrl";

export const authorization = async (dispatch: Function, login: string, password: string) => {
    try {
        const response = await api.post("/authorization", { login, password });
        const data = response.data;
        console.log(data)
    } catch (error) {
        console.error("Error while adding review:", error);
    }
};
