import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskConical, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = (user) => [
  { label: "Home", path: "/" },
  { label: "Labs", path: "/labs" },
  ...(user ? [{ label: "Dashboard", path: "/dashboard" }] : []),
];


const SimulabNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    return user?.name || user?.fullName || user?.username || "User";
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/45 backdrop-blur-2xl"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
            <FlaskConical className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-[2rem] font-bold text-gradient tracking-tight">
            SIMULAB
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {navItems(user).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.label} to={item.path}>
                <Button
                  variant="ghost"
                  className={`font-display text-base px-5 py-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-[0_0_10px_rgba(34,211,238,0.12)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-base text-muted-foreground hover:text-foreground font-display px-4"
                >
                  Log in
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  variant="hero"
                  size="sm"
                  className="font-display px-6 py-2.5 text-base"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <Button
                  variant="ghost"
                  className="font-display text-base px-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>

              <div className="flex items-center gap-3 rounded-full border border-border/40 bg-secondary/40 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Logged in
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="font-display text-base px-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden px-4 pb-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(8, 15, 30, 0.88)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="flex flex-col pt-3">
            {navItems(user).map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-3 font-display text-sm ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 font-display text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  Profile
                </Link>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/40 px-3 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">Logged in</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full mt-3 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-3 mt-4">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>

                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="hero" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default SimulabNavbar;