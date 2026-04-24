import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  LogOut,
  LayoutDashboard,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.42 },
  }),
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName =
    user?.name || user?.fullName || user?.username || "SimuLab User";

  const email = user?.email || "No email available";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const profileStats = [
    {
      label: "Labs Available",
      value: "6",
      icon: FlaskConical,
      color: "text-primary",
    },
    {
      label: "Experiments",
      value: "45+",
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Account Status",
      value: "Active",
      icon: Shield,
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SimulabNavbar />

      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border mb-6">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-display text-primary tracking-wide">
                Account Overview
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
              Profile
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Manage your SimuLab account, review your details, and continue your
              learning journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 mb-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="glass rounded-3xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />

              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/10">
                    {initials}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display text-3xl font-bold mb-2">
                      {displayName}
                    </h2>

                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{email}</span>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Shield className="w-4 h-4 text-accent" />
                        <span>Authenticated SimuLab Account</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/dashboard">
                    <Button variant="hero-outline" className="font-display gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link to="/labs">
                    <Button variant="hero" className="font-display gap-2">
                      <FlaskConical className="w-4 h-4" />
                      Explore Labs
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="glass rounded-3xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-accent to-primary" />

              <div className="p-8">
                <h3 className="font-display text-2xl font-bold mb-5">
                  Quick Actions
                </h3>

                <div className="space-y-4">
                  <Link to="/dashboard" className="block">
                    <div className="rounded-2xl border border-border/50 bg-secondary/35 hover:bg-secondary/60 transition-all duration-300 px-5 py-4">
                      <p className="font-semibold">Go to Dashboard</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        View progress, stats, and recent labs.
                      </p>
                    </div>
                  </Link>

                  <Link to="/labs" className="block">
                    <div className="rounded-2xl border border-border/50 bg-secondary/35 hover:bg-secondary/60 transition-all duration-300 px-5 py-4">
                      <p className="font-semibold">Browse Labs</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Open DSA, DBMS, OS, DTSP, DSD, and DVLSI labs.
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 px-5 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <LogOut className="w-5 h-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-300">Logout</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sign out of your SimuLab account securely.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profileStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 2}
                className="glass rounded-2xl p-6 hover:glow-border transition-all duration-500"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                <div className="font-display text-3xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;