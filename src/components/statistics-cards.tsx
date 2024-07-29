import { z } from "zod";
import { limitDecimalToOnePlace } from "../util/limitDecimalToOnePlace";
import {
  monitorDeviceResponse,
  overviewResponse,
  realtimeSmartMeterInfoSchema,
} from "./../services/apis/web";

type StatisticsCardsProps = {
  realtimeSmartMeterInfo?: z.infer<typeof realtimeSmartMeterInfoSchema>;
  averagePowerUsage?:
    | z.infer<typeof overviewResponse>["averagePowerUsage"]
    | z.infer<
        typeof monitorDeviceResponse
      >["deviceUsageInfo"]["averagePowerUsage"];
  totalUsageKW:
    | z.infer<typeof overviewResponse>["totalUsageKW"]
    | z.infer<typeof monitorDeviceResponse>["deviceUsageInfo"]["totalUsageKW"];
  monitorDeviceCount?: z.infer<typeof overviewResponse>["monitorDeviceCount"];
};

const StatisticsCards = ({
  realtimeSmartMeterInfo,
  averagePowerUsage,
  totalUsageKW,
  monitorDeviceCount,
}: StatisticsCardsProps) => {
  return (
    <section className='p-6 bg-white rounded-xl h-fit grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-6 lg:grid-cols-11 mx-2 '>
      <div className='flex flex-col col-span-4 md:col-span-5 lg:col-span-3'>
        <h3 className='font-medium text-gray-500 text-lg'>Real-time</h3>
        <div className='flex gap-4'>
          {realtimeSmartMeterInfo?.usedChannel[0] && (
            <ul>
              <li className='border-b border-gray-300'>
                <p className='font-medium text-green-700 text-sm'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-green-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chAVoltage) ??
                    0}
                </p>
                <p className='text-sm font-medium text-green-700'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-green-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chACurrent) ??
                    0}
                </p>
                <p className='text-sm font-medium text-green-700'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-green-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chAUsageKW) ??
                    0}
                </p>
                <p className='text-sm font-medium text-green-700'>kW</p>
              </li>
            </ul>
          )}
          {realtimeSmartMeterInfo?.usedChannel[1] && (
            <ul>
              <li className='border-b border-gray-300'>
                <p className='font-medium text-red-600 text-sm'>B</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-red-600'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chBVoltage) ??
                    0}
                </p>
                <p className='text-sm font-medium text-red-600'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-red-600'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chBCurrent) ??
                    0}
                </p>
                <p className='text-sm font-medium text-red-600'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-red-600'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chBUsageKW) ??
                    0}
                </p>
                <p className='text-sm font-medium text-red-600'>kW</p>
              </li>
            </ul>
          )}
          {realtimeSmartMeterInfo?.usedChannel[2] && (
            <ul>
              <li className='border-b border-gray-300'>
                <p className='text-sm font-medium text-blue-700'>C</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-blue-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chCVoltage) ??
                    0}
                </p>
                <p className='text-sm font-medium text-blue-700'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-blue-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chCCurrent) ??
                    0}
                </p>
                <p className='text-sm font-medium text-blue-700'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium text-blue-700'>
                  {limitDecimalToOnePlace(realtimeSmartMeterInfo?.chCUsageKW) ??
                    0}
                </p>
                <p className='text-sm font-medium text-blue-700'>kW</p>
              </li>
            </ul>
          )}
          <ul>
            <li>
              <p className='text-sm font-medium text-gray-800'>Total</p>
            </li>
            <li>
              <p className='font-semibold text-3xl text-gray-800 text-nowrap'>
                {limitDecimalToOnePlace(totalUsageKW)} kW
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center lg:border-s-2 border-gray-300 col-span-6 md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium text-gray-500 text-lg'>Day</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {limitDecimalToOnePlace(averagePowerUsage?.dayUsageKHW) ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO₂ e：
            {limitDecimalToOnePlace(averagePowerUsage?.dayCO2Saving) ?? 0}kg
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center p-4 md:border-s-2 border-gray-300 col-span-6  md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium text-gray-500 text-lg'>month</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {limitDecimalToOnePlace(averagePowerUsage?.monthUsageKHW) ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO₂ e：
            {limitDecimalToOnePlace(averagePowerUsage?.monthCO2Saving) ?? 0}kg
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center  lg:border-s-2 border-gray-300 col-span-6  md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium text-gray-500 text-lg'>Year</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {limitDecimalToOnePlace(averagePowerUsage?.yearUsageKHW) ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO₂ e：
            {limitDecimalToOnePlace(averagePowerUsage?.yearCO2Saving) ?? 0}kg
          </p>
        </div>
      </div>
      {monitorDeviceCount && (
        <div className='flex flex-col items-center justify-center md:border-s-2 border-gray-300  col-span-6 md:col-span-3 lg:col-span-2'>
          <div className='mb-5'>
            <h3 className='font-medium text-gray-500 text-lg text-nowrap'>
              Monitoring Points
            </h3>
            <p className='text-5xl text-gray-800 font-semibold'>
              {monitorDeviceCount}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
export default StatisticsCards;
