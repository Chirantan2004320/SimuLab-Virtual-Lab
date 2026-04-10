import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { labRoutes } from "./routes/labRoutes";

import AIAssistant from "./components/AIAssistant.jsx";

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  const isTokenValid = () => {
    try {
      const data = JSON.parse(localStorage.getItem("token"));
      return data && Date.now() < data.expiry;
    } catch {
      return false;
    }
  };

  return user && isTokenValid()
    ? children
    : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();

  // 🌐 Institute Mode
  const instituteMode = process.env.REACT_APP_INSTITUTE_MODE === "true";

  // 🧠 Context Detection (same as your logic)
  const getCurrentContext = () => {
    const path = location.pathname;

    if (path.includes("/labs/dsa")) return { page: "labs/dsa" };
    if (path.includes("/labs/stack")) return { page: "labs/stack" };
    if (path.includes("/labs/dtsp")) return { page: "labs/dtsp" };
    if (path.includes("/labs/dsd")) return { page: "labs/dsd" };
    if (path.includes("/labs/dvlsi")) return { page: "labs/dvlsi" };
    if (path.includes("/labs/dbms")) return { page: "labs/dbms" };
    if (path === "/") return { page: "home" };

    return { page: path.substring(1) };
  };

  const { page } = getCurrentContext();

  return (
    <>
      <Routes>
        {/* 🌐 Public Routes */}
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.path === "/"
                ? React.cloneElement(route.element, { instituteMode })
                : route.element
            }
          />
        ))}

        {/* 🔒 Protected Routes */}
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                {React.cloneElement(route.element, { instituteMode })}
              </ProtectedRoute>
            }
          />
        ))}

        {/* 🧪 Lab Routes */}
        {labRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* 🚫 404 */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Routes>

      {/* 🤖 AI Assistant */}
      <AIAssistant currentPage={page} instituteMode={instituteMode} />
    </>
  );
}

// 🚀 Main App
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}