import axios, { AxiosError,AxiosResponse } from "axios";

// export const baseURL="http://103.165.118.71:8087"
export const baseURL="http://localhost:8087"
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response:AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe token expired?");
      // Optionally redirect to login or show modal 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
