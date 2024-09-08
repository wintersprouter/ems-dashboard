import { makeApi } from "@zodios/core";
import { z } from "zod";
import { basicRequestParamsSchema, StatusCode } from "./types";

export const realtimeSmartMeterInfoSchema = z.object({
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
  dayUsageKWH: z.number(),
  dayCO2SavingKG: z.number(),
  monthUsageKWH: z.number(),
  monthCO2SavingKG: z.number(),
  yearUsageKWH: z.number(),
  yearCO2SavingKG: z.number(),
});

export const deviceUsageSchema = z.object({
  id: z.number(),
  name: z.string(),
  usage: z.array(z.number()),
  listPowerAverageKW: z.array(z.number()),
  listPowerMaxKW: z.array(z.number()),
  monitorPeriodMinute: z.number(),
});

const deviceUsageListSchema = z.array(deviceUsageSchema);
export const overviewResponse = z.object({
  mainDeviceId: z.number(),
  realtimeSmartMeterInfo: realtimeSmartMeterInfoSchema,
  averagePowerUsage: averagePowerUsageSchema,
  totalUsageKW: z.number(),
  monitorDeviceCount: z.number(),
  monitorPeriodMinute: z.number(),
  deviceUsageList: deviceUsageListSchema.nullable(),
  email: z.string().email(),
  username: z.string(),
  action: z.string(),
  token: z.string(),
  dtTokenExpire: z.string(),
  statusCode: z.nativeEnum(StatusCode),
  mainDeviceUsage: deviceUsageSchema,
  id: z.number(),
  name: z.string(),
  listPowerMaxKW: z.array(z.number()).nullable(),
  listPowerAverageKW: z.array(z.number()).nullable(),
});

const monitorDeviceRequestParamsSchema = z.object({
  email: z.string().email(),
  action: z.string(),
  token: z.string(),
  factoryId: z.number(),
  deviceId: z.number(),
  dtStart: z.string(),
  dtEnd: z.string(),
});

const deviceSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const monitorDeviceResponse = z.object({
  email: z.string().email(),
  username: z.string(),
  action: z.string(),
  token: z.string().nullable(),
  dtTokenExpire: z.string(),
  statusCode: z.nativeEnum(StatusCode),
  factoryId: z.number(),
  factoryName: z.string(),
  deviceList: z.array(deviceSchema).nullable(),
  deviceUsageInfo: z
    .object({
      id: z.number(),
      name: z.string(),
      dtStart: z.string(),
      dtEnd: z.string().nullable(),
      dtBuilt: z.string(),
      side: z.string(),
      ct: z.string(),
      realtimeSmartMeterInfo: realtimeSmartMeterInfoSchema,
      averagePowerUsage: averagePowerUsageSchema.nullable(),
      totalUsageKW: z.number(),
      deviceUsage: deviceUsageSchema.nullable(),
    })
    .nullable(),
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
  {
    method: "post",
    path: "/Web/Monitor/Device",
    alias: "monitorDevice",
    description: "get monitor device data",
    response: monitorDeviceResponse,
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: monitorDeviceRequestParamsSchema,
      },
    ],
  },
]);
