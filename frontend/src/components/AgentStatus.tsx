type Step = "planner" | "researchers" | "writer" | "done";

interface Props {
  step: Step;
  subtasks?: string[];
}

const steps: { id: Step; label: string; icon: string }[] = [
  { id: "planner",     label: "Planner — breaking question into subtasks",   icon: "🗂" },
  { id: "researchers", label: "Researchers — 3 agents running in parallel",   icon: "🔬" },
  { id: "writer",      label: "Writer — synthesizing findings into report",   icon: "✍️" },
  { id: "done",        label: "Report ready",                                 icon: "✅" },
];

const order: Step[] = ["planner", "researchers", "writer", "done"];

export function AgentStatus({ step, subtasks }: Props) {
  const current = order.indexOf(step);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => {
        const done    = i < current;
        const active  = i === current;
        const pending = i > current;
        return (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              opacity: pending ? 0.35 : 1,
              animation: active ? "fadeIn 0.3s ease" : undefined,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: done ? "var(--green)" : active ? "var(--accent-dim)" : "var(--border)",
              border: active ? "2px solid var(--accent)" : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, flexShrink: 0,
            }}>
              {active
                ? <span style={{ width: 14, height: 14, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                : s.icon}
            </div>
            <div>
              <div style={{ fontWeight: active ? 600 : 400, color: active ? "var(--text)" : done ? "var(--muted)" : "var(--muted)", fontSize: 14 }}>
                {s.label}
              </div>
              {s.id === "researchers" && active && subtasks && (
                <ul style={{ marginTop: 6, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: 3 }}>
                  {subtasks.map((t, j) => (
                    <li key={j} style={{ fontSize: 12, color: "var(--muted)" }}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
