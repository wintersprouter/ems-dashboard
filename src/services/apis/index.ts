import { Zodios } from "@zodios/core";
import { AuthProvider } from "../../context/authProvider";
import { userApi } from "./user";
import { webApi } from "./web";

const baseUrl = "https://epoweros.greenwiz.com.tw:32443/api";

export const Api = new Zodios(baseUrl, [...userApi, ...webApi]);

Api.axios.interceptors.response.use(
  (response) => {
    if (response.data.statusCode === 1007) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      AuthProvider.isAuthenticated = false;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
