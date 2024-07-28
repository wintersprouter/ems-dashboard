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
interface OverViewData
  extends Omit<z.infer<typeof overviewResponse>, "realtimeSmartMeterInfo"> {}

function Overview() {
  const [overviewData, setOverviewData] = useState<OverViewData | null>(null);

  const [realtimeSmartMeterInfo, setRealtimeSmartMeterInfo] =
    useState<MainSmartMeterInfo>({} as MainSmartMeterInfo);
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
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        action: "MainSmartMeterInfo",
      });
    }
  }, [readyState, sendJsonMessage]);
  console.log(
    "Connection state changed",
    readyState === ReadyState.OPEN
      ? "OPEN"
      : readyState === ReadyState.CONNECTING
      ? "CONNECTING"
      : readyState === ReadyState.CLOSING
      ? "CLOSING"
      : readyState === ReadyState.CLOSED
      ? "CLOSED"
      : "UNINSTANTIATED"
  );

  const {
    chACurrent,
    chAUsageKW,
    chAVoltage,
    chBCurrent,
    chBUsageKW,
    chBVoltage,
    chCCurrent,
    chCUsageKW,
    chCVoltage,
  } = realtimeSmartMeterInfo;

  useEffect(() => {
    console.log(
      `Got a new message: ${JSON.stringify(lastJsonMessage, null, 2)}`
    );
    if (lastJsonMessage) {
      setRealtimeSmartMeterInfo({
        ...(lastJsonMessage as MainSmartMeterInfoMessage).mainSmartMeterInfo,
        chAVoltage,
        chACurrent,
        chAUsageKW,
        chBVoltage,
        chBCurrent,
        chBUsageKW,
        chCVoltage,
        chCCurrent,
        chCUsageKW,
        usedChannel: [
          ...(lastJsonMessage as MainSmartMeterInfoMessage).mainSmartMeterInfo
            .usedChannel,
        ],
      });
    }
  }, [
    chACurrent,
    chAUsageKW,
    chAVoltage,
    chBCurrent,
    chBUsageKW,
    chBVoltage,
    chCCurrent,
    chCUsageKW,
    chCVoltage,
    lastJsonMessage,
  ]);

  const { status, mutate } = useMutation({
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
        averagePowerUsage: {
          ...overviewData?.averagePowerUsage,
          ...data.averagePowerUsage,
        },
        monitorDeviceUsageList: {
          "0": [...data.monitorDeviceUsageList["0"]],
          "1": [...data.monitorDeviceUsageList["1"]],
          "2": [...data.monitorDeviceUsageList["2"]],
        },
        deviceUsageList: {
          ...overviewData?.deviceUsageList,
          "0": {
            ...overviewData?.deviceUsageList["0"],
            ...data.deviceUsageList["0"],
            usage: [...data.deviceUsageList["0"].usage],
          },
          "1": {
            ...overviewData?.deviceUsageList["1"],
            ...data.deviceUsageList["1"],
            usage: [...data.deviceUsageList["1"].usage],
          },
          "2": {
            ...overviewData?.deviceUsageList["2"],
            ...data.deviceUsageList["2"],
            usage: [...data.deviceUsageList["2"].usage],
          },
        },
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  // console.log("data", JSON.stringify(data, null, 2));
  return (
    <>
      <Sidebar />
      <section
        className='relative top-20 left-0 
        flex-col mx-auto container 
        lg:max-w-[calc(100%-13.5rem)]
        lg:left-[6.5rem] lg:top-2 
        xl:max-w-[calc(100%-14.5rem)]
        xl:left-28 xl:top-2'
      >
        {match(status)
          .with("pending", () => <p>Loading...</p>)
          .with("idle", () => <p>idle...</p>)
          .with("error", () => <p>Error</p>)
          .with("success", () => (
            <>
              <StatisticsCards
                realtimeSmartMeterInfo={realtimeSmartMeterInfo ?? undefined}
                averagePowerUsage={overviewData?.averagePowerUsage ?? undefined}
                totalUsageKW={overviewData?.totalUsageKW ?? 0}
                monitorDeviceCount={overviewData?.monitorDeviceCount ?? 0}
              />
              <Charts
                deviceUsageList={overviewData?.deviceUsageList}
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
