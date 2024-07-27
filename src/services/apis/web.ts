import { makeApi } from "@zodios/core";
import { z } from "zod";
import { basicRequestParamsSchema, StatusCode } from "./types";

const realtimeSmartMeterInfoSchema = z.object({
  usedChannel: z.array(z.boolean()),
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

const averagePowerUsageSchema = z.object({
  dayUsageKHW: z.number(),
  dayCO2Saving: z.number(),
  monthUsageKHW: z.number(),
  monthCO2Saving: z.number(),
  yearUsageKHW: z.number(),
  yearCO2Saving: z.number(),
});

const monitorDeviceUsageListSchema = z.object({
  "0": z.array(z.number()),
  "1": z.array(z.number()),
  "2": z.array(z.number()),
});

const deviceUsageSchema = z.object({
  id: z.number(),
  name: z.string(),
  usage: z.array(z.number()),
});
const deviceUsageListSchema = z.object({
  "0": deviceUsageSchema,
  "1": deviceUsageSchema,
  "2": deviceUsageSchema,
});

export const overviewResponse = z.object({
  mainDeviceId: z.number(),
  realtimeSmartMeterInfo: realtimeSmartMeterInfoSchema,
  averagePowerUsage: averagePowerUsageSchema,
  totalUsageKW: z.number(),
  monitorDeviceCount: z.number(),
  monitorPeriodMinute: z.number(),
  monitorDeviceUsageList: monitorDeviceUsageListSchema,
  deviceUsageList: deviceUsageListSchema,
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
