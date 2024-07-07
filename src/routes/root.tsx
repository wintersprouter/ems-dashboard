import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

function Root() {
  return (
    <main className='bg-gray-100 flex flex-row h-screen'>
      <Sidebar />
      <section className='flex-grow'>
        <Outlet />
      </section>
    </main>
  );
}
export default Root;
