import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";
import { z } from "zod";
import ToolBar from "../components/toolbar";
import { AuthProvider } from "../context/authProvider";
import { Api } from "../services/apis";
import { monitorDeviceResponse } from "../services/apis/web";

function MonitoringPoint() {
  const [deviceList, setDeviceList] = useState<
    z.infer<typeof monitorDeviceResponse>["deviceList"]
  >([]);

  const { status, mutate, failureReason, data } = useMutation({
    mutationFn: () => {
      return Api.monitorDevice({
        email: AuthProvider.email ?? "",
        action: "monitorDevice",
        token: AuthProvider.token ?? "",
        factoryId: 1,
        deviceId: 1,
        dtStart: "2021-09-01T00:00:00",
        dtEnd: "2021-09-01T23:59:59",
      });
    },
    onSuccess(data) {
      console.log("data", JSON.stringify(data.deviceList, null, 2));
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
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <section className='flex container'>
      {match(status)
        .with("pending", () => <p>Loading...</p>)
        .with("error", () => (
          <p>Error: {failureReason?.toString() ?? "Unknown error"}</p>
        ))
        .with("success", () => (
          <>
            <ToolBar deviceList={deviceList} />
            <section className='relative top-0 left-0 lg:left-48 lg:top-4  flex-col w-full mx-auto'>
              {/* <StatisticsCards />
          <Charts /> */}
            </section>
          </>
        ))
        .with("idle", () => <p>Idle</p>)
        .exhaustive()}
    </section>
  );
}
export default MonitoringPoint;
