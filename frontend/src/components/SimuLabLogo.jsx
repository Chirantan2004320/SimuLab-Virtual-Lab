import React from "react";
import "./SimuLabLogo.css";

export default function SimuLabLogo({
  size = 44,
  showText = true,
  variant = "default",
  loading = false
}) {
  return (
    <div className={`simulab-logo-wrap ${variant} ${loading ? "loading" : ""}`}>
      <div
        className="simulab-logo-orb"
        style={{ width: size, height: size, minWidth: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="simulab-logo-svg"
          role="img"
          aria-label="SimuLab Logo"
        >
          <defs>
            <linearGradient id="simulabGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <linearGradient id="liquidGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="45" className="logo-ring" />

          <path
            className="logo-flask-outline"
            d="M40 18h20M45 18v22L28 72c-3 6 1 12 8 12h28c7 0 11-6 8-12L55 40V18"
          />

          <path
            className="logo-liquid"
            d="M36 70c5-6 10-3 14-6 7-5 11 2 17 5l4 8c1.5 3-.7 6-4.5 6h-33c-3.8 0-6-3-4.5-6l7-7z"
          />

          <circle className="bubble bubble-1" cx="43" cy="63" r="3" />
          <circle className="bubble bubble-2" cx="58" cy="70" r="2.5" />
          <circle className="bubble bubble-3" cx="51" cy="55" r="2" />

          <path
            className="logo-spark"
            d="M72 25l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5z"
          />
        </svg>
      </div>

      {showText && (
        <div className="simulab-logo-text">
          <span>SimuLab</span>
          <small>Virtual Labs</small>
        </div>
      )}
    </div>
  );
}