import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await login(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[420px] h-[420px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/10">
              <FlaskConical className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">
              SIMULAB
            </span>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Log in to access your virtual labs
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 glow-border space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="font-display">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-secondary/60 border-border/50 focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-display">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-secondary/60 border-border/50 focus-visible:border-primary"
              />
            </div>
          </div>

          {error ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          <Button
            variant="hero"
            className="w-full font-display gap-2"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Logging In..." : "Log In"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;