import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";
import PaymentDialog from "../components/PaymentDialog";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.42 },
  }),
};

export default function DBMSLabIndex() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const experiments = [
    {
      _id: "sql-basics",
      name: "SQL Basics Simulator",
      path: "/labs/dbms/sql-basics",
      desc: "Learn SELECT, WHERE, ORDER BY and LIMIT through interactive query simulation",
      icon: "🗄️",
      color: "198 93% 60%",
      isPremium: false,
      price: 0,
      defaultDurationDays: 30,
    },
    {
      _id: "joins",
      name: "SQL Joins Visualizer",
      path: "/labs/dbms/joins",
      desc: "Understand INNER JOIN and OUTER JOIN with visual table matching",
      icon: "🔗",
      color: "160 84% 39%",
      isPremium: false,
      price: 0,
      defaultDurationDays: 30,
    },
    {
      _id: "normalization",
      name: "Normalization Lab",
      path: "/labs/dbms/normalization",
      desc: "Convert tables from 1NF to 3NF step by step",
      icon: "🧩",
      color: "38 92% 50%",
      isPremium: true,
      price: 49,
      defaultDurationDays: 30,
    },
    {
      _id: "transactions",
      name: "Transactions Lab",
      path: "/labs/dbms/transactions",
      desc: "Visualize commit, rollback, and ACID properties",
      icon: "💳",
      color: "262 83% 58%",
      isPremium: true,
      price: 59,
      defaultDurationDays: 30,
    },
    {
      _id: "indexing",
      name: "Indexing Lab",
      path: "/labs/dbms/indexing",
      desc: "Compare search without index and with index using visual lookup simulation",
      icon: "📇",
      color: "190 95% 39%",
      isPremium: true,
      price: 39,
      defaultDurationDays: 30,
    },
    {
      _id: "concurrency",
      name: "Concurrency Control Lab",
      path: "/labs/dbms/concurrency",
      desc: "Visualize Lost Update, Dirty Read, and Locking with concurrent transactions",
      icon: "🔒",
      color: "351 89% 60%",
      isPremium: true,
      price: 69,
      defaultDurationDays: 30,
    },
    {
      _id: "er-modeling",
      name: "ER Modelling Lab",
      path: "/labs/dbms/er-modeling",
      desc: "Visualize entities, attributes, relationships, and ER to relational mapping",
      icon: "🧭",
      color: "172 72% 40%",
      isPremium: true,
      price: 45,
      defaultDurationDays: 30,
    },
    {
      _id: "query-optimization",
      name: "Query Optimization Lab",
      path: "/labs/dbms/query-optimization",
      desc: "Visualize selection pushdown, projection pushdown, and join order optimization",
      icon: "⚡",
      color: "24 95% 53%",
      isPremium: true,
      price: 79,
      defaultDurationDays: 30,
    },
  ];

  const handleBuyPremium = (exp) => {
    setSelectedExp(exp);
    setShowPaymentDialog(true);
    setMessage("");
  };

  const handlePaymentSuccess = () => {
    setMessage(`Access granted for ${selectedExp?.name || "premium experiment"}.`);
  };

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
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/10" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold">
                <span className="text-gradient">DBMS Lab</span>
              </h1>
            </div>

            <p className="text-muted-foreground text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
              Choose an experiment to begin. Each experiment contains an interactive
              visual demo and a short quiz.
            </p>

            {message ? (
              <div className="mt-6 max-w-2xl mx-auto text-left text-sm text-green-200 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                {message}
              </div>
            ) : null}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {experiments.map((exp, i) => (
              <motion.div
                key={exp._id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl overflow-hidden group hover:glow-border transition-all duration-500"
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(${exp.color}), hsl(${exp.color} / 0.35))`,
                  }}
                />

                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/65 flex items-center justify-center text-3xl shadow-inner shrink-0">
                      {exp.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[1.55rem] leading-tight font-bold">
                        {exp.name}
                      </h3>

                      <div className="flex gap-2 flex-wrap mt-3">
                        {exp.isPremium ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.76rem] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              <Crown className="w-3 h-3" />
                              Premium
                            </span>
                            <span className="px-3 py-1 rounded-full text-[0.76rem] font-semibold bg-white/5 text-foreground/85 border border-white/10">
                              ₹{exp.price}
                            </span>
                          </>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[0.76rem] font-semibold bg-green-500/10 text-green-300 border border-green-500/20">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed min-h-[72px] mb-6">
                    {exp.desc}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3">
                    <Link to={exp.path}>
                      <Button
                        variant="hero"
                        className="font-display gap-2 rounded-xl px-6 py-5 text-sm"
                      >
                        Start Experiment <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    {exp.isPremium ? (
                      <button
                        type="button"
                        onClick={() => handleBuyPremium(exp)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-amber-300 border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 transition-all duration-300 shadow-sm"
                      >
                        Buy Premium
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showPaymentDialog && selectedExp ? (
        <PaymentDialog
          selectedExp={selectedExp}
          user={user}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedExp(null);
          }}
          isLoading={isLoading}
          setLoading={setLoading}
          setMessage={setMessage}
        />
      ) : null}
    </div>
  );
}