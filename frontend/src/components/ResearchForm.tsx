interface Props {
  onSubmit: (question: string) => void;
  loading: boolean;
}

export function ResearchForm({ onSubmit, loading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const question = (form.elements.namedItem("question") as HTMLTextAreaElement).value.trim();
    if (question.length >= 10) onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea
        name="question"
        placeholder="What do you want to research? (e.g. What are the main causes and solutions for climate change?)"
        required
        minLength={10}
        maxLength={500}
        rows={3}
        disabled={loading}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          color: "var(--text)",
          fontSize: 15,
          padding: "12px 14px",
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s",
          width: "100%",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          alignSelf: "flex-end",
          background: loading ? "var(--border)" : "var(--accent)",
          border: "none",
          borderRadius: "var(--radius)",
          color: loading ? "var(--muted)" : "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 14,
          fontWeight: 600,
          padding: "10px 24px",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Researching…" : "Research →"}
      </button>
    </form>
  );
}
