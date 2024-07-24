import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import Charts from "../components/charts";
import Sidebar from "../components/sidebar";
import StatisticsCards from "../components/statistics-cards";
import { AuthProvider } from "../context/authProvider";
import { Api } from "../services/apis";
function Overview() {
  const { status, data } = useQuery({
    queryKey: ["overview"],
    queryFn: () =>
      Api.overview({
        email: AuthProvider.email ?? "",
        action: "overview",
        token: AuthProvider.token ?? "",
      }),
    enabled: AuthProvider.isAuthenticated,
  });

  console.log("data", JSON.stringify(data, null, 2));
  return (
    <>
      <Sidebar />
      <section className='absolute top-20 left-0 lg:left-56 lg:top-[88px] flex-1 flex-grow flex-col w-full mx-auto lg:max-w-[1270px]'>
        {match(status)
          .with("pending", () => <p>Loading...</p>)
          .with("error", () => <p>Error</p>)
          .with("success", () => (
            <>
              <StatisticsCards
                realtimeSmartMeterInfo={
                  data?.realtimeSmartMeterInfo ?? undefined
                }
                averagePowerUsage={data?.averagePowerUsage ?? undefined}
                totalUsageKW={data?.totalUsageKW ?? 0}
                monitorDeviceCount={data?.monitorDeviceCount ?? 0}
              />
              <Charts
                monitorDeviceUsageList={data?.monitorDeviceUsageList}
                monitorPeriodMinute={data?.monitorPeriodMinute ?? 0}
              />
            </>
          ))
          .exhaustive()}
      </section>
    </>
  );
}
export default Overview;
