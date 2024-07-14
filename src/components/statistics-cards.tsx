const StatisticsCards = () => {
  return (
    <section className='absolute top-20 left-0 lg:left-56 flex-1 flex-grow flex-col w-full mx-auto lg:max-w-[1200px]'>
      <section className='p-6 bg-white rounded-xl h-fit grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-6 lg:grid-cols-11 mx-2 '>
        <div className='flex flex-col col-span-4 md:col-span-5 lg:col-span-3'>
          <h3 className='font-medium font-gray-800 text-lg'>Real-time</h3>
          <div className='flex gap-3'>
            <ul>
              <li>
                <p>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>240</p>
                <p className='text-sm font-medium'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>50</p>
                <p className='text-sm font-medium'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>13.2</p>
                <p className='text-sm font-medium'>kW</p>
              </li>
            </ul>
            <ul>
              <li>
                <p>B</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>240</p>
                <p className='text-sm font-medium'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>50</p>
                <p className='text-sm font-medium'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>13.2</p>
                <p className='text-sm font-medium'>kW</p>
              </li>
            </ul>
            <ul>
              <li>
                <p>C</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>240</p>
                <p className='text-sm font-medium'>V</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>50</p>
                <p className='text-sm font-medium'>A</p>
              </li>
              <li className='flex'>
                <p className='text-sm font-medium'>13.2</p>
                <p className='text-sm font-medium'>kW</p>
              </li>
            </ul>
            <ul>
              <li>
                <p>Total</p>
              </li>
              <li>
                <p className='font-semibold text-3xl text-gray-800 text-nowrap'>
                  40.6 kW
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center lg:border-s-2 border-gray-300 col-span-6 md:col-span-3 lg:col-span-2'>
          <div>
            <h3 className='font-medium font-gray-800 text-lg'>Day</h3>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold mr-1'>26</p>
              <p className='text-base text-gray-500 font-medium'>kW/h</p>
            </div>
            <p className='text-sm text-green-700 font-normal'>
              CO2 Saved：545.7kg
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center p-4 md:border-s-2 border-gray-300 col-span-6  md:col-span-3 lg:col-span-2'>
          <div>
            <h3 className='font-medium font-gray-800 text-lg'>Month</h3>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold mr-1'>236</p>
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
              <p className='text-5xl text-gray-800 font-semibold mr-1'>2293</p>
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
    </section>
  );
};
export default StatisticsCards;
