import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePaperAirplane, HiOutlineDocumentText, HiOutlineChevronDown } from "react-icons/hi";
import { askQuestion, getChatHistory } from "../services/chat.service.js";
import appIcon from "../assets/logos/appicon.png";

/* ── Typing dots ────────────────────────────────── */
const TypingDots = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 0" }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#C1623F",
          display: "inline-block",
        }}
      />
    ))}
  </div>
);

/* ── Sources block ──────────────────────────────── */
// Groups sources by document name and shows a compact summary with expand.
const SourcesBlock = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  // Group by document name
  const grouped = sources.reduce((acc, src) => {
    const name = src.documentName || "Unknown";
    if (!acc[name]) acc[name] = [];
    acc[name].push(src.pageNumber);
    return acc;
  }, {});

  const docNames = Object.keys(grouped);
  const totalSources = sources.length;

  // Compact summary line: "Document.pdf · 3 sources" or "3 sources across 2 documents"
  const summaryText =
    docNames.length === 1
      ? `${docNames[0]} · ${totalSources} source${totalSources !== 1 ? "s" : ""}`
      : `${totalSources} sources across ${docNames.length} documents`;

  return (
    <div style={{ paddingLeft: 2 }}>
      {/* Compact trigger */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11.5,
          fontWeight: 500,
          padding: "4px 10px 4px 8px",
          borderRadius: 999,
          border: "1px solid #E5C0AC",
          background: "#F5EAE4",
          color: "#C1623F",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#EEE0D8"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#F5EAE4"}
      >
        <HiOutlineDocumentText style={{ fontSize: 11 }} />
        <span style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {summaryText}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <HiOutlineChevronDown style={{ fontSize: 10 }} />
        </motion.span>
      </button>

      {/* Expanded page chips */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {docNames.map((docName) => {
                const pages = grouped[docName].filter(Boolean);
                return (
                  <div
                    key={docName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6F675F",
                        fontWeight: 500,
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {docName}
                    </span>
                    {pages.length > 0 && pages.map((pg, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 999,
                          background: "#F2EDE7",
                          border: "1px solid #E6DDD5",
                          color: "#6F675F",
                        }}
                      >
                        p.{pg}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Suggestion card ────────────────────────────── */
const SuggestionCard = ({ text, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: "left",
        fontSize: 13,
        padding: "11px 14px",
        borderRadius: 12,
        border: `1px solid ${hovered ? "#E5C0AC" : "#E6DDD5"}`,
        background: hovered ? "#F5EAE4" : "#FFFFFF",
        color: hovered ? "#C1623F" : "#6F675F",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 500,
        lineHeight: 1.5,
        transition: "all 0.15s ease",
        boxShadow: hovered ? "0 2px 8px rgba(26,22,20,0.05)" : "none",
      }}
    >
      {text}
    </motion.button>
  );
};

/* ── Message bubble ─────────────────────────────── */
const Message = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        display: "flex",
        gap: 10,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <img
            src={appIcon}
            alt="Shiori"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 1px 3px rgba(26,22,20,0.1)",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          alignItems: isUser ? "flex-end" : "flex-start",
          maxWidth: isUser ? "75%" : "84%",
        }}
      >
        {/* Bubble */}
        <div
          style={
            isUser
              ? {
                  padding: "9px 15px",
                  borderRadius: "18px 18px 4px 18px",
                  fontSize: 14,
                  lineHeight: 1.65,
                  background: "#181614",
                  color: "#F2EDE7",
                  boxShadow: "0 1px 4px rgba(26,22,20,0.12)",
                }
              : msg.isError
              ? {
                  padding: "9px 15px",
                  borderRadius: "18px 18px 18px 4px",
                  fontSize: 14,
                  lineHeight: 1.65,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                }
              : {
                  padding: "10px 15px",
                  borderRadius: "18px 18px 18px 4px",
                  fontSize: 14,
                  lineHeight: 1.65,
                  background: "#FFFFFF",
                  border: "1px solid #E6DDD5",
                  color: "#181614",
                  boxShadow: "0 1px 2px rgba(26,22,20,0.03)",
                }
          }
        >
          <div
            className={isUser ? "" : "prose-answer"}
            dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>") }}
          />
        </div>

        {/* Sources — collapsed by default */}
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <SourcesBlock sources={msg.sources} />
        )}
      </div>
    </motion.div>
  );
};

/* ── Empty state ────────────────────────────────── */
const EmptyState = ({ onSuggestion, inputRef }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 16px 48px",
    }}
  >
    <motion.div
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ marginBottom: 18 }}
    >
      <img
        src={appIcon}
        alt="Shiori"
        style={{
          width: 50,
          height: 50,
          borderRadius: 13,
          objectFit: "cover",
          boxShadow: "0 4px 14px rgba(26,22,20,0.07)",
        }}
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      style={{ textAlign: "center", marginBottom: 28 }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 15,
          fontWeight: 600,
          color: "#181614",
          letterSpacing: "-0.02em",
        }}
      >
        Ask Shiori about your documents.
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#9A9088",
          lineHeight: 1.6,
          maxWidth: 260,
        }}
      >
        Upload PDFs to get grounded answers with page-level citations.
      </p>
    </motion.div>

    {/* Suggestion grid */}
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.3 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 7,
        width: "100%",
        maxWidth: 540,
      }}
    >
      {[
        "What are the main findings of this paper?",
        "Summarize the methodology section",
        "What datasets and benchmarks were used?",
        "What are the key limitations discussed?",
      ].map((s) => (
        <SuggestionCard
          key={s}
          text={s}
          onClick={() => { onSuggestion(s); inputRef.current?.focus(); }}
        />
      ))}
    </motion.div>
  </div>
);

/* ── Skeleton loader ────────────────────────────── */
const SkeletonMessages = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 850, margin: "0 auto", width: "100%" }}>
    {[{ w: "48%", align: "flex-end" }, { w: "68%", align: "flex-start" }, { w: "36%", align: "flex-end" }].map((s, i) => (
      <div key={i} style={{ display: "flex", justifyContent: s.align }}>
        <div
          className="shimmer"
          style={{ width: s.w, height: 42, borderRadius: 18, background: "#EDE6DE" }}
        />
      </div>
    ))}
  </div>
);

/* ══ Main ChatArea ══════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const ChatArea = ({ refreshKey }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getChatHistory();
      const chats = (data.chats || []).reverse();
      const mapped = chats.flatMap((c) => [
        { id: `q-${c._id}`, role: "user", content: c.question, time: c.createdAt },
        { id: `a-${c._id}`, role: "assistant", content: c.answer, sources: c.sources || [], time: c.createdAt },
      ]);
      setMessages(mapped);
    } catch {
      setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: q, time: new Date().toISOString() }]);
    setLoading(true);

    try {
      const data = await askQuestion(q);
      setMessages((p) => [
        ...p,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
          time: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: err?.response?.data?.message || "Something went wrong. Please try again.",
          sources: [],
          time: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        background: "#F7F3ED",
      }}
    >
      {/* ── Messages ──────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {historyLoading ? (
          <SkeletonMessages />
        ) : messages.length === 0 ? (
          <EmptyState onSuggestion={setInput} inputRef={textareaRef} />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 850,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => <Message key={msg.id} msg={msg} />)}
            </AnimatePresence>

            {/* Thinking indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-end" }}
                >
                  <img
                    src={appIcon}
                    alt="Shiori"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      boxShadow: "0 1px 3px rgba(26,22,20,0.1)",
                    }}
                  />
                  <div
                    style={{
                      padding: "9px 14px",
                      borderRadius: "18px 18px 18px 4px",
                      background: "#FFFFFF",
                      border: "1px solid #E6DDD5",
                      boxShadow: "0 1px 2px rgba(26,22,20,0.03)",
                    }}
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ─────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 20px 14px",
          background: "#FFFFFF",
          borderTop: "1px solid #E6DDD5",
        }}
      >
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              borderRadius: 14,
              padding: "8px 8px 8px 14px",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              border: inputFocused ? "1.5px solid #C1623F" : "1.5px solid #E6DDD5",
              background: "#F7F3ED",
              boxShadow: inputFocused ? "0 0 0 3px rgba(193,98,63,0.07)" : "none",
            }}
          >
            <textarea
              ref={textareaRef}
              id="chat-input"
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Shiori about your documents..."
              style={{
                flex: 1,
                resize: "none",
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
                background: "transparent",
                lineHeight: 1.6,
                overflowY: "auto",
                height: 24,
                maxHeight: 160,
                color: "#181614",
                border: "none",
                padding: 0,
              }}
            />
            <motion.button
              id="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              whileHover={input.trim() && !loading
                ? { scale: 1.06, background: "#C1623F" }
                : {}}
              whileTap={{ scale: (!input.trim() || loading) ? 1 : 0.94 }}
              style={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: 9,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
                transition: "background 0.15s ease",
                background: input.trim() && !loading ? "#181614" : "#E6DDD5",
                color: input.trim() && !loading ? "#fff" : "#9A9088",
                boxShadow: input.trim() && !loading ? "0 1px 4px rgba(26,22,20,0.16)" : "none",
              }}
            >
              <HiOutlinePaperAirplane style={{ fontSize: 13, transform: "rotate(90deg)" }} />
            </motion.button>
          </div>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 10.5,
              textAlign: "center",
              color: "#BDB5AD",
              userSelect: "none",
            }}
          >
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
