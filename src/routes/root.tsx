import { Outlet } from "react-router-dom";
import Header from "../components/header";

function Root() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
export default Root;
