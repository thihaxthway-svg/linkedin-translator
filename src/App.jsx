import { useState, useRef, useEffect } from "react";

const EXAMPLES = [
  "i got fired",
  "i have no idea what i'm doing at work",
  "my startup failed and i lost all the money",
  "i got rejected from 50 jobs",
  "i quit because my boss was terrible",
  "i have been arrested for fraud",
  "i got caught sleeping at my desk",
  "i mass applied to every job on indeed",
  "i burned out and had a mental breakdown",
  "nobody came to my product launch",
  "i copy paste everything from chatgpt",
  "i got demoted",
];

export default function App() {
  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const outputRef = useRef(null);

  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTranslation("");
    setCopied(false);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();

      if (data.error) {
        setTranslation(data.error);
      } else {
        setTranslation(data.translation);
      }
    } catch (err) {
      setTranslation("Connection error. Probably for the best — LinkedIn doesn't need more of this.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExample = (ex) => {
    setInput(ex);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      translate();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div style={styles.bgCircle3} />

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <span style={styles.logoIn}>in</span>
            </div>
            <div>
              <h1 style={styles.title}>LinkedIn Translator</h1>
              <p style={styles.subtitle}>Brutal honesty → Corporate poetry</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.labelRow}>
              <span style={styles.label}>🗣️ The Honest Truth</span>
              <span style={styles.charCount}>{charCount}/280</span>
            </div>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 280))}
              onKeyDown={handleKeyDown}
              placeholder="Type your brutally honest statement..."
              rows={3}
            />
          </div>

          <div style={styles.examplesWrap}>
            <span style={styles.examplesLabel}>Try these:</span>
            <div style={styles.examples}>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  style={styles.exampleChip}
                  onClick={() => handleExample(ex)}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#0A66C2";
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#0A66C2";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(10, 102, 194, 0.06)";
                    e.target.style.color = "#0A66C2";
                    e.target.style.borderColor = "rgba(10, 102, 194, 0.2)";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            style={{
              ...styles.translateBtn,
              opacity: loading || !input.trim() ? 0.6 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
            onClick={translate}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span style={styles.loaderRow}>
                <span style={styles.spinner} />
                Generating cringe...
              </span>
            ) : (
              <>
                <span style={{ fontSize: 20 }}>✨</span>
                Translate to LinkedIn
                <span style={{ fontSize: 20 }}>✨</span>
              </>
            )}
          </button>

          {translation && (
            <>
              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <div style={styles.arrowCircle}>↓</div>
                <div style={styles.dividerLine} />
              </div>

              <div style={styles.outputSection} ref={outputRef}>
                <div style={styles.labelRow}>
                  <span style={styles.label}>💼 LinkedIn Speak</span>
                  <div style={styles.outputActions}>
                    <button
                      style={styles.copyBtn}
                      onClick={handleCopy}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(10,102,194,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
                <div style={styles.outputCard}>
                  <div style={styles.postHeader}>
                    <div style={styles.avatar}>
                      <span style={styles.avatarText}>😎</span>
                    </div>
                    <div>
                      <div style={styles.postName}>You, apparently</div>
                      <div style={styles.postMeta}>
                        Thought Leader • Visionary • Open to Work
                      </div>
                    </div>
                  </div>
                  <div style={styles.postBody}>{translation}</div>
                  <div style={styles.reactionBar}>
                    <div style={styles.reactions}>
                      <span>👍</span>
                      <span>❤️</span>
                      <span>🎉</span>
                      <span style={styles.reactionCount}>4,892</span>
                    </div>
                    <span style={styles.commentCount}>327 comments</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <p style={styles.footer}>
          Built for laughs, not for actual LinkedIn usage. Or is it? 🤔
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -20px) scale(1.05); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, 15px) scale(0.95); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, 25px); } }
        textarea:focus { outline: none; border-color: #0A66C2 !important; box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.12) !important; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F3F2EF", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" },
  bgCircle1: { position: "fixed", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,102,194,0.08) 0%, transparent 70%)", animation: "float1 12s ease-in-out infinite", pointerEvents: "none" },
  bgCircle2: { position: "fixed", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,102,194,0.06) 0%, transparent 70%)", animation: "float2 15s ease-in-out infinite", pointerEvents: "none" },
  bgCircle3: { position: "fixed", top: "40%", left: "50%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(87,143,202,0.05) 0%, transparent 70%)", animation: "float3 18s ease-in-out infinite", pointerEvents: "none" },
  container: { maxWidth: 640, margin: "0 auto", padding: "40px 20px 60px", position: "relative", zIndex: 1 },
  header: { marginBottom: 28, textAlign: "center" },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14 },
  logoIcon: { width: 48, height: 48, borderRadius: 10, background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(10, 102, 194, 0.35)" },
  logoIn: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff" },
  title: { fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 28, color: "#191919", letterSpacing: "-0.5px", lineHeight: 1.1 },
  subtitle: { fontSize: 14, color: "#666", marginTop: 2, fontWeight: 500, letterSpacing: "0.3px" },
  card: { background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" },
  section: { marginBottom: 16 },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#333" },
  charCount: { fontSize: 12, color: "#999", fontVariantNumeric: "tabular-nums" },
  textarea: { width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", border: "1.5px solid #E0E0E0", borderRadius: 12, resize: "vertical", minHeight: 80, background: "#FAFAFA", color: "#191919", transition: "all 0.2s ease", lineHeight: 1.5 },
  examplesWrap: { marginBottom: 20 },
  examplesLabel: { fontSize: 12, color: "#888", fontWeight: 500, display: "block", marginBottom: 8 },
  examples: { display: "flex", flexWrap: "wrap", gap: 6 },
  exampleChip: { padding: "5px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, background: "rgba(10, 102, 194, 0.06)", color: "#0A66C2", border: "1px solid rgba(10, 102, 194, 0.2)", borderRadius: 20, cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap" },
  translateBtn: { width: "100%", padding: "14px 24px", fontSize: 16, fontFamily: "'Sora', sans-serif", fontWeight: 700, background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s ease", boxShadow: "0 4px 16px rgba(10, 102, 194, 0.3)", letterSpacing: "0.2px" },
  loaderRow: { display: "flex", alignItems: "center", gap: 10 },
  spinner: { width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "24px 0" },
  dividerLine: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #DDD, transparent)" },
  arrowCircle: { width: 32, height: 32, borderRadius: "50%", background: "#F3F2EF", border: "1.5px solid #DDD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666", fontWeight: 600 },
  outputSection: {},
  outputActions: { display: "flex", gap: 6 },
  copyBtn: { padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, background: "transparent", color: "#0A66C2", border: "1px solid rgba(10,102,194,0.2)", borderRadius: 8, cursor: "pointer", transition: "all 0.15s ease" },
  outputCard: { background: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: 12, padding: 20 },
  postHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #EAEAEA" },
  avatar: { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #0A66C2, #004182)", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22 },
  postName: { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: "#191919" },
  postMeta: { fontSize: 11, color: "#888", marginTop: 1 },
  postBody: { fontSize: 14.5, lineHeight: 1.65, color: "#333", whiteSpace: "pre-wrap" },
  reactionBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 12, borderTop: "1px solid #EAEAEA" },
  reactions: { display: "flex", alignItems: "center", gap: 3, fontSize: 16 },
  reactionCount: { fontSize: 12, color: "#666", marginLeft: 6 },
  commentCount: { fontSize: 12, color: "#666" },
  footer: { textAlign: "center", fontSize: 13, color: "#999", marginTop: 24 },
};
