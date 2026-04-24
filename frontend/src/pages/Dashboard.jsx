import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FlaskConical,
  BarChart3,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";
import { useAuth } from "../context/AuthContext";
import ProgressTracker from "../components/ProgressTracker";
import Leaderboard from "../components/LeaderBoard.jsx";
import Certificate from "../components/Certificate";

const dashboardLabs = [
  {
    id: "dsa",
    title: "Data Structures Lab",
    subtitle: "7 experiments available",
    description:
      "Master data structures and algorithms through interactive visualizations and hands-on coding practice.",
    icon: "🔍",
    color: "185 80% 50%",
    route: "/labs/dsa",
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    subtitle: "8 experiments available",
    description:
      "Practice SQL, normalization, transactions, indexing, and core database concepts.",
    icon: "💾",
    color: "260 70% 60%",
    route: "/labs/dbms",
  },
  {
    id: "os",
    title: "Operating Systems Lab",
    subtitle: "5 experiments available",
    description:
      "Learn CPU scheduling, synchronization, memory management, deadlock, and disk scheduling.",
    icon: "🖥️",
    color: "330 75% 58%",
    route: "/labs/os",
  },
  {
    id: "dtsp",
    title: "Digital Signal Processing",
    subtitle: "8 experiments available",
    description:
      "Explore transforms, convolution, pole-zero analysis, FIR design, and filtering concepts.",
    icon: "📊",
    color: "150 60% 45%",
    route: "/labs/dtsp",
  },
  {
    id: "dsd",
    title: "Digital System Design",
    subtitle: "8 experiments available",
    description:
      "Work with logic gates, adders, multiplexers, flip-flops, counters, and timing concepts.",
    icon: "🔧",
    color: "30 90% 55%",
    route: "/labs/dsd",
  },
  {
    id: "dvlsi",
    title: "Digital VLSI Design",
    subtitle: "9 experiments available",
    description:
      "Study CMOS, MOSFETs, layout rules, SRAM cells, transmission gates, and circuit behavior.",
    icon: "⚡",
    color: "42 95% 58%",
    route: "/labs/dvlsi",
  },
];

const stats = [
  {
    icon: FlaskConical,
    label: "Total Labs",
    value: dashboardLabs.length,
    color: "text-primary",
  },
  {
    icon: BookOpen,
    label: "Experiments",
    value: "45+",
    color: "text-accent",
  },
  {
    icon: BarChart3,
    label: "Completed",
    value: "0",
    color: "text-primary",
  },
  {
    icon: Clock,
    label: "Hours Spent",
    value: "0",
    color: "text-accent",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45 },
  }),
};

const Dashboard = ({ instituteMode = false }) => {
  const { user } = useAuth();

  const displayName =
    user?.name || user?.fullName || user?.username || "Learner";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SimulabNavbar />

      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border mb-6">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-display text-primary tracking-wide">
                    Learning Overview
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
                  {instituteMode ? "Institute Dashboard" : "Dashboard"}
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                  Welcome back,{" "}
                  <span className="text-foreground font-medium">
                    {displayName}
                  </span>
                  . Track your labs, monitor your learning journey, and continue
                  exploring interactive experiments.
                </p>
              </div>

              <Link to="/profile">
                <Button variant="hero-outline" className="font-display gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl p-6 hover:glow-border transition-all duration-500"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                <div className="font-display text-4xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6 mb-14">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    Your <span className="text-gradient">Labs</span>
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Open a lab and continue your interactive learning journey.
                  </p>
                </div>

                <Link to="/labs">
                  <Button variant="hero-outline" className="font-display gap-2">
                    View All Labs <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardLabs.map((lab, i) => (
                  <motion.div
                    key={lab.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i + 1}
                    className="glass rounded-2xl overflow-hidden group hover:glow-border transition-all duration-500"
                  >
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(${lab.color}), hsl(${lab.color} / 0.35))`,
                      }}
                    />

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{lab.icon}</span>
                          <div>
                            <h3 className="font-display text-xl font-bold leading-tight">
                              {lab.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {lab.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {lab.description}
                      </p>

                      <Link to={lab.route}>
                        <Button
                          variant="hero-outline"
                          className="font-display gap-2"
                        >
                          Open Lab <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 h-fit">
              <ProgressTracker />
              <Leaderboard />
              <Certificate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;