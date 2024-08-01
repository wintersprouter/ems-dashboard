import { format } from "date-fns/format";
import { useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import monitoring_point_active_icon from "../assets/monitoring_point_active_icon.svg";
import monitoring_point_icon from "../assets/monitoring_point_icon.svg";
import overview_active_icon from "../assets/overview_active_icon.svg";
import overview_icon from "../assets/overview_icon.svg";
import tree_active_icon from "../assets/tree_active_icon.svg";
import tree_icon from "../assets/tree_icon.svg";
import { DeviceUsageInfo } from "../routes/monitoring-point";
import { monitorDeviceResponse } from "../services/apis/web";
const navLinkStyle =
  "flex px-1 pl-2 hover:bg-green-100 hover:rounded duration-150 ease-in-out";
const activeNavLinkStyle =
  "flex px-1  rounded bg-green-100 border-green-400 border duration-150 ease-in-out";

const navTextStyle =
  "p-2 text-base text-gray-800 font-normal hover:text-green-800 hidden lg:flex ";
const navActiveTextStyle =
  "p-2 text-base text-green-800 font-normal hidden lg:flex ";

const defaultDateStyle =
  "relative left-0 rounded-lg border border-gray-300 p-2 text-sm text-gray-300 font-normal active:border-gray-800 active:text-gray-800";
const hasDateStyle =
  "relative left-0 rounded-lg border p-2 text-sm font-normal border-gray-800 text-gray-800";

const navigation = [
  {
    navigation: "/dashboard/overview",
    name: "Overview",
    icon: overview_icon,
    activeIcon: overview_active_icon,
  },

  {
    navigation: "/dashboard/tree",
    name: "Tree",
    icon: tree_icon,
    activeIcon: tree_active_icon,
  },
  {
    navigation: "/dashboard/monitoring-point",
    name: "Monitoring Point",
    icon: monitoring_point_icon,
    activeIcon: monitoring_point_active_icon,
  },
];

type ToolBarProps = {
  deviceList: z.infer<typeof monitorDeviceResponse>["deviceList"];
  setDtStart: React.Dispatch<React.SetStateAction<string | null>>;
  setDtEnd: React.Dispatch<React.SetStateAction<string | null>>;
  dtStart: string | null;
  dtEnd: string | null;
  device?: DeviceUsageInfo;
};

const ToolBar = ({
  deviceList,
  setDtEnd,
  setDtStart,
  dtStart,
  dtEnd,
  device,
}: ToolBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartTime: string = event.target.value;
    setDtStart(newStartTime);
    if (dtEnd !== null && newStartTime > dtEnd) {
      setDtEnd(newStartTime);
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDtEnd(event.target.value);
  };

  useEffect(() => {
    if(dtEnd !== null && dtStart !== null && dtStart > dtEnd){
      setSearchParams({
        ...searchParams,
        startDate: dtEnd.toString(),
        endDate: dtEnd.toString(),
      });
  
      return navigate(`/dashboard/monitoring-point/${searchParams.toString()}`);
    }else{
      searchParams.delete('startDate');
      searchParams.delete('endDate');
      setSearchParams({
        ...searchParams,
      });
    }
  },[dtEnd, dtStart, navigate, searchParams, setSearchParams])

  return (
    <section className='fixed top-4 lg:top-20 lg:left-2 bg-white rounded-2xl  flex h-[48rem]'>
      <div className='rounded-2xl border border-white shadow min-w-28 py-6 px-3 overflow-y-auto bg-gray-50 grid grid-cols-1 divide-y-2 divide-gray-200 gap-6 h-full '>
        <nav className='pb-4'>
          <h2 className='text-left text-xs text-gray-400'>General</h2>
          <ul className='flex flex-col gap-3 my-3'>
            {navigation.map((item, idx) => (
              <NavLink to={item.navigation} key={`navigation-${idx}`}>
                {({ isActive, isPending }) => (
                  <li
                    key={idx}
                    className={
                      isActive
                        ? activeNavLinkStyle
                        : isPending
                        ? navLinkStyle
                        : navLinkStyle
                    }
                  >
                    {isActive && (
                      <div className='relative right-4 top-0 h-10 w-1 bg-green-800' />
                    )}
                    <img
                      src={isActive ? item.activeIcon : item.icon}
                      alt={item.navigation}
                    />
                    <p className={isActive ? navActiveTextStyle : navTextStyle}>
                      {item.name}
                    </p>
                  </li>
                )}
              </NavLink>
            ))}
          </ul>
        </nav>
      </div>
      <div className='flex flex-col divide-y-[1px] divide-gray-300 p-4 gap-4 w-64'>
        <div className='grid grid-cols-2 gap-1'>
          {deviceList.map((item, idx) => {
            if (item.id === device?.id) {
              return (
                <button
                  key={`device-${idx}`}
                  type='button'
                  className='rounded-lg border border-gray-300 p-2 text-xs  font-normal text-white bg-green-600'
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
              <input
                id='start'
                aria-label='Date and time from'
                value={dtStart ?? ""}
                onChange={handleStartTimeChange}
                type='datetime-local'
                className={dtStart ? hasDateStyle : defaultDateStyle}
                required
              />
            </label>
            <label htmlFor='end' className={"bg-white text-xs font-normal"}>
              <p className='relative top-2 left-2 z-20 bg-white w-fit text-xs'>
                End
              </p>
              <input
                id='end'
                aria-label='Date and time to'
                min={dtStart ?? ""}
                value={dtEnd ?? ""}
                onChange={handleEndTimeChange}
                type='datetime-local'
                required
                className={dtEnd ? hasDateStyle : defaultDateStyle}
              />
            </label>
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
