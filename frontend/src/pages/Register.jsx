import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await registerUser(name, email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] left-[-120px] w-[420px] h-[420px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

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
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join SIMULAB and start experimenting
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 glow-border space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="font-display">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-secondary/60 border-border/50 focus-visible:border-primary"
              />
            </div>
          </div>

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
            {submitting ? "Creating Account..." : "Create Account"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;