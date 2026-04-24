import React from "react";
import { GitCompare, Search, Zap, Database } from "lucide-react";

export default function DBMSIndexingComparison({ studentRecords }) {
  const rowCount = studentRecords.length;

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare search without index and with index side by side.
          </p>
        </div>
      </div>

      <div className="overview-hero-card" style={{ marginBottom: 18 }}>
        <div className="overview-hero-header">
          <h3>Search Performance Comparison</h3>
          <span className="overview-badge">DBMS Optimization</span>
        </div>
        <p className="overview-hero-text">
          A linear scan inspects rows one after another, while indexing provides a shortcut that helps the DBMS
          reach the matching record faster.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 18
        }}
      >
        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Table Size</h4>
          </div>
          <p>{rowCount} records are used in this experiment.</p>
        </div>

        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Main Benefit of Indexing</h4>
          </div>
          <p>Fewer comparisons and faster lookup for search queries.</p>
        </div>
      </div>

      <div className="comparison-grid-upgraded">
        <div className="comparison-card">
          <div className="comparison-card-head">
            <h3>Without Index</h3>
            <span className="comparison-chip">Linear Scan</span>
          </div>

          <div className="comparison-mini-stats">
            <span>Search Style: <b>Sequential</b></span>
            <span>Comparisons: <b>Can be many</b></span>
            <span>Time Complexity: <b>O(n)</b></span>
          </div>

          <div className="comparison-info-box">
            The DBMS checks one row, then the next row, until it finds the target value or reaches the end.
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#fecaca",
              fontWeight: 700
            }}
          >
            Slower for larger tables because many rows may need to be inspected.
          </div>
        </div>

        <div className="comparison-card">
          <div className="comparison-card-head">
            <h3>With Index</h3>
            <span className="comparison-chip">Indexed Lookup</span>
          </div>

          <div className="comparison-mini-stats">
            <span>Search Style: <b>Jump / Lookup</b></span>
            <span>Comparisons: <b>Usually fewer</b></span>
            <span>Time Complexity: <b>Near O(1) / O(log n)</b></span>
          </div>

          <div className="comparison-info-box">
            The DBMS first checks the index and then jumps directly to the row position instead of scanning every row.
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.22)",
              color: "#bbf7d0",
              fontWeight: 700
            }}
          >
            Faster for search-heavy queries because the lookup structure reduces work.
          </div>
        </div>
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <Search size={18} />
          <h4>Student Takeaway</h4>
        </div>
        <p>
          The main idea of indexing is simple: instead of searching every row one by one, the DBMS uses an
          additional structure to quickly locate where the required row is stored.
        </p>
      </div>
    </section>
  );
}