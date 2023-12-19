import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import Landing from "./Layouts/Landing";
import { useAuth } from "./Auth/Auth";
import AboutUs from "./Layouts/Landing/AboutUs";
import ContactUs from "./Layouts/Landing/ContactUs";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Layouts/Landing/Home/Home";
const Dashboard = React.lazy(() => import("./Layouts/Dashboard/Dashboard"));

function App() {
  const { loggedIn } = useAuth();
  const [firstLogin, setFirstLogin] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing setFirstLogin={setFirstLogin} />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <AboutUs />,
        },
        {
          path: "/contact",
          element: <ContactUs />,
        },
      ],
    },
  ]);
  return (
    <div>
      {loggedIn ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard firstLogin={firstLogin} />
        </Suspense>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
