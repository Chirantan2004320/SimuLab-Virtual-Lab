import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = ({ instituteMode = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);

  const labs = [
    {
      name: "DSA Lab",
      path: "/labs/dsa",
      desc: "Data Structures & Algorithms",
      icon: "🧠",
    },
    {
      name: "DTSP Lab",
      path: "/labs/dtsp",
      desc: "Discrete Time Signal Processing",
      icon: "📊",
    },
    {
      name: "DSD Lab",
      path: "/labs/dsd",
      desc: "Digital System Design",
      icon: "🔧",
    },
    {
      name: "DVLSI Lab",
      path: "/labs/dvlsi",
      desc: "Digital VLSI Design",
      icon: "🧪",
    },
  ];

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);

    if (showDropdown) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* 🔹 Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <h2>
            {instituteMode
              ? "Institute SimuLab: Virtual Lab"
              : "SimuLab: Virtual Lab"}
          </h2>
          <nav>
            <Link to="/dashboard" className="active">
              🏠 Dashboard
            </Link>
            <Link to="/profile">👤 Profile</Link>
            <Link to="/labs/dsa">🧠 DSA Lab</Link>
            <Link to="/labs/dtsp">📊 DTSP Lab</Link>
            <Link to="/labs/dsd">🔧 DSD Lab</Link>
            <Link to="/labs/dvlsi">🧪 DVLSI Lab</Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="logout-link">
          🚪 Logout
        </button>
      </aside>

      {/* 🔹 Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 🔹 Top Navbar */}
        <header className="dashboard-topnav">
          <h3>
            {instituteMode
              ? "Welcome to Institute SimuLab: Virtual Lab"
              : "Welcome to SimuLab: Virtual Lab"}
          </h3>

          {/* 🔥 USER PROFILE DROPDOWN */}
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <img
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka"
              alt="User Avatar"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "2px solid #38bdf8",
              }}
            />

            {/* 🔽 Dropdown */}
            {showDropdown && (
              <div className="profile-dropdown">
                <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {user?.name || "User"}
                </p>

                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.7,
                    marginBottom: "10px",
                  }}
                >
                  {user?.email || "email@example.com"}
                </p>

                <button
                  className="btn danger"
                  style={{ width: "100%" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 🔹 Content */}
        <section className="dashboard-content">
          {labs.map((lab, index) => (
            <div key={index} className="card dashboard-lab-card">
              <h2>
                <span style={{ marginRight: "8px" }}>{lab.icon}</span>
                {lab.name}
              </h2>

              <p>{lab.desc}</p>

              <button
                onClick={() => navigate(lab.path)}
                className="dashboard-lab-btn"
              >
                Open Lab
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;