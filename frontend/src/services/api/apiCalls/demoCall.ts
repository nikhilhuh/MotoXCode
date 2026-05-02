import { axiosInstance } from "../../axiosInstance";
import { apiErrorHandler } from "../apiErrorHandling";

export const demoAPICall = async () => {
  try {
    const response = await axiosInstance.post("/test");
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
