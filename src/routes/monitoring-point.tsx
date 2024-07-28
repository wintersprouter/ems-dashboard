import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { match } from "ts-pattern";
import ToolBar from "../components/toolbar";
import { AuthProvider } from "../context/authProvider";
import { Api } from "../services/apis";

function MonitoringPoint() {
  const { status, mutate, failureReason } = useMutation({
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
      console.log(JSON.stringify(data, null, 2));
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
            <ToolBar />
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
