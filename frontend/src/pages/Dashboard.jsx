import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ instituteMode = false }) => {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div>
          <h2>{instituteMode ? "Institute SimuLab: Virtual Lab" : "SimuLab: Virtual Lab"}</h2>
          <nav>
            <Link to="/dashboard" className="active">🏠 Dashboard</Link>
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

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header className="dashboard-topnav">
          <h3>
            {instituteMode
              ? "Welcome to Institute SimuLab: Virtual Lab"
              : "Welcome to SimuLab: Virtual Lab"}
          </h3>
          <div className="user-profile">
            <img
              src="https://randomuser.me/api/portraits/lego/5.jpg"
              alt="User Avatar"
            />
          </div>
        </header>

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