import { format } from "date-fns";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { DeviceUsageInfo } from "../routes/monitoring-point";
import { monitorDeviceResponse } from "../services/apis/web";
import { formatDateString } from "../util/getTime";
import Navbar from "./navbar";

const defaultDateStyle =
  "relative left-0 rounded-lg border border-gray-300 p-2 text-sm text-gray-300 font-normal active:border-gray-800 active:text-gray-800";
const hasDateStyle =
  "relative left-0 rounded-lg border p-2 text-sm font-normal border-gray-800 text-gray-800";

type ToolBarProps = {
  deviceList: z.infer<typeof monitorDeviceResponse>["deviceList"];
  setDtStart: React.Dispatch<React.SetStateAction<string>>;
  setDtEnd: React.Dispatch<React.SetStateAction<string>>;
  dtStart: string | null;
  dtEnd: string | null;
  device?: DeviceUsageInfo;
};

const ToolBar = ({
  deviceList,

  setDtStart,
  dtStart,
  device,
}: ToolBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceId = searchParams.get("deviceId");
  const navigate = useNavigate();
  // const handleStartTimeChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const newStartTime: string = event.target.value;
  //   // 先解析 ISO 字符串，然後格式化
  //   const formattedStartTime = format(
  //     parseISO(newStartTime),
  //     "yyyy-MM-dd HH:mm"
  //   );
  //   setDtStart(formattedStartTime);
  //   if (dtEnd !== null && formattedStartTime > dtEnd) {
  //     setDtEnd(formattedStartTime);
  //   }
  // };

  // const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // 先解析 ISO 字符串，然後格式化
  //   const formattedEndTime = format(
  //     parseISO(event.target.value),
  //     "yyyy-MM-dd HH:mm"
  //   );
  //   setDtEnd(formattedEndTime);
  // };

  // useEffect(() => {
  //   if (dtEnd !== null && dtStart !== null) {
  //     searchParams.set("startDate", dtStart);
  //     searchParams.set("endDate", dtEnd);
  //     return navigate(`/dashboard/monitoring-point?${searchParams.toString()}`);
  //   } else {
  //     setSearchParams((params) => {
  //       const queryParams = Object.fromEntries(params);
  //       delete queryParams["startDate"];
  //       delete queryParams["endDate"];
  //       return queryParams;
  //     });
  //   }
  // }, [dtEnd, dtStart, navigate, searchParams, setSearchParams]);

  useEffect(() => {
    if (dtStart !== null) {
      setSearchParams((params) => {
        const queryParams = Object.fromEntries(params);
        delete queryParams["startDate"];
        return queryParams;
      });
      searchParams.set("startDate", dtStart);
      return navigate(`/dashboard/monitoring-point?${searchParams.toString()}`);
    } else {
      setSearchParams((params) => {
        const queryParams = Object.fromEntries(params);
        delete queryParams["startDate"];
        return queryParams;
      });
    }
  }, [dtStart, navigate, searchParams, setSearchParams]);
  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDtStart(event.target.value);
  };
  return (
    <section className='fixed top-4 lg:top-20 lg:left-2 bg-white rounded-2xl  flex h-[calc(100vh-6rem)]'>
      <div className='rounded-2xl border border-white shadow min-w-28 py-6 px-3 overflow-y-auto bg-gray-50 grid grid-cols-1 divide-y-2 divide-gray-200 gap-6 h-full '>
        <Navbar />
      </div>
      <div className='flex flex-col divide-y-[1px] divide-gray-300 p-4 gap-4 w-64'>
        <div className='grid grid-cols-2 gap-1'>
          {deviceList?.map((item, idx) => {
            if (item.id === Number(deviceId)) {
              return (
                <button
                  key={`device-${idx}`}
                  type='button'
                  className='rounded-lg border border-gray-300 p-2 text-xs  font-normal text-white bg-green-600'
                  onClick={() => {
                    searchParams.set("deviceId", item.id.toString());
                    navigate(
                      `/dashboard/monitoring-point?${searchParams.toString()}`
                    );
                  }}
                >
                  {item.name}
                </button>
              );
            } else {
              return (
                <button
                  key={`device-${idx}`}
                  type='button'
                  className='rounded-lg border border-gray-300 p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
                  onClick={() => {
                    searchParams.set("deviceId", item.id.toString());
                    navigate(
                      `/dashboard/monitoring-point?${searchParams.toString()}`
                    );
                  }}
                >
                  {item.name}
                </button>
              );
            }
          })}
        </div>
        <div>
          <h4 className='my-4 font-medium text-gray-800'>Date Range</h4>
          <div className='gap-2'>
            <label
              htmlFor='start'
              className={
                "bg-white text-xs font-normal" + dtStart
                  ? "text-gray-800"
                  : "text-gray-400"
              }
            >
              <p className='relative top-2 left-2 z-20 bg-white w-fit text-xs '>
                Start
              </p>
              {/* <input
                id='start'
                aria-label='Date and time from'
                value={formatDatTimeString(dtStart ?? "")}
                onChange={handleStartTimeChange}
                type='datetime-local'
                className={dtStart ? hasDateStyle : defaultDateStyle}
                required
                step='60'
              /> */}
              <input
                id='start'
                aria-label='Date from'
                value={formatDateString(dtStart ?? "")}
                onChange={handleStartTimeChange}
                type='date'
                className={dtStart ? hasDateStyle : defaultDateStyle}
                required
              />
            </label>
            {/* <label htmlFor='end' className={"bg-white text-xs font-normal"}>
              <p className='relative top-2 left-2 z-20 bg-white w-fit text-xs'>
                End
              </p>
              <input
                id='end'
                aria-label='Date and time to'
                min={dtStart ?? ""}
                value={formatDateTimeString(dtEnd ?? "")}
                onChange={handleEndTimeChange}
                type='datetime-local'
                required
                className={dtEnd ? hasDateStyle : defaultDateStyle}
                step='60'
              />
            </label> */}
          </div>
        </div>
        <div>
          <h4 className='my-4 font-medium text-gray-800'>Introduction</h4>
          <div className='flex gap-3 mb-2'>
            <div>
              <p className='text-sm text-gray-800'>Built Time</p>
              <p className='text-sm text-gray-800'>Side</p>
              <p className='text-sm text-gray-800'>CT</p>
            </div>
            <div>
              <p className='text-sm text-gray-800'>
                {device?.dtBuilt &&
                  format(new Date(device?.dtBuilt), "yyyy/MM/dd")}
              </p>
              <p className='text-sm text-gray-800'>{device?.side}</p>
              <p className='text-sm text-gray-800'>{device?.ct}</p>
            </div>
          </div>
          <div>
            <h5 className='text-gray-400 text-sm'>Note</h5>
            <p className='text-sm text-gray-800'>
              Learn how ingsist.com uses colors and fonts to enhance user
              experience and design coherence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ToolBar;
