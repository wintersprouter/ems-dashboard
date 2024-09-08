import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { match } from "ts-pattern";
import { z } from "zod";
import Charts from "../components/charts";
import StatisticsCards from "../components/statistics-cards";
import ToolBar from "../components/toolbar";
import { AuthProvider } from "../context/authProvider";
import { Api, socketUrl } from "../services/apis";
import { monitorDeviceResponse } from "../services/apis/web";

export type DeviceUsageInfo = z.infer<
  typeof monitorDeviceResponse
>["deviceUsageInfo"] & {
  realtimeSmartMeterInfo: {
    usedChannel: boolean[];
    chAVoltage: number;
    chACurrent: number;
    chAUsageKW: number;
    chBVoltage: number;
    chBCurrent: number;
    chBUsageKW: number;
    chCVoltage: number;
    chCCurrent: number;
    chCUsageKW: number;
  };
};

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
  const [realtimeSmartMeterInfo, setRealtimeSmartMeterInfo] = useState<
    DeviceUsageInfo["realtimeSmartMeterInfo"]
  >({
    usedChannel: [true, true, true],
    chAVoltage: 0,
    chACurrent: 0,
    chAUsageKW: 0,
    chBVoltage: 0,
    chBCurrent: 0,
    chBUsageKW: 0,
    chCVoltage: 0,
    chCCurrent: 0,
    chCUsageKW: 0,
  });
  const navigate = useNavigate();
  const { data, status, failureReason } = useQuery({
    queryKey: ["monitorDevice", deviceId, dtStart, dtEnd],
    queryFn: () =>
      Api.monitorDevice({
        email: AuthProvider.email ?? "",
        action: "monitorDevice",
        token: AuthProvider.token ?? "",
        factoryId: 1,
        deviceId: deviceId,
        dtStart: new Date(dtStart).toISOString(),
        dtEnd: new Date(dtEnd).toISOString(),
      }),
    enabled: !!AuthProvider.email && !!AuthProvider.token,
  });

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: false,
      shouldReconnect: () => false,
      onOpen: () => console.log("WebSocket connection opened!"),
      onClose: () => console.log("WebSocket connection closed!"),
      onError: (event: Event) => console.error("WebSocket error:", event),
      onMessage: (event: MessageEvent) =>
        console.log("Received message:", event.data),
    }
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN && deviceId !== 0) {
      sendJsonMessage({
        action: "DeviceSmartMeterInfo",
        email: AuthProvider.email ?? "",
        slaveSmartMeterId: deviceId,
      });
    }
  }, [deviceId, readyState, sendJsonMessage]);

  useEffect(() => {
    console.log(
      `Got a new message: ${JSON.stringify(lastJsonMessage, null, 2)}`
    );

    if (lastJsonMessage !== null && lastJsonMessage) {
      const { usedChannel, ...rest } =
        lastJsonMessage as DeviceUsageInfo["realtimeSmartMeterInfo"];
      setRealtimeSmartMeterInfo({
        ...realtimeSmartMeterInfo,
        ...rest,
        usedChannel: Array.isArray(usedChannel) ? [...usedChannel] : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  useEffect(() => {
    if (status === "success") {
      setDtStart(data.deviceUsageInfo?.dtStart ?? "");
      setDtEnd(data.deviceUsageInfo?.dtEnd ?? "");
      setDeviceList(
        deviceList?.length === 0
          ? [...(data.deviceList ?? [])]
          : [
              // eslint-disable-next-line no-unsafe-optional-chaining
              ...(deviceList?.filter((device) => {
                const newDevice = data.deviceList?.find(
                  (d) => d.id === device.id
                );
                if (newDevice) {
                  return {
                    ...device,
                    ...newDevice,
                  };
                }
              }) ?? []),
              // eslint-disable-next-line no-unsafe-optional-chaining
              ...(data.deviceList ?? []).filter(
                (newDevice) => !deviceList?.some((d) => d.id === newDevice.id)
              ),
            ]
      );
      setRealtimeSmartMeterInfo({
        ...realtimeSmartMeterInfo,
        ...data?.deviceUsageInfo?.realtimeSmartMeterInfo,
        usedChannel: [
          ...(data?.deviceUsageInfo?.realtimeSmartMeterInfo?.usedChannel ?? []),
        ],
      });
      if (deviceId === 0) {
        searchParams.set("deviceId", data.deviceUsageInfo?.id.toString() ?? "");
        navigate(`/dashboard/monitoring-point?${searchParams.toString()}`);
      }
    }
    if (searchParams) {
      navigate(`/dashboard/monitoring-point?${searchParams.toString()}`);
    }
    // data.deviceList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.deviceUsageInfo?.dtEnd,
    data?.deviceUsageInfo?.dtStart,
    navigate,
    searchParams,
    status,
  ]);

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
              device={data?.deviceUsageInfo ?? undefined}
            />
            <section className='relative top-0 left-0 flex-col w-full mx-auto lg:left-[21.5rem] lg:top-2 lg:max-w-[calc(100%-17rem)] lg:w-4/5  xl:left-[14.5rem] xl:w-[calc(100%-30rem)]'>
              <StatisticsCards
                totalUsageKW={data?.deviceUsageInfo?.totalUsageKW ?? 0}
                realtimeSmartMeterInfo={realtimeSmartMeterInfo ?? undefined}
                averagePowerUsage={
                  data?.deviceUsageInfo?.averagePowerUsage ?? {
                    dayCO2SavingKG: 0,
                    monthCO2SavingKG: 0,
                    yearCO2SavingKG: 0,
                    monthUsageKWH: 0,
                    dayUsageKWH: 0,
                    yearUsageKWH: 0,
                  }
                }
              />
              <Charts
                mainDeviceUsage={
                  data?.deviceUsageInfo?.mainDeviceUsage ?? {
                    usage: [],
                    id: 0,
                    name: "",
                    listPowerMaxKW: [],
                    listPowerAverageKW: [],
                    monitorPeriodMinute: 0,
                  }
                }
                listPowerMaxKW={
                  data?.deviceUsageInfo?.mainDeviceUsage?.listPowerMaxKW ?? []
                }
                listPowerAverageKW={
                  data?.deviceUsageInfo?.mainDeviceUsage?.listPowerAverageKW ??
                  []
                }
                monitorPeriodMinute={
                  data?.deviceUsageInfo?.mainDeviceUsage?.monitorPeriodMinute ??
                  0
                }
              />
            </section>
          </>
        ))
        .exhaustive()}
    </section>
  );
}
export default MonitoringPoint;
