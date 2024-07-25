import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { match } from "ts-pattern";
import { z } from "zod";
import Charts from "../components/charts";
import Sidebar from "../components/sidebar";
import StatisticsCards from "../components/statistics-cards";
import { AuthProvider } from "../context/authProvider";
import { Api } from "../services/apis";
import { StatusCode } from "../services/apis/types";
import { overviewResponse } from "../services/apis/web";
const socketUrl = "wss://epoweros.greenwiz.com.tw:32443/WSS";
type MainSmartMeterInfo = z.infer<
  typeof overviewResponse
>["realtimeSmartMeterInfo"];
interface MainSmartMeterInfoMessage {
  mainSmartMeterInfo: MainSmartMeterInfo;
  action: "MainSmartMeterInfo";
  statusCode: StatusCode;
}

function Overview() {
  const [overviewData, setOverviewData] = useState<z.infer<
    typeof overviewResponse
  > | null>(null);
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: false,
      shouldReconnect: () => true,
      onOpen: () => console.log("WebSocket connection opened!"),
      onClose: () => console.log("WebSocket connection closed!"),
      onError: (event: Event) => console.error("WebSocket error:", event),
      onMessage: (event: MessageEvent) =>
        console.log("Received message:", event.data),
    }
  );

  useEffect(() => {
    console.log("Connection state changed", readyState);
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        action: "MainSmartMeterInfo",
      });
    }
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    console.log(
      `Got a new message: ${JSON.stringify(lastJsonMessage, null, 2)}`
    );

    if (lastJsonMessage) {
      setOverviewData({
        ...overviewData,
        averagePowerUsage: {
          ...overviewData?.averagePowerUsage,
          dayCO2Saving: overviewData?.averagePowerUsage.dayCO2Saving ?? 0,
          dayUsageKHW: overviewData?.averagePowerUsage.dayUsageKHW ?? 0,
          monthCO2Saving: overviewData?.averagePowerUsage.monthCO2Saving ?? 0,
          monthUsageKHW: overviewData?.averagePowerUsage.monthUsageKHW ?? 0,
          yearCO2Saving: overviewData?.averagePowerUsage.yearCO2Saving ?? 0,
          yearUsageKHW: overviewData?.averagePowerUsage.yearUsageKHW ?? 0,
        },
        monitorDeviceUsageList:
          overviewData?.monitorDeviceUsageList &&
          "0" in overviewData.monitorDeviceUsageList
            ? {
                "0": [...(overviewData?.monitorDeviceUsageList["0"] ?? [])],
                "1": [...(overviewData?.monitorDeviceUsageList["1"] ?? [])],
                "2": [...(overviewData?.monitorDeviceUsageList["2"] ?? [])],
              }
            : {},
        realtimeSmartMeterInfo: {
          ...overviewData?.realtimeSmartMeterInfo,
          ...(lastJsonMessage as MainSmartMeterInfoMessage).mainSmartMeterInfo,
        },
        mainDeviceId: overviewData?.mainDeviceId ?? 0,
        totalUsageKW: overviewData?.totalUsageKW ?? 0,
        monitorDeviceCount: overviewData?.monitorDeviceCount ?? 0,
        monitorPeriodMinute: overviewData?.monitorPeriodMinute ?? 0,
        email: overviewData?.email ?? "",
        username: overviewData?.username ?? "",
        action: overviewData?.action ?? "",
        token: overviewData?.token ?? null,
        dtTokenExpire: overviewData?.dtTokenExpire ?? "",
        statusCode: overviewData?.statusCode ?? StatusCode.OK,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  const { status, data, mutate } = useMutation({
    mutationFn: () => {
      return Api.overview({
        email: AuthProvider.email ?? "",
        action: "overview",
        token: AuthProvider.token ?? "",
      });
    },
    onSuccess(data) {
      setOverviewData({
        ...overviewData,
        ...data,
        realtimeSmartMeterInfo: {
          ...overviewData?.realtimeSmartMeterInfo,
          ...data.realtimeSmartMeterInfo,
        },
        averagePowerUsage: {
          ...overviewData?.averagePowerUsage,
          ...data.averagePowerUsage,
        },
        monitorDeviceUsageList:
          "0" in data.monitorDeviceUsageList &&
          overviewData?.monitorDeviceUsageList &&
          "0" in overviewData.monitorDeviceUsageList
            ? {
                "0": [
                  ...(overviewData?.monitorDeviceUsageList["0"] ?? []),
                  ...data.monitorDeviceUsageList["0"],
                ],
                "1": [
                  ...(overviewData?.monitorDeviceUsageList["1"] ?? []),
                  ...data.monitorDeviceUsageList["1"],
                ],
                "2": [
                  ...(overviewData?.monitorDeviceUsageList["2"] ?? []),
                  ...data.monitorDeviceUsageList["2"],
                ],
              }
            : {},
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  console.log("data", JSON.stringify(data, null, 2));
  return (
    <>
      <Sidebar />
      <section className='absolute top-20 left-0 lg:left-56 lg:top-[88px] flex-1 flex-grow flex-col w-full mx-auto lg:max-w-[1270px]'>
        {match(status)
          .with("pending", () => <p>Loading...</p>)
          .with("idle", () => <p>idle...</p>)
          .with("error", () => <p>Error</p>)
          .with("success", () => (
            <>
              <StatisticsCards
                realtimeSmartMeterInfo={
                  overviewData?.realtimeSmartMeterInfo ?? undefined
                }
                averagePowerUsage={overviewData?.averagePowerUsage ?? undefined}
                totalUsageKW={overviewData?.totalUsageKW ?? 0}
                monitorDeviceCount={overviewData?.monitorDeviceCount ?? 0}
              />
              <Charts
                monitorDeviceUsageList={overviewData?.monitorDeviceUsageList}
                monitorPeriodMinute={overviewData?.monitorPeriodMinute ?? 0}
              />
            </>
          ))
          .exhaustive()}
      </section>
    </>
  );
}
export default Overview;
