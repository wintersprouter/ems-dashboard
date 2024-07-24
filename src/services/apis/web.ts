import { makeApi } from "@zodios/core";
import { z } from "zod";
import { basicRequestParamsSchema, StatusCode } from "./types";

const realtimeSmartMeterInfoSchema = z.object({
  chAVoltage: z.number(),
  chACurrent: z.number(),
  chAUsageKW: z.number(),
  chBVoltage: z.number(),
  chBCurrent: z.number(),
  chBUsageKW: z.number(),
  chCVoltage: z.number(),
  chCCurrent: z.number(),
  chCUsageKW: z.number(),
});

const currentAverageUsageSchema = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number(),
});

const monitorDeviceUsageListSchema = z.array(z.object({}));

const overviewResponse = z.object({
  mainDeviceId: z.number(),
  realtimeSmartMeterInfo: realtimeSmartMeterInfoSchema,
  currentAverageUsage: currentAverageUsageSchema,
  totalUsageKW: z.number(),
  monitorDeviceCount: z.number(),
  monitorPeriodMinute: z.number(),
  monitorDeviceUsageList: monitorDeviceUsageListSchema,
  email: z.string().email(),
  username: z.string(),
  action: z.string(),
  token: z.null(),
  dtTokenExpire: z.string(),
  statusCode: z.nativeEnum(StatusCode),
});

export const webApi = makeApi([
  {
    method: "post",
    path: "/Web/Overview",
    alias: "overview",
    description: "get overview data",
    response: overviewResponse,
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: basicRequestParamsSchema,
      },
    ],
  },
]);
