import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import ErrorPage from "./error-page";
import Home from "./routes/home";
import Login from "./routes/login";
import MonitoringPoint from "./routes/monitoring-point";
import Overview from "./routes/overview";
import Root from "./routes/root";
import Tree from "./routes/tree";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <Home />,
          path: "/",
          index: true,
        },
      ],
    },
    {
      element: <Root />,
      path: "dashboard",
      children: [
        {
          path: "",
          element: <Navigate to='overview' />,
        },
        {
          path: "login",
          element: <Login />,
          index: true,
        },
        {
          element: <Overview />,
          path: "overview",
        },
        {
          element: <Tree />,
          path: "tree",
        },
        {
          element: <MonitoringPoint />,
          path: "monitoring-point",
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
