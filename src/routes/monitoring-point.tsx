import Charts from "../components/charts";
import Sidebar from "../components/sidebar";
import StatisticsCards from "../components/statistics-cards";
import ToolBar from "../components/toolbar";

function MonitoringPoint() {
  return (
    <section className='flex container'>
      <>
        <Sidebar />
        <ToolBar />
        <section className='relative top-0 left-0 lg:left-48 lg:top-4  flex-col w-full mx-auto'>
          <StatisticsCards />
          <Charts />
        </section>
      </>
    </section>
  );
}
export default MonitoringPoint;
