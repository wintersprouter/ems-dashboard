import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { match } from "ts-pattern";
import { z } from "zod";
import Charts from "../components/charts";
import Sidebar from "../components/sidebar";
import StatisticsCards from "../components/statistics-cards";
import { AuthProvider } from "../context/authProvider";
import { Api, socketUrl } from "../services/apis";
import { StatusCode } from "../services/apis/types";
import { overviewResponse } from "../services/apis/web";

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
      shouldReconnect: () => true,
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
        email: AuthProvider.email ?? "",
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

  useEffect(() => {
    console.log(
      `Got a new message: ${JSON.stringify(lastJsonMessage, null, 2)}`
    );
    if (lastJsonMessage !== null && lastJsonMessage) {
      const { mainSmartMeterInfo } =
        lastJsonMessage as MainSmartMeterInfoMessage;
      const { usedChannel, ...rest } = mainSmartMeterInfo;
      setRealtimeSmartMeterInfo({
        ...realtimeSmartMeterInfo,
        ...rest,
        usedChannel: Array.isArray(usedChannel) ? [...usedChannel] : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  const { status, mutate, failureReason } = useMutation({
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
        deviceUsageList: [...(data.deviceUsageList ?? [])],
      });
      setRealtimeSmartMeterInfo({
        ...realtimeSmartMeterInfo,
        ...data.realtimeSmartMeterInfo,
        usedChannel: [...data.realtimeSmartMeterInfo.usedChannel],
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
        lg:left-[6.5rem] lg:top-2'
      >
        {match(status)
          .with("pending", () => <p>Loading...</p>)
          .with("idle", () => <p>idle...</p>)
          .with("error", () => <p>Error:{failureReason?.message}</p>)
          .with("success", () => (
            <>
              <StatisticsCards
                realtimeSmartMeterInfo={realtimeSmartMeterInfo ?? undefined}
                averagePowerUsage={overviewData?.averagePowerUsage ?? undefined}
                totalUsageKW={overviewData?.totalUsageKW ?? 0}
                monitorDeviceCount={overviewData?.monitorDeviceCount ?? 0}
              />
              <Charts
                listPowerMaxKW={overviewData?.listPowerMaxKW ?? []}
                listPowerAverageKW={overviewData?.listPowerAverageKW ?? []}
                deviceUsageList={overviewData?.deviceUsageList ?? []}
                mainDeviceUsage={
                  overviewData?.mainDeviceUsage ?? {
                    name: "",
                    monitorPeriodMinute: 0,
                    id: 0,
                    usage: [],
                    listPowerAverageKW: [],
                    listPowerMaxKW: [],
                  }
                }
                // deviceUsageList={mockDeviceUsageList}
                // mainDeviceUsage={mockMainDeviceUsage}
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
