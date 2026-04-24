import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";
import { labsData, labFeatures } from "../data/labsData";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55 },
  }),
};

const Home = () => {
  const labs = Object.values(labsData);
  const { user } = useAuth();

  const getProtectedPath = (path) => (user ? path : "/register");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SimulabNavbar />

      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[640px] h-[640px] rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[560px] h-[560px] rounded-full bg-accent/6 blur-3xl pointer-events-none" />

      <section className="relative pt-36 pb-24 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass glow-border mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-display text-primary tracking-wide">
              Interactive Virtual Labs
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-7"
          >
            Learn by Doing with{" "}
            <span className="text-gradient">SIMULAB</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform your engineering education with interactive experiments,
            real-time simulations, and hands-on practice across DSA, DBMS, DTSP,
            and VLSI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={getProtectedPath("/labs")}>
              <Button
                variant="hero"
                size="lg"
                className="font-display text-base gap-2 px-9 min-w-[260px]"
              >
                Start Experimenting <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/register">
              <Button
                variant="hero-outline"
                size="lg"
                className="font-display text-base px-9 min-w-[210px]"
              >
                Create Account
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex justify-center gap-10 sm:gap-16 lg:gap-20 mt-16 flex-wrap"
          >
            {[
              { value: "4", label: "Labs" },
              { value: "10+", label: "Experiments" },
              { value: "Free", label: "Access" },
            ].map((stat) => (
              <div key={stat.label} className="text-center min-w-[90px]">
                <div className="font-display text-4xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1.5 tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl font-bold mb-4"
            >
              Why Choose <span className="text-gradient">SIMULAB</span>?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg"
            >
              Everything you need for practical, interactive engineering education.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {labFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="glass rounded-2xl p-6 hover:glow-border transition-all duration-500 group"
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl font-bold mb-4"
            >
              Explore Our <span className="text-gradient">Labs</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg"
            >
              Interactive virtual laboratories across key engineering disciplines.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labs.map((lab, i) => (
              <motion.div
                key={lab.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl p-8 group hover:glow-border transition-all duration-500 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `hsl(${lab.color})` }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{lab.icon}</span>
                      <div>
                        <h3 className="font-display text-xl font-bold">
                          {lab.title}
                        </h3>
                        <span className="text-xs text-muted-foreground tracking-wide">
                          {lab.experiments.length} experiments
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {lab.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {lab.experiments.slice(0, 3).map((exp) => (
                      <span
                        key={exp.id}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {exp.name}
                      </span>
                    ))}
                    {lab.experiments.length > 3 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                        +{lab.experiments.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link to={getProtectedPath(`/labs/${lab.id}`)}>
                    <Button
                      variant="hero-outline"
                      size="sm"
                      className="gap-2 font-display"
                    >
                      Open Lab <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="glass rounded-3xl p-10 sm:p-12 text-center glow-border relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <FlaskConical className="w-12 h-12 text-primary mx-auto mb-6 animate-float" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                Join SIMULAB and get instant access to virtual labs,
                simulations, and interactive engineering experiments.
              </p>
              <Link to="/register">
                <Button
                  variant="hero"
                  size="lg"
                  className="font-display gap-2 px-10"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <span className="font-display text-gradient font-semibold">
            SIMULAB
          </span>{" "}
          — Interactive Virtual Labs for Engineering Education
        </div>
      </footer>
    </div>
  );
};

export default Home;