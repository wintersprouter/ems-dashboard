import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

function Root() {
  return (
    <main className='bg-gray-100 flex flex-row h-screen max-w-full'>
      <Sidebar />
      <section className='flex-grow m-4'>
        <Outlet />
      </section>
    </main>
  );
}
export default Root;
