import { z } from "zod";
import { overviewResponse } from "./../services/apis/web";

type StatisticsCardsProps = {
  realtimeSmartMeterInfo?: z.infer<
    typeof overviewResponse
  >["realtimeSmartMeterInfo"];
  currentAverageUsage?: z.infer<typeof overviewResponse>["currentAverageUsage"];
  totalUsageKW: z.infer<typeof overviewResponse>["totalUsageKW"];
};

const StatisticsCards = ({
  realtimeSmartMeterInfo,
  currentAverageUsage,
  totalUsageKW,
}: StatisticsCardsProps) => {
  return (
    <section className='p-6 bg-white rounded-xl h-fit grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-6 lg:grid-cols-11 mx-2 '>
      <div className='flex flex-col col-span-4 md:col-span-5 lg:col-span-3'>
        <h3 className='font-medium font-gray-800 text-lg'>Real-time</h3>
        <div className='flex gap-4'>
          <ul>
            <li>
              <p>A</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chAVoltage ?? 0}
              </p>
              <p className='text-sm font-medium'>V</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chACurrent ?? 0}
              </p>
              <p className='text-sm font-medium'>A</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chAUsageKW ?? 0}
              </p>
              <p className='text-sm font-medium'>kW</p>
            </li>
          </ul>
          <ul>
            <li>
              <p>B</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chBVoltage ?? 0}
              </p>
              <p className='text-sm font-medium'>V</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chBCurrent ?? 0}
              </p>
              <p className='text-sm font-medium'>A</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chBUsageKW ?? 0}
              </p>
              <p className='text-sm font-medium'>kW</p>
            </li>
          </ul>
          <ul>
            <li>
              <p>C</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chCVoltage ?? 0}
              </p>
              <p className='text-sm font-medium'>V</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chCCurrent ?? 0}
              </p>
              <p className='text-sm font-medium'>A</p>
            </li>
            <li className='flex'>
              <p className='text-sm font-medium'>
                {realtimeSmartMeterInfo?.chCUsageKW ?? 0}
              </p>
              <p className='text-sm font-medium'>kW</p>
            </li>
          </ul>
          <ul>
            <li>
              <p>Total</p>
            </li>
            <li>
              <p className='font-semibold text-3xl text-gray-800 text-nowrap'>
                {totalUsageKW} kW
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center lg:border-s-2 border-gray-300 col-span-6 md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium font-gray-800 text-lg'>Day</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {currentAverageUsage?.day ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO2 Saved：545.7kg
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center p-4 md:border-s-2 border-gray-300 col-span-6  md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium font-gray-800 text-lg'>month</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {currentAverageUsage?.month ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO2 Saved：545.7kg
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center  lg:border-s-2 border-gray-300 col-span-6  md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium font-gray-800 text-lg'>Year</h3>
          <div className='flex items-baseline'>
            <p className='text-5xl text-gray-800 font-semibold mr-1'>
              {currentAverageUsage?.year ?? 0}
            </p>
            <p className='text-base text-gray-500 font-medium'>kW/h</p>
          </div>
          <p className='text-sm text-green-700 font-normal'>
            CO2 Saved：545.7kg
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center md:border-s-2 border-gray-300  col-span-6 md:col-span-3 lg:col-span-2'>
        <div>
          <h3 className='font-medium font-gray-800 text-lg text-nowrap'>
            Monitoring Points
          </h3>

          <p className='text-5xl text-gray-800 font-semibold'>23</p>
        </div>
      </div>
    </section>
  );
};
export default StatisticsCards;
