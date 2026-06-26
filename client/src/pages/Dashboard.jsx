import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMenu,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineUpload,
} from "react-icons/hi";
import appIcon from "../assets/logos/appicon.png";

import { DocumentProvider, useDocuments } from "../context/DocumentContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatArea from "../components/ChatArea.jsx";
import DocumentsPanel from "../components/DocumentsPanel.jsx";
import UploadSection from "../components/UploadSection.jsx";

/* ── Mobile Tab Button ───────────────────────────── */
const MobileTab = ({ id, active, icon: Icon, label, badge, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      id={id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: "inherit",
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease",
        background: active ? "#FFFFFF" : "transparent",
        color: active ? "#C1623F" : hovered ? "#181614" : "#6F675F",
        boxShadow: active ? "0 1px 3px rgba(26,22,20,0.08)" : "none",
      }}
    >
      <Icon style={{ fontSize: 13 }} />
      {label}
      {badge > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 5px",
            borderRadius: 999,
            marginLeft: 2,
            background: active ? "#F5EAE4" : "#E6DDD5",
            color: active ? "#C1623F" : "#9A9088",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

/* ══ Inner Dashboard ════════════════════════════════ */
const DashboardInner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatKey, setChatKey] = useState(0);
  const { docCount, refreshAfterUpload } = useDocuments();

  const handleNewChat = useCallback(() => {
    setChatKey((k) => k + 1);
    setActiveTab("chat");
    setSidebarOpen(false);
  }, []);

  const handleUploadSuccess = useCallback(async () => {
    await refreshAfterUpload();
    setActiveTab("docs");
  }, [refreshAfterUpload]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100svh",
        overflow: "hidden",
        background: "#F7F3ED",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onNewChat={handleNewChat}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* ── Top bar (mobile/tablet only — hidden on desktop) ── */}
        <header
          className="lg:hidden flex items-center flex-shrink-0"
          style={{
            gap: 10,
            padding: "0 12px",
            minHeight: 50,
            background: "#FFFFFF",
            borderBottom: "1px solid #E6DDD5",
          }}
        >
          {/* Hamburger */}
          <motion.button
            id="mobile-menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: 8,
              marginLeft: -4,
              borderRadius: 8,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6F675F",
              display: "flex",
              alignItems: "center",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F2EDE7";
              e.currentTarget.style.color = "#181614";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#6F675F";
            }}
          >
            <HiOutlineMenu style={{ fontSize: 18 }} />
          </motion.button>

          {/* Mobile brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <img src={appIcon} alt="Shiori" style={{ width: 22, height: 22, borderRadius: 6, objectFit: "cover" }} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#181614", letterSpacing: "-0.02em" }}>
              Shiori
            </span>
          </div>

          {/* Mobile tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "4px",
              borderRadius: 10,
              marginLeft: "auto",
              background: "#F2EDE7",
              border: "1px solid #E6DDD5",
            }}
          >
            <MobileTab id="tab-chat" active={activeTab === "chat"} icon={HiOutlineChatAlt2} label="Chat" onClick={() => setActiveTab("chat")} />
            <MobileTab id="tab-docs" active={activeTab === "docs"} icon={HiOutlineDocumentText} label="Docs" badge={docCount} onClick={() => setActiveTab("docs")} />
            <MobileTab id="tab-upload" active={activeTab === "upload"} icon={HiOutlineUpload} label="Upload" onClick={() => setActiveTab("upload")} />
          </div>
        </header>

        {/* ── Content Area ─────────────────────────── */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          <AnimatePresence mode="wait">

            {/* Chat */}
            {activeTab === "chat" && (
              <motion.div
                key={`chat-${chatKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}
              >
                <ChatArea />
              </motion.div>
            )}

            {/* Documents */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}
              >
                <DocumentsPanel onGoToUpload={() => setActiveTab("upload")} />
              </motion.div>
            )}

            {/* Upload */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ flex: 1, overflowY: "auto" }}
              >
                <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
                  <div style={{ marginBottom: 32 }}>
                    <h2
                      style={{
                        margin: "0 0 6px",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#181614",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      Upload Documents
                    </h2>
                    <p style={{ margin: 0, fontSize: 14, color: "#9A9088" }}>
                      Add PDFs to your Shiori knowledge workspace.
                    </p>
                  </div>
                  <UploadSection onUploadSuccess={handleUploadSuccess} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ══ Dashboard — owns the DocumentProvider ═══════════ */
const Dashboard = () => (
  <DocumentProvider>
    <DashboardInner />
  </DocumentProvider>
);

export default Dashboard;