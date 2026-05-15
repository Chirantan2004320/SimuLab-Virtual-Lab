import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Bell,
  Send,
  Trash2,
} from "lucide-react";

import SimulabNavbar from "../components/SimulabNavbar";

import { Button } from "../components/ui/button";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const FacultyNotices = () => {
  const [notices, setNotices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [noticeLoading, setNoticeLoading] =
    useState(false);

  const [noticeForm, setNoticeForm] =
    useState({
      title: "",
      message: "",
    });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/faculty/notices`
      );

      setNotices(res.data.notices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setNoticeLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/faculty/notice`,
        noticeForm
      );

      alert("Notice published");

      setNoticeForm({
        title: "",
        message: "",
      });

      fetchNotices();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to publish notice"
      );
    } finally {
      setNoticeLoading(false);
    }
  };

  const handleDeleteNotice = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this notice?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/faculty/notice/${id}`
      );

      fetchNotices();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SimulabNavbar />

      <div className="pt-28 px-4 pb-20">
        <div className="container mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Bell className="w-4 h-4 text-primary" />

              <span className="text-sm font-display text-primary">
                Notices Management
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold mb-3">
              Faculty Notices
            </h1>

            <p className="text-muted-foreground text-lg">
              Publish and manage student announcements.
            </p>
          </div>

          {/* CREATE NOTICE */}

          <div className="glass rounded-3xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Publish Notice
              </h2>
            </div>

            <form
              onSubmit={handleNoticeSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Notice Title"
                required
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    title:
                      e.target.value,
                  })
                }
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Notice Message"
                required
                rows={6}
                value={noticeForm.message}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    message:
                      e.target.value,
                  })
                }
                className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3"
              />

              <Button
                type="submit"
                variant="hero"
                disabled={noticeLoading}
              >
                {noticeLoading
                  ? "Publishing..."
                  : "Publish Notice"}
              </Button>
            </form>
          </div>

          {/* NOTICES LIST */}

          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />

              <h2 className="font-display text-3xl font-bold">
                Published Notices
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-20">
                Loading notices...
              </div>
            ) : notices.length === 0 ? (
              <div className="text-muted-foreground py-10">
                No notices published yet.
              </div>
            ) : (
              <div className="space-y-6">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border border-border rounded-2xl p-6 bg-secondary/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold mb-2">
                          {notice.title}
                        </h3>

                        <p className="text-muted-foreground whitespace-pre-line">
                          {notice.message}
                        </p>

                        <p className="text-xs text-muted-foreground mt-4">
                          Published on{" "}
                          {new Date(
                            notice.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteNotice(
                            notice.id
                          )
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyNotices;