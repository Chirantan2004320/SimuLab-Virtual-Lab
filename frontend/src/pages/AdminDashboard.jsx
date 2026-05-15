import React, { useEffect, useState, useCallback} from "react";
import axios from "axios";

import { motion } from "framer-motion";

import {
  ShieldCheck,
  Users,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Trash2,
  Plus,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";
import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [creatingFaculty, setCreatingFaculty] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/analytics`
      );

      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/users`
      );

      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchAnalytics(),
        fetchUsers(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  loadDashboard();
}, [loadDashboard]);


  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/users/${id}`
      );

      await loadDashboard();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();

    try {
      setCreatingFaculty(true);

      await axios.post(
        `${API_BASE_URL}/api/admin/create-faculty`,
        facultyForm
      );

      alert("Faculty created successfully");

      setFacultyForm({
        name: "",
        email: "",
        password: "",
      });

      await loadDashboard();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create faculty"
      );
    } finally {
      setCreatingFaculty(false);
    }
  };

  const statCards = analytics
    ? [
        {
          title: "Total Users",
          value: analytics.totalUsers,
          icon: Users,
          color: "text-primary",
        },
        {
          title: "Students",
          value: analytics.students,
          icon: GraduationCap,
          color: "text-accent",
        },
        {
          title: "Faculty",
          value: analytics.faculty,
          icon: ShieldCheck,
          color: "text-violet-400",
        },
        {
          title: "Labs",
          value: analytics.labs,
          icon: FlaskConical,
          color: "text-cyan-400",
        },
        {
          title: "Experiments",
          value: analytics.experiments,
          icon: BookOpen,
          color: "text-orange-400",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <ShieldCheck className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Admin Panel
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Admin Dashboard
            </h1>

            <p className="text-muted-foreground text-lg">
              Manage faculty accounts, users,
              analytics, labs, and platform access.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* Analytics Cards */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
                {statCards.map((card) => (
                  <div
                    key={card.title}
                    className="glass rounded-2xl p-6"
                  >
                    <card.icon
                      className={`w-8 h-8 ${card.color} mb-4`}
                    />

                    <h3 className="font-display text-3xl font-bold">
                      {card.value}
                    </h3>

                    <p className="text-muted-foreground mt-2">
                      {card.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* Create Faculty */}

              <div className="glass rounded-3xl p-8 mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <Plus className="w-5 h-5 text-primary" />

                  <h2 className="font-display text-3xl font-bold">
                    Create Faculty
                  </h2>
                </div>

                <form
                  onSubmit={handleCreateFaculty}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Faculty Name"
                    required
                    value={facultyForm.name}
                    onChange={(e) =>
                      setFacultyForm({
                        ...facultyForm,
                        name: e.target.value,
                      })
                    }
                    className="bg-secondary/40 border border-border rounded-xl px-4 py-3 outline-none"
                  />

                  <input
                    type="email"
                    placeholder="Faculty Email"
                    required
                    value={facultyForm.email}
                    onChange={(e) =>
                      setFacultyForm({
                        ...facultyForm,
                        email: e.target.value,
                      })
                    }
                    className="bg-secondary/40 border border-border rounded-xl px-4 py-3 outline-none"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={facultyForm.password}
                    onChange={(e) =>
                      setFacultyForm({
                        ...facultyForm,
                        password: e.target.value,
                      })
                    }
                    className="bg-secondary/40 border border-border rounded-xl px-4 py-3 outline-none"
                  />

                  <div className="md:col-span-3">
                    <Button
                      type="submit"
                      variant="hero"
                      disabled={creatingFaculty}
                    >
                      {creatingFaculty
                        ? "Creating..."
                        : "Create Faculty"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Users Table */}

              <div className="glass rounded-3xl p-8 overflow-x-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-primary" />

                  <h2 className="font-display text-3xl font-bold">
                    All Users
                  </h2>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4">
                        Name
                      </th>

                      <th className="text-left py-4">
                        Email
                      </th>

                      <th className="text-left py-4">
                        Role
                      </th>

                      <th className="text-left py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border/40"
                      >
                        <td className="py-4">
                          {user.name}
                        </td>

                        <td className="py-4">
                          {user.email}
                        </td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              user.role === "admin"
                                ? "bg-red-500/20 text-red-400"
                                : user.role === "faculty"
                                ? "bg-violet-500/20 text-violet-400"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-4">
                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                handleDeleteUser(user.id)
                              }
                              className="text-red-400 hover:text-red-300 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;