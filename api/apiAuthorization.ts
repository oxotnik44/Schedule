import { setAuthTokenStorage } from "../Storage/AuthTokenStorage";
import { api } from "./baseUrl";

export const authorization = async () => {
    try {
        const response = await api.get("/authorization");
        const data = response.data;
        setAuthTokenStorage(data)
        console.log(data)
    } catch (error) {
        console.error("Error while adding review:", error);
    }
};
