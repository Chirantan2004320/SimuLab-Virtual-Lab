import React from "react";
import {
  GitCompare,
  Hash,
  Table2,
  TreePine,
  Box,
  Search,
  AlertTriangle,
  Target,
  ShieldAlert,
  PlusCircle,
  Trash2,
  Zap
} from "lucide-react";

export default function HashTableComparison() {
  const rows = [
    {
      icon: Box,
      feature: "Storage Idea",
      hash: "Stores keys in buckets using a hash function.",
      array: "Stores values sequentially by index.",
      tree: "Stores values using hierarchical node links."
    },
    {
      icon: Search,
      feature: "Average Search",
      hash: "O(1)",
      array: "O(n)",
      tree: "O(log n) if balanced"
    },
    {
      icon: AlertTriangle,
      feature: "Worst Search",
      hash: "O(n), when many collisions occur.",
      array: "O(n)",
      tree: "O(n), if skewed."
    },
    {
      icon: Target,
      feature: "Best Use Case",
      hash: "Fast lookup, caching, dictionaries.",
      array: "Ordered storage and index-based access.",
      tree: "Sorted data and range-based queries."
    },
    {
      icon: ShieldAlert,
      feature: "Main Weakness",
      hash: "Collisions and poor hash functions.",
      array: "Slow searching for unsorted data.",
      tree: "Can become unbalanced."
    }
  ];

  return (
    <section className="overview-shell hash-compare-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 22 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Hash Table Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare Hash Tables with Arrays and Trees for lookup, storage, and use cases.
          </p>
        </div>
      </div>

      <div className="hash-compare-top-grid">
        <div className="hash-compare-mini-card">
          <div className="hash-compare-mini-head">
            <Zap size={18} />
            <h4>Best Strength</h4>
          </div>
          <p>Very fast average-case insert, search, and delete operations.</p>
        </div>

        <div className="hash-compare-mini-card">
          <div className="hash-compare-mini-head">
            <Hash size={18} />
            <h4>Collision Handling</h4>
          </div>
          <p>Separate chaining stores multiple keys in the same bucket using a chain.</p>
        </div>

        <div className="hash-compare-mini-card">
          <div className="hash-compare-mini-head">
            <AlertTriangle size={18} />
            <h4>Worst Case</h4>
          </div>
          <p>If many keys collide into the same bucket, operations can become O(n).</p>
        </div>

        <div className="hash-compare-mini-card">
          <div className="hash-compare-mini-head">
            <Table2 size={18} />
            <h4>Used In</h4>
          </div>
          <p>Dictionaries, caches, indexing systems, sets, maps, and symbol tables.</p>
        </div>
      </div>

      <div className="hash-compare-table-card">
        <div className="hash-compare-card-title">
          <GitCompare size={18} />
          <span>Hash Table vs Array vs Tree</span>
        </div>

        <div className="hash-compare-table">
          <div className="hash-compare-row hash-compare-head-row">
            <div className="hash-compare-cell feature-cell">Feature</div>

            <div className="hash-compare-cell column-title hash-column">
              <Hash size={16} />
              Hash Table
            </div>

            <div className="hash-compare-cell column-title array-column">
              <Table2 size={16} />
              Array
            </div>

            <div className="hash-compare-cell column-title tree-column">
              <TreePine size={16} />
              Tree
            </div>
          </div>

          {rows.map((row, index) => {
            const Icon = row.icon;

            return (
              <div className="hash-compare-row" key={index}>
                <div className="hash-compare-cell feature-cell">
                  <div className="hash-feature-wrap">
                    <div className="hash-feature-icon">
                      <Icon size={15} />
                    </div>
                    <span>{row.feature}</span>
                  </div>
                </div>

                <div className="hash-compare-cell hash-value">{row.hash}</div>
                <div className="hash-compare-cell array-value">{row.array}</div>
                <div className="hash-compare-cell tree-value">{row.tree}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hash-operations-grid">
        <div className="hash-operation-card">
          <div className="hash-operation-head">
            <PlusCircle size={18} />
            <h4>Insert</h4>
          </div>
          <p>
            Compute <strong>key % tableSize</strong>, then place the key into that bucket.
            If the bucket already has values, append it to the chain.
          </p>
          <strong>Average: O(1)</strong>
        </div>

        <div className="hash-operation-card">
          <div className="hash-operation-head">
            <Search size={18} />
            <h4>Search</h4>
          </div>
          <p>
            Compute the bucket index and search only inside that chain instead of scanning
            the whole table.
          </p>
          <strong>Average: O(1)</strong>
        </div>

        <div className="hash-operation-card">
          <div className="hash-operation-head">
            <Trash2 size={18} />
            <h4>Delete</h4>
          </div>
          <p>
            Compute the bucket index, find the key in that bucket chain, and remove it if
            present.
          </p>
          <strong>Average: O(1)</strong>
        </div>
      </div>
    </section>
  );
}