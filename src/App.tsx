import {
  createBrowserRouter,
  LoaderFunction,
  LoaderFunctionArgs,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/authProvider";
import ErrorPage from "./error-page";
import Home from "./routes/home";
import Login from "./routes/login";
import MonitoringPoint from "./routes/monitoring-point";
import Overview from "./routes/overview";
import Root from "./routes/root";
import Tree from "./routes/tree";

export function Fallback() {
  return <p>Performing initial data load</p>;
}

async function loginLoader() {
  AuthProvider.getAuthStatus();
  if (AuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

async function requireAuth() {
  await AuthProvider.getAuthStatus();
  if (!AuthProvider.isAuthenticated) {
    return redirect("/dashboard/login");
  }
  return null;
}

function ProtectedRoute({
  element,
  loader,
}: {
  element: JSX.Element;
  loader?: LoaderFunction;
}) {
  return {
    element,
    loader: async (args: LoaderFunctionArgs) => {
      const redirectResult = requireAuth();
      if (redirectResult) {
        return redirectResult;
      }
      if (loader) {
        return await loader(args);
      }
      return null;
    },
  };
}

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
          ...ProtectedRoute({ element: <Navigate to='overview' /> }),
        },
        {
          path: "login",
          element: <Login />,
          loader: loginLoader,
          index: true,
        },
        {
          ...ProtectedRoute({ element: <Overview /> }),
          path: "overview",
        },
        {
          ...ProtectedRoute({ element: <Tree /> }),
          path: "tree",
        },
        {
          ...ProtectedRoute({ element: <MonitoringPoint /> }),
          path: "monitoring-point",
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
