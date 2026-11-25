import Markdown from "react-markdown";

interface Props {
  question: string;
  subtasks: string[];
  report: string;
  onReset: () => void;
}

export function ResearchReport({ question, subtasks, report, onReset }: Props) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px 20px",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Research Question
        </div>
        <div style={{ color: "var(--text)", fontWeight: 500 }}>{question}</div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {subtasks.map((t, i) => (
            <span key={i} style={{
              background: "var(--accent-dim)",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: 20,
              color: "#fb923c",
              fontSize: 12,
              padding: "3px 10px",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        marginBottom: 20,
      }}>
        <div className="report">
          <Markdown>{report}</Markdown>
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          color: "var(--muted)",
          cursor: "pointer",
          fontSize: 14,
          padding: "8px 18px",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.target as HTMLButtonElement).style.color = "var(--accent)"; }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = "var(--border)"; (e.target as HTMLButtonElement).style.color = "var(--muted)"; }}
      >
        ← New research
      </button>
    </div>
  );
}
