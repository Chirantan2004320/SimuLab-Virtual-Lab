import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";
import { useNavigate } from "react-router-dom";



const labsPreview = [
  {
    title: "DSA Lab",
    description:
      "Practice core data structures and algorithms through interactive experiments and guided problem-solving.",
    icon: "🧠",
    features: ["Sorting", "Queue", "Linked List"],
    link: "/labs/dsa"
  },
  {
    title: "DTSP Lab",
    description:
      "Explore signal processing concepts such as DFT, IDFT, convolution, pole-zero analysis, and FIR filters.",
    icon: "📊",
    features: ["DFT", "Convolution", "FIR Analysis"],
    link: "/labs/dtsp"
  },
  {
    title: "DSD Lab",
    description:
      "Learn digital system design using logic gates, adders, multiplexers, flip-flops, and timing concepts.",
    icon: "🔧",
    features: ["Logic Gates", "Adders", "Flip-Flops"],
    link: "/labs/dsd"
  },
  {
    title: "DVLSI Lab",
    description:
      "Study MOSFETs, CMOS inverter behavior, layout concepts, lambda rules, and CMOS NOR gate implementation.",
    icon: "🧪",
    features: ["MOSFET", "CMOS Inverter", "Layout"],
    link: "/labs/dvlsi"
  }
];

function getFeatures(instituteMode) {
  const base = [
    {
      title: "Structured Experiments",
      description:
        "Well-designed virtual experiments aligned with engineering lab curricula.",
      icon: "📘"
    },
    {
      title: "Interactive Simulations",
      description:
        "Understand concepts visually through hands-on simulation instead of static theory alone.",
      icon: "⚙️"
    },
    {
      title: "AI Learning Assistant",
      description:
        "Get guided academic support for concepts, interpretation, and learning flow.",
      icon: "🤖"
    },
    {
      title: "Multi-Subject Platform",
      description:
        "Access multiple laboratories like DSA, DTSP, DSD, and DVLSI from one platform.",
      icon: "🧩"
    }
  ];

  if (!instituteMode) {
    base.push({
      title: "Scalable for More Labs",
      description:
        "Built to support future virtual labs and more advanced academic experiments.",
      icon: "🚀"
    });
  }

  return base;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const Home = ({ instituteMode = false }) => {
  const navigate = useNavigate();
  const features = getFeatures(instituteMode);

  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="hero-maxwidth">
          <motion.div
            className="hero-box"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="hero-inner">
              <span className="hero-badge">Welcome To SimuLab</span>

              <h1
                className="hero-title"
                style={{ marginTop: "0.5rem", marginBottom: "0.7rem" }}
              >
                <span className="gradient-text">SimuLab: Virtual Lab</span>
              </h1>

              <p
                className="hero-description"
                style={{
                  fontSize: "1.12rem",
                  fontWeight: 500,
                  marginBottom: "2.2rem"
                }}
              >
                A unified virtual laboratory platform for interactive engineering
                experiments across Data Structures, Signal Processing, Digital System Design,
                and Digital VLSI.
              </p>

              <div
                className="home-buttons"
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap"
                }}
              >
                <Link
                  to="/login"
                  className="btn secondary"
                  style={{ minWidth: 150, fontWeight: 600, fontSize: "1.02rem" }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn primary"
                  style={{ minWidth: 170, fontWeight: 600, fontSize: "1.02rem" }}
                >
                  Register
                </Link>

                <button
                  className="btn secondary"
                  style={{ minWidth: 170, fontWeight: 600, fontSize: "1.02rem" }}
                  onClick={() => {
                    const isLoggedIn = localStorage.getItem("user");

                    if (isLoggedIn) {
                      navigate("/dashboard");
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  Explore Labs
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="features-section">
        <div className="features-maxwidth">
          <motion.h2
            {...fadeUp}
            className="features-title"
            style={{
              textAlign: "center",
              marginBottom: "2.2rem",
              fontWeight: 700,
              fontSize: "2.1rem",
              letterSpacing: "-0.01em"
            }}
          >
            Why Choose SimuLab?
          </motion.h2>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                {...fadeUp}
                transition={{ delay: idx * 0.1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 180
                }}
              >
                <span
                  className="feature-icon"
                  style={{ fontSize: "2.2rem", marginBottom: 12 }}
                >
                  {feature.icon}
                </span>
                <h3
                  className="feature-heading"
                  style={{ fontWeight: 600, fontSize: "1.13rem", marginBottom: 6 }}
                >
                  {feature.title}
                </h3>
                <p
                  className="feature-desc"
                  style={{
                    textAlign: "center",
                    fontSize: "0.98rem",
                    color: "var(--text-muted)"
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="labs-preview">
        <div className="labs-maxwidth">
          <motion.h2
            {...fadeUp}
            className="labs-title"
            style={{
              textAlign: "center",
              marginBottom: "2.2rem",
              fontWeight: 700,
              fontSize: "2.1rem",
              letterSpacing: "-0.01em"
            }}
          >
            Available Labs
          </motion.h2>

          <div className="labs-grid">
            {labsPreview.map((lab, idx) => (
              <motion.div
                key={lab.title}
                className="lab-card"
                {...fadeUp}
                transition={{ delay: idx * 0.12 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 270
                }}
              >
                <div
                  className="lab-card-header"
                  style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
                >
                  <span
                    className="lab-icon"
                    style={{ fontSize: "2rem", marginRight: 10 }}
                  >
                    {lab.icon}
                  </span>
                  <h3 className="lab-title" style={{ fontWeight: 600, fontSize: "1.13rem" }}>
                    {lab.title}
                  </h3>
                </div>

                <p
                  className="lab-description"
                  style={{
                    marginBottom: 12,
                    color: "var(--text-muted)",
                    fontSize: "0.98rem"
                  }}
                >
                  {lab.description}
                </p>

                <div
                  className="lab-features"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 8px",
                    marginBottom: 10
                  }}
                >
                  {lab.features.map((feature) => (
                    <span
                      key={feature}
                      className="lab-feature-tag"
                      style={{ fontSize: "0.85rem", padding: "0.38rem 0.7rem" }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div style={{ flex: 1 }} />

                <Link
                  to={lab.link}
                  className="lab-link"
                  style={{
                    marginTop: "auto",
                    fontWeight: 600,
                    fontSize: "1.01rem",
                    borderRadius: 8,
                    minWidth: 120,
                    textAlign: "center"
                  }}
                >
                  Enter Lab <span className="arrow">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div
          className="cta-content"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "var(--space-24)"
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 12 }}>
            Start Your Virtual Lab Journey
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.08rem",
              marginBottom: 24
            }}
          >
            Create an account, explore virtual experiments, and build stronger
            conceptual understanding through interactive practice.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            <Link
              to="/register"
              className="btn primary cta-button"
              style={{ minWidth: 180, fontWeight: 600, fontSize: "1.05rem" }}
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="btn secondary"
              style={{ minWidth: 160, fontWeight: 600, fontSize: "1.05rem" }}
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;