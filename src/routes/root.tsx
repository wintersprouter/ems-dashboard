import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

function Root() {
  return (
    <main className='bg-gray-100 flex flex-row h-screen'>
      <Sidebar />
      <Header />
      <Outlet />
    </main>
  );
}
export default Root;
