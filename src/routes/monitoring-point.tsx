import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { match } from "ts-pattern";
import { z } from "zod";
import Chart from "../components/chart";
import StatisticsCards from "../components/statistics-cards";
import ToolBar from "../components/toolbar";
import { AuthProvider } from "../context/authProvider";
import { Api } from "../services/apis";
import { monitorDeviceResponse } from "../services/apis/web";
export type DeviceUsageInfo = z.infer<
  typeof monitorDeviceResponse
>["deviceUsageInfo"];

function MonitoringPoint() {
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate") ?? new Date().toISOString();
  const endDate = searchParams.get("endDate") ?? new Date().toISOString();
  const deviceId = Number(searchParams.get("deviceId")) ?? 0;
  const [deviceList, setDeviceList] = useState<
    z.infer<typeof monitorDeviceResponse>["deviceList"]
  >([]);
  const [dtStart, setDtStart] = useState(startDate ?? "");
  const [dtEnd, setDtEnd] = useState(endDate ?? "");
  const [device, setDevice] = useState<DeviceUsageInfo>();

  const navigate = useNavigate();
  const { status, mutate, failureReason } = useMutation({
    mutationFn: () => {
      return Api.monitorDevice({
        email: AuthProvider.email ?? "",
        action: "monitorDevice",
        token: AuthProvider.token ?? "",
        factoryId: 1,
        deviceId: deviceId,
        dtStart: dtStart,
        dtEnd: dtEnd,
      });
    },
    onSuccess(data) {
      // console.log("data", JSON.stringify(data, null, 2));
      setDtStart(data.deviceUsageInfo?.dtStart ?? "");
      setDtEnd(data.deviceUsageInfo?.dtEnd ?? "");
      setDevice({
        ...device,
        ...data.deviceUsageInfo,
        realtimeSmartMeterInfo: {
          ...device?.realtimeSmartMeterInfo,
          ...data.deviceUsageInfo.realtimeSmartMeterInfo,
          usedChannel: [
            ...data.deviceUsageInfo.realtimeSmartMeterInfo.usedChannel,
          ],
        },
        averagePowerUsage: {
          ...device?.averagePowerUsage,
          ...data.deviceUsageInfo.averagePowerUsage,
        },
        deviceUsage: {
          ...device?.deviceUsage,
          ...data.deviceUsageInfo.deviceUsage,
        },
      });
      setDeviceList(
        deviceList.length === 0
          ? [...data.deviceList]
          : [
              //保留舊資料中新資料也有的
              ...deviceList.filter((device) => {
                const newDevice = data.deviceList.find(
                  (d) => d.id === device.id
                );
                if (newDevice) {
                  return {
                    ...device,
                    ...newDevice,
                  };
                }
              }),
              //加入新資料中有舊資料沒有的
              ...data.deviceList.filter(
                (newDevice) => !deviceList.some((d) => d.id === newDevice.id)
              ),
            ]
      );
      return navigate(`/dashboard/monitoring-point?${searchParams.toString()}`);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <section className='flex'>
      {match(status)
        .with("pending", () => <p>Loading...</p>)
        .with("error", () => (
          <p>Error: {failureReason?.toString() ?? "Unknown error"}</p>
        ))
        .with("success", () => (
          <>
            <ToolBar
              deviceList={deviceList}
              setDtStart={setDtStart ?? ""}
              setDtEnd={setDtEnd ?? ""}
              dtStart={dtStart}
              dtEnd={dtEnd}
              device={device}
            />
            <section className='relative top-0 left-0 flex-col w-full mx-auto lg:left-[21.5rem] lg:top-2 lg:max-w-[calc(100%-17rem)] lg:w-4/5  xl:left-[14.5rem] xl:w-[calc(100%-30rem)]'>
              <StatisticsCards
                totalUsageKW={device?.totalUsageKW ?? 0}
                realtimeSmartMeterInfo={device?.realtimeSmartMeterInfo}
                averagePowerUsage={device?.averagePowerUsage}
              />
              <Chart
                deviceUsage={
                  device?.deviceUsage ?? {
                    usage: [],
                    id: 0,
                    name: "",
                    powerMaxKW: 0,
                    powerAverageKW: 0,
                    listPowerMaxKW: [],
                    listPowerAverageKW: [],
                    monitorPeriodMinute: 0,
                  }
                }
              />
            </section>
          </>
        ))
        .with("idle", () => <p>Idle</p>)
        .exhaustive()}
    </section>
  );
}
export default MonitoringPoint;
