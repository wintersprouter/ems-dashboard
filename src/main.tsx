import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import "./index.css";
import Home from "./routes/home";
import Login from "./routes/login";
import MonitoringPoint from "./routes/monitoring-point";
import Overview from "./routes/overview";
import Root from "./routes/root";

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
        path: "login",
        element: <Login />,
        index: true,
      },
      {
        element: <Overview />,
        path: "overview",
      },
      {
        element: <MonitoringPoint />,
        path: "monitoring-point",
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
