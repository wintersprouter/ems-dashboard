import { Zodios } from "@zodios/core";
import { z } from "zod";
import { userApi } from "./user";
export const basicRequestParamsSchema = z.object({
  email: z.string().trim().email().min(5),
  action: z.string(),
  token: z.string(),
});
export enum StatusCode {
  OK = 200,
  EMailOrPasswordError = 1002,
  TokenExpired = 1007,
  EMailCodeError = 1006,
  EMailAlreadRegistered = 1005,
  OTPCodeError = 1004,
  PhoneAlreadyExisted = 1003,
  UserNotFound = 1001,
  UserAlreadyExisted = 1000,
  Fail = 201,
}
const baseUrl = "https://epoweros.greenwiz.com.tw:32443/api";

export const Api = new Zodios(baseUrl, [...userApi]);
