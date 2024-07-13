import Sidebar from "../components/sidebar";

function Overview() {
  return (
    <>
      <Sidebar />
      <section className='absolute top-20 left-0 lg:left-56 flex-1 flex-grow flex-col w-full mx-auto lg:max-w-7xl'>
        <section className='p-6 divide-x-2  align-middle justify-between flex flex-wrap gap-4 bg-white rounded-xl h-fit'>
          <div className='flex flex-col items-center justify-center p-6'>
            <h3 className='font-medium font-gray-800 text-lg'>Real-time</h3>
            <ul>
              <li className='flex'>
                <p>240</p>
                <p>V</p>
              </li>
              <li className='flex'>
                <p>50</p>
                <p>A</p>
              </li>
              <li className='flex'>
                <p>13.2</p>
                <p>kW</p>
              </li>
            </ul>
          </div>
          <div className='flex flex-col items-center justify-center p-6'>
            <h3 className='font-medium font-gray-800 text-lg'>Day</h3>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold mr-1'>26</p>
              <p className='text-base text-gray-500 font-medium'>kW/h</p>
            </div>
            <p className='text-sm text-green-700 font-normal'>
              CO2 Saved：545.7kg
            </p>
          </div>
          <div className='flex flex-col items-center justify-center p-6'>
            <div>
              <h3 className='font-medium font-gray-800 text-lg'>Month</h3>
            </div>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold mr-1'>236</p>
              <p className='text-base text-gray-500 font-medium'>kW/h</p>
            </div>
            <p className='text-sm text-green-700 font-normal'>
              CO2 Saved：545.7kg
            </p>
          </div>
          <div className='flex flex-col items-center justify-center p-6'>
            <h3 className='font-medium font-gray-800 text-lg'>Year</h3>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold mr-1'>2293</p>
              <p className='text-base text-gray-500 font-medium'>kW/h</p>
            </div>
            <p className='text-sm text-green-700 font-normal'>
              CO2 Saved：545.7kg
            </p>
          </div>
          <div className='flex flex-col items-center justify-center p-6'>
            <h3 className='font-medium font-gray-800 text-lg'>
              Monitoring Points
            </h3>
            <div className='flex items-baseline'>
              <p className='text-5xl text-gray-800 font-semibold'>23</p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
export default Overview;
