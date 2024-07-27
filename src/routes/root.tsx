import { Outlet } from "react-router-dom";
import Header from "../components/header";

function Root() {
  return (
    <main className='mx-auto'>
      <Header />
      <Outlet />
    </main>
  );
}
export default Root;
