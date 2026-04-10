// routes/publicRoutes.js

import Home from "../pages/home/Home.jsx";
import Login from "../pages/auth/Login.js";
import Register from "../pages/auth/Register.js";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];