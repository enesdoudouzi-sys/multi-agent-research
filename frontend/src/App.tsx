import { useState } from "react";
import { ResearchForm } from "./components/ResearchForm";
import { AgentStatus } from "./components/AgentStatus";
import { ResearchReport } from "./components/ResearchReport";

type Step = "planner" | "researchers" | "writer" | "done";

interface ResearchResult {
  question: string;
  subtasks: string[];
  report: string;
}

type State =
  | { phase: "idle" }
  | { phase: "loading"; step: Step; question: string; subtasks?: string[] }
  | { phase: "done"; result: ResearchResult }
  | { phase: "error"; message: string };

const API = import.meta.env.VITE_API_URL ?? "";

async function runResearch(question: string, onStep: (s: Step, subtasks?: string[]) => void): Promise<ResearchResult> {
  onStep("planner");
  const res = await fetch(`${API}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? "Request failed");

  // Simulate step progression while waiting (the backend is synchronous)
  const data = await res.json();
  onStep("researchers", data.subtasks);
  await new Promise((r) => setTimeout(r, 400));
  onStep("writer");
  await new Promise((r) => setTimeout(r, 400));
  return data;
}

export default function App() {
  const [state, setState] = useState<State>({ phase: "idle" });

  const handleSubmit = async (question: string) => {
    setState({ phase: "loading", step: "planner", question });
    try {
      const result = await runResearch(question, (step, subtasks) => {
        setState({ phase: "loading", step, question, subtasks });
      });
      setState({ phase: "done", result });
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const reset = () => setState({ phase: "idle" });

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Multi-Agent Research System
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
          Research anything, deeply.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Planner → 3 parallel Researchers → Writer · Powered by Claude
        </p>
      </div>

      {state.phase === "idle" && (
        <ResearchForm onSubmit={handleSubmit} loading={false} />
      )}

      {state.phase === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <ResearchForm onSubmit={handleSubmit} loading={true} />
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px 24px",
          }}>
            <AgentStatus step={state.step} subtasks={state.subtasks} />
          </div>
        </div>
      )}

      {state.phase === "done" && (
        <ResearchReport {...state.result} onReset={reset} />
      )}

      {state.phase === "error" && (
        <div style={{
          background: "#1a0a0a",
          border: "1px solid #7f1d1d",
          borderRadius: "var(--radius)",
          color: "#fca5a5",
          padding: "16px 20px",
          marginTop: 16,
        }}>
          <strong>Error:</strong> {state.message}
          <button onClick={reset} style={{ display: "block", marginTop: 10, background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 13 }}>
            ← Try again
          </button>
        </div>
      )}
    </div>
  );
}
