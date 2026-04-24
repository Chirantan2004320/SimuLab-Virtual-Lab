import React from "react";
import {
  Network,
  Boxes,
  Link2,
  KeyRound,
  GitBranch,
  ZoomIn,
  ZoomOut,
  ScanSearch,
  Maximize2,
  Download,
  FileCode2,
  RotateCcw,
  BookOpen,
  User,
  GraduationCap
} from "lucide-react";

function StatCard({ icon, value, label, subtext, tint = "#38bdf8" }) {
  const Icon = icon;

  return (
    <div className="er-stat-card">
      <div className="er-stat-icon" style={{ color: tint, borderColor: `${tint}40`, background: `${tint}18` }}>
        <Icon size={22} />
      </div>

      <div>
        <div className="er-stat-value">{value}</div>
        <div className="er-stat-label" style={{ color: tint }}>{label}</div>
        <div className="er-stat-subtext">{subtext}</div>
      </div>
    </div>
  );
}

function TopActionButton({ icon, text }) {
  const Icon = icon;

  return (
    <button type="button" className="er-top-action-btn">
      <Icon size={16} />
      {text}
    </button>
  );
}

function ToolButton({ icon }) {
  const Icon = icon;

  return (
    <button type="button" className="er-tool-btn">
      <Icon size={16} />
    </button>
  );
}

function ZoomBadge() {
  return <div className="er-zoom-badge">100%</div>;
}

function AttributeRow({ name, primary }) {
  return (
    <div className={`er-attr-row ${primary ? "primary" : ""}`}>
      {primary ? (
        <KeyRound size={15} color="#4ade80" />
      ) : (
        <div className="er-attr-dot" />
      )}

      <span>
        {name} {primary ? "(PK)" : ""}
      </span>
    </div>
  );
}

function EntityBox({ entity, icon, x, y }) {
  const Icon = icon;

  return (
    <div className="er-entity-box" style={{ left: x, top: y }}>
      <div className="er-entity-head">
        <Icon size={19} />
        <span>{entity.name}</span>
      </div>

      <div>
        {entity.attributes.map((attr) => (
          <AttributeRow
            key={attr.name}
            name={attr.name}
            primary={attr.primary}
          />
        ))}
      </div>
    </div>
  );
}

function RelationshipDiamond({ x, y, label }) {
  return (
    <div className="er-diamond" style={{ left: x, top: y }}>
      <div className="er-diamond-text">{label}</div>
    </div>
  );
}

function DiagramCanvas({ student, course, instructor }) {
  return (
    <div className="er-diagram-canvas">
      <div className="er-diagram-grid" />

      <div className="er-diagram-tools">
        <ToolButton icon={ScanSearch} />
        <ToolButton icon={ZoomIn} />
        <ToolButton icon={ZoomOut} />
        <ToolButton icon={Maximize2} />
        <ZoomBadge />
      </div>

      {student && <EntityBox entity={student} icon={GraduationCap} x={28} y={92} />}
      {course && <EntityBox entity={course} icon={BookOpen} x={465} y={92} />}
      {instructor && <EntityBox entity={instructor} icon={User} x={902} y={92} />}

      <svg className="er-diagram-svg">
        <line x1="248" y1="188" x2="465" y2="188" stroke="#facc15" strokeWidth="3" />
        <line x1="685" y1="188" x2="902" y2="188" stroke="#facc15" strokeWidth="3" />
      </svg>

      <div className="er-cardinality" style={{ left: 286, top: 150 }}>M</div>
      <div className="er-cardinality" style={{ left: 438, top: 150 }}>N</div>
      <div className="er-cardinality" style={{ left: 724, top: 150 }}>1</div>
      <div className="er-cardinality" style={{ left: 878, top: 150 }}>N</div>

      <RelationshipDiamond x={325} y={150} label="ENROLLS_IN" />
      <RelationshipDiamond x={762} y={150} label="TEACHES" />

      <div className="er-diagram-legend">
        <div className="er-legend-item">
          <div className="er-legend-box" />
          <span>Entity (Strong)</span>
        </div>

        <div className="er-legend-item">
          <div className="er-legend-pk" />
          <span>Primary Key</span>
        </div>

        <div className="er-legend-item">
          <div className="er-legend-attr" />
          <span>Attribute</span>
        </div>

        <div className="er-legend-item">
          <div className="er-legend-rel" />
          <span>Relationship</span>
        </div>

        <div className="er-legend-item">
          <span className="er-legend-cardinality">1 / N</span>
          <span>Cardinality (One / Many)</span>
        </div>
      </div>
    </div>
  );
}

export default function DBMSERDiagram({ entities }) {
  const student = entities.find((e) => e.key === "student");
  const course = entities.find((e) => e.key === "course");
  const instructor = entities.find((e) => e.key === "instructor");

  const totalAttributes = entities.reduce(
    (sum, entity) => sum + entity.attributes.length,
    0
  );

  return (
    <section>
      <div className="er-diagram-topbar">
        <div>
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 8 }}>
            <div className="sorting-sim-icon">
              <Network size={18} />
            </div>
            <div>
              <h2 className="sorting-sim-title">ER Diagram</h2>
              <p className="sorting-sim-subtitle">
                Visual representation of entities, attributes, and relationships. ✨
              </p>
            </div>
          </div>
        </div>

        <div className="er-top-actions">
          <TopActionButton icon={Download} text="Export PNG" />
          <TopActionButton icon={FileCode2} text="Export SVG" />
          <TopActionButton icon={RotateCcw} text="Reset View" />
        </div>
      </div>

      <div className="er-stats-grid">
        <StatCard
          icon={Boxes}
          value={entities.length}
          label="Entities"
          subtext="Strong entities in the model"
          tint="#38bdf8"
        />
        <StatCard
          icon={Link2}
          value={2}
          label="Relationships"
          subtext="Connections between entities"
          tint="#4ade80"
        />
        <StatCard
          icon={KeyRound}
          value={totalAttributes}
          label="Attributes"
          subtext="Total attributes defined"
          tint="#facc15"
        />
        <StatCard
          icon={GitBranch}
          value={2}
          label="Relationship Types"
          subtext="M:N, 1:N"
          tint="#d946ef"
        />
      </div>

      <DiagramCanvas
        student={student}
        course={course}
        instructor={instructor}
      />

      <div className="er-bottom-info-grid">
        <div className="er-bottom-panel">
          <div className="er-bottom-panel-title er-purple">About This Diagram</div>
          <p>
            This ER diagram represents a simple academic domain where students can enroll in multiple courses, and instructors can teach multiple courses. The <strong>ENROLLS_IN</strong> relationship is many-to-many, while <strong>TEACHES</strong> is one-to-many.
          </p>
        </div>

        <div className="er-bottom-panel">
          <div className="er-bottom-panel-title er-yellow">Cardinality Guide</div>

          <div className="er-guide-list">
            <div><span className="g1">1:1</span><span>One to One</span></div>
            <div><span className="g2">1:N</span><span>One to Many</span></div>
            <div><span className="g3">M:N</span><span>Many to Many</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}