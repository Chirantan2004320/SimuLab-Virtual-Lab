import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 🔥 TOKEN VALIDATION FUNCTION
const isTokenValid = () => {
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return false;

    // 🧠 HANDLE OLD STRING TOKEN
    if (raw.startsWith("eyJ")) {
      return true; // fallback (or return false if strict)
    }

    const data = JSON.parse(raw);

    return Date.now() < data.expiry;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user on refresh (WITH TOKEN CHECK)
  useEffect(() => {
    let userData = null;

    try {
      const storedUser = localStorage.getItem("user");
      userData = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid user in localStorage → clearing...");
      localStorage.removeItem("user");
    }

    let tokenData = null;

    try {
      tokenData = JSON.parse(localStorage.getItem("token"));
    } catch {
      tokenData = null;
    }

    // ✅ VALID TOKEN CHECK
    if (tokenData && isTokenValid()) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokenData.token}`;

      if (userData) setUser(userData);
    } else {
      // ❌ TOKEN EXPIRED → CLEAR EVERYTHING
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false);
  }, []);



  // 🔹 Register
  const register = async (name, email, password) => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      return {
        success: true,
        message: "Registration successful. Please login."
      };
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  };

  // 🔹 Login (UPDATED WITH EXPIRY)
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = res.data;

      // 🔥 STORE TOKEN WITH EXPIRY (20 sec)
      const tokenData = {
        token: token,
        expiry: Date.now() + 2 * 60 * 1000
      };

      localStorage.setItem("token", JSON.stringify(tokenData));
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Update state
      setUser(user);

      // ✅ Set axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};