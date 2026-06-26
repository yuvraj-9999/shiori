import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineChatAlt2,
  HiOutlineLogout,
  HiOutlineDocumentText,
  HiOutlinePencilAlt,
  HiOutlineClock,
  HiOutlineUpload,
  HiX,
} from "react-icons/hi";
import { getChatHistory } from "../services/chat.service.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useDocuments } from "../context/DocumentContext.jsx";
import appIcon from "../assets/logos/appicon.png";

const formatRelative = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SIDEBAR_W = 236;

/* ── Nav Item ─────────────────────────────────────── */
const NavItem = ({ id, icon: Icon, label, active, onClick, badge }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      id={id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        fontFamily: "inherit",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s ease, color 0.15s ease",
        background: active
          ? "rgba(193,98,63,0.08)"
          : hovered
          ? "rgba(26,22,20,0.04)"
          : "transparent",
        color: active ? "#C1623F" : hovered ? "#181614" : "#6F675F",
      }}
    >
      {/* Left accent bar */}
      {active && (
        <motion.span
          layoutId="nav-accent"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 2.5,
            height: 18,
            borderRadius: "0 3px 3px 0",
            background: "#C1623F",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <Icon style={{ fontSize: 15, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 999,
            background: active ? "#C1623F" : "#E6DDD5",
            color: active ? "#fff" : "#9A9088",
            minWidth: 18,
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

/* ── Sidebar Content ──────────────────────────────── */
const SidebarContent = ({ onToggle, onNewChat, activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const { docCount } = useDocuments();
  const [chatHistory, setChatHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistLoading(true);
    try {
      const data = await getChatHistory();
      setChatHistory(data.chats || []);
    } catch {
      setChatHistory([]);
    } finally {
      setHistLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#F7F3ED",
        userSelect: "none",
      }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 14px 14px",
          borderBottom: "1px solid #EDE6DE",
          flexShrink: 0,
        }}
      >
        <img
          src={appIcon}
          alt="Shiori"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: "#181614",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Shiori
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#9A9088",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            AI Knowledge Workspace
          </p>
        </div>
        <button
          id="sidebar-close"
          onClick={onToggle}
          className="lg:hidden"
          style={{
            background: "none",
            border: "none",
            padding: 4,
            borderRadius: 6,
            cursor: "pointer",
            color: "#9A9088",
            display: "flex",
            alignItems: "center",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(26,22,20,0.06)";
            e.currentTarget.style.color = "#181614";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#9A9088";
          }}
        >
          <HiX style={{ fontSize: 15 }} className="lg:hidden"/>
        </button>
      </div>

      {/* ── Body ────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* New Chat */}
        <motion.button
          id="new-chat-btn"
          onClick={onNewChat}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: "inherit",
            border: "1px solid #E6DDD5",
            cursor: "pointer",
            background: "#FFFFFF",
            color: "#181614",
            marginBottom: 6,
            transition: "background 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FBF8F5";
            e.currentTarget.style.borderColor = "#D4C9BE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.borderColor = "#E6DDD5";
          }}
        >
          <HiOutlinePencilAlt style={{ fontSize: 15, flexShrink: 0 }} />
          New Chat
        </motion.button>

        {/* Divider */}
        <div style={{ height: 1, background: "#EDE6DE", margin: "4px 2px 8px" }} />

        {/* Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <NavItem
            id="nav-chat"
            icon={HiOutlineChatAlt2}
            label="Chat"
            active={activeTab === "chat"}
            onClick={() => { onTabChange("chat"); onToggle?.(); }}
          />
          <NavItem
            id="nav-docs"
            icon={HiOutlineDocumentText}
            label="Documents"
            badge={docCount}
            active={activeTab === "docs"}
            onClick={() => { onTabChange("docs"); onToggle?.(); }}
          />
          <NavItem
            id="nav-upload"
            icon={HiOutlineUpload}
            label="Upload"
            active={activeTab === "upload"}
            onClick={() => { onTabChange("upload"); onToggle?.(); }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EDE6DE", margin: "8px 2px" }} />

        {/* Recent Chats */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 8px 4px",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#9A9088",
            }}
          >
            Recent
          </p>

          {histLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="shimmer"
                  style={{
                    height: 34,
                    borderRadius: 8,
                    background: "rgba(26,22,20,0.05)",
                  }}
                />
              ))}
            </div>
          ) : chatHistory.length === 0 ? (
            <div
              style={{
                padding: "20px 8px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: "#9A9088" }}>
                No chats yet.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {chatHistory.slice(0, 12).map((chat) => (
                <motion.div
                  key={chat._id}
                  whileHover={{ x: 2 }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    cursor: "default",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(26,22,20,0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "#181614",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.4,
                    }}
                  >
                    {chat.question}
                  </p>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "#9A9088",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      marginTop: 2,
                    }}
                  >
                    <HiOutlineClock style={{ fontSize: 10 }} />
                    {formatRelative(chat.createdAt)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: "8px",
          borderTop: "1px solid #EDE6DE",
        }}
      >
        <button
          id="logout-btn"
          onClick={logout}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "inherit",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background 0.15s ease, color 0.15s ease",
            background: logoutHovered ? "#FEF2F2" : "transparent",
            color: logoutHovered ? "#B91C1C" : "#9A9088",
          }}
        >
          <HiOutlineLogout style={{ fontSize: 15, flexShrink: 0 }} />
          Sign out
        </button>
      </div>
    </div>
  );
};

/* ══ Sidebar shell ══════════════════════════════════ */
const Sidebar = ({ isOpen, onToggle, onNewChat, activeTab, onTabChange }) => (
  <>
    {/* Mobile overlay */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "#181614",
            zIndex: 20,
          }}
          className="lg:hidden"
        />
      )}
    </AnimatePresence>

    {/* Desktop – always visible */}
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 h-full overflow-hidden"
      style={{
        width: SIDEBAR_W,
        borderRight: "1px solid #E6DDD5",
      }}
    >
      <SidebarContent
        onToggle={() => {}}
        onNewChat={onNewChat}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </aside>

    {/* Mobile drawer */}
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="drawer"
          initial={{ x: -SIDEBAR_W }}
          animate={{ x: 0 }}
          exit={{ x: -SIDEBAR_W }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          className="fixed top-0 left-0 z-30 h-full lg:hidden overflow-hidden"
          style={{ width: SIDEBAR_W, borderRight: "1px solid #E6DDD5" }}
        >
          <SidebarContent
            onToggle={onToggle}
            onNewChat={onNewChat}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  </>
);

export default Sidebar;
