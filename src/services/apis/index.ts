import { Zodios } from "@zodios/core";
import { userApi } from "./user";
import { webApi } from "./web";

const baseUrl = "https://epoweros.greenwiz.com.tw:32443/api";

export const Api = new Zodios(baseUrl, [...userApi, ...webApi]);
