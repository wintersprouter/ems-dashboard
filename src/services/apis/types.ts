import { z } from "zod";

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
  FactoryNotFound = 1008,
  IoTDeviceNotFound = 1009,
  SmartMeterNotFound = 1010,
  DataNotFound = 1011,
  WSActionNotFound = 1100,
}

export const signInParamsSchema = z.object({
  email: z.string().trim().email().min(5),
  password: z.string().min(8),
});
