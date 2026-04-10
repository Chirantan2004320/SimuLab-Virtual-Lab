// routes/protectedRoutes.js

import Dashboard from "../pages/dashboard/Dashboard.jsx";
import StudentDashboard from "../pages/dashboard/StudentDashboard.jsx";
import FacultyPanel from "../pages/dashboard/FacultyPanel.jsx";

export const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/student-dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/faculty",
    element: <FacultyPanel />,
  },
];