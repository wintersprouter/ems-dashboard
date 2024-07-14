import Sidebar from "../components/sidebar";
import StatisticsCards from "../components/statistics-cards";
function Overview() {
  return (
    <>
      <Sidebar />
      <section className='absolute top-20 left-0 lg:left-56 lg:top-[88px] flex-1 flex-grow flex-col w-full mx-auto lg:max-w-[1270px]'>
        <StatisticsCards />
      </section>
    </>
  );
}
export default Overview;
