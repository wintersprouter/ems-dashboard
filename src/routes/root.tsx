import { Outlet } from "react-router-dom";
import Header from "../components/header";

function Root() {
  return (
    <main className='bg-gray-100 h-screen max-w-full'>
      <Header />
      <section className='flex-grow m-4'>
        <Outlet />
      </section>
    </main>
  );
}
export default Root;
