import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HiOutlineTrash, HiOutlineCalendar, HiOutlineUpload } from "react-icons/hi";
import { RiFileTextLine } from "react-icons/ri";
import { useDocuments } from "../context/DocumentContext.jsx";
import appIcon from "../assets/logos/appicon.png";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ── Meta badge ─────────────────────────────────── */
const MetaBadge = ({ label, accent = false }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 999,
      background: accent ? "#F5EAE4" : "#F2EDE7",
      color: accent ? "#C1623F" : "#6F675F",
      border: `1px solid ${accent ? "#E5C0AC" : "#E6DDD5"}`,
    }}
  >
    {label}
  </span>
);

/* ── Document card ──────────────────────────────── */
const DocCard = ({ doc, onDelete, confirmId, setConfirmId, isDeleting }) => {
  const [hovered, setHovered] = useState(false);
  const isConfirming = confirmId === doc._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#FFFFFF",
        border: `1px solid ${hovered ? "#D4C9BE" : "#E6DDD5"}`,
        boxShadow: hovered
          ? "0 4px 16px rgba(26,22,20,0.07)"
          : "0 1px 3px rgba(26,22,20,0.04)",
        transition: "border-color 0.15s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "#F5EAE4",
          border: "1px solid #E5C0AC",
        }}
      >
        <RiFileTextLine style={{ fontSize: 18, color: "#C1623F" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#181614",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doc.originalName}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <MetaBadge label={`${doc.totalPages} pages`} />
          <MetaBadge label={`${doc.totalChunks} chunks`} accent />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              color: "#9A9088",
            }}
          >
            <HiOutlineCalendar style={{ fontSize: 11 }} />
            {formatDate(doc.createdAt)}
          </span>
        </div>
      </div>

      {/* Delete action */}
      <div style={{ flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          {isConfirming ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <button
                id={`delete-confirm-${doc._id}`}
                onClick={() => onDelete(doc._id)}
                disabled={isDeleting}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  background: "#B91C1C",
                  color: "#fff",
                  fontFamily: "inherit",
                  opacity: isDeleting ? 0.5 : 1,
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.background = "#991B1B"; }}
                onMouseLeave={(e) => { if (!isDeleting) e.currentTarget.style.background = "#B91C1C"; }}
              >
                {isDeleting ? "Removing…" : "Delete"}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid #E6DDD5",
                  background: "transparent",
                  color: "#6F675F",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F2EDE7";
                  e.currentTarget.style.color = "#181614";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6F675F";
                }}
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="trash"
              id={`delete-btn-${doc._id}`}
              onClick={() => setConfirmId(doc._id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              style={{
                padding: 6,
                borderRadius: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#BDB5AD",
                display: "flex",
                alignItems: "center",
                opacity: hovered ? 1 : 0,
                transition: "background 0.15s ease, color 0.15s ease, opacity 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FEF2F2";
                e.currentTarget.style.color = "#B91C1C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#BDB5AD";
              }}
            >
              <HiOutlineTrash style={{ fontSize: 15 }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Empty state ─────────────────────────────────── */
const EmptyDocs = ({ onUploadClick }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 32px",
      textAlign: "center",
    }}
  >
    <motion.div
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ marginBottom: 20 }}
    >
      <img
        src={appIcon}
        alt="Shiori"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          objectFit: "cover",
          boxShadow: "0 4px 16px rgba(26,22,20,0.08)",
          opacity: 0.8,
        }}
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
    >
      <div>
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#181614", letterSpacing: "-0.015em" }}>
          No documents yet
        </p>
        <p style={{ margin: 0, fontSize: 13.5, color: "#9A9088", lineHeight: 1.6, maxWidth: 260 }}>
          Upload a PDF to start building your knowledge workspace.
        </p>
      </div>
      <motion.button
        onClick={onUploadClick}
        whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(26,22,20,0.12)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          borderRadius: 12,
          border: "none",
          background: "#181614",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(26,22,20,0.18)",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#2C2520"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#181614"}
      >
        <HiOutlineUpload style={{ fontSize: 14 }} />
        Upload a document
      </motion.button>
    </motion.div>
  </div>
);

/* ══ Main DocumentsPanel ══════════════════════════════ */
const DocumentsPanel = ({ onGoToUpload }) => {
  const { documents, loading, docCount, removeDocument } = useDocuments();
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await removeDocument(id);
    setDeletingId(null);
    setConfirmId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F7F3ED" }}>

      {/* ── Header ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E6DDD5",
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 3px",
              fontSize: 15,
              fontWeight: 700,
              color: "#181614",
              letterSpacing: "-0.02em",
            }}
          >
            Knowledge Base
          </h2>
          <p style={{ margin: 0, fontSize: 12.5, color: "#9A9088" }}>
            {loading ? "Loading…" : `${docCount} document${docCount !== 1 ? "s" : ""} indexed`}
          </p>
        </div>
        {docCount > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
              background: "#F5EAE4",
              color: "#C1623F",
              border: "1px solid #E5C0AC",
            }}
          >
            {docCount} doc{docCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── List ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700, margin: "0 auto" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="shimmer"
                style={{
                  height: 70,
                  borderRadius: 16,
                  background: "#EDE6DE",
                }}
              />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <EmptyDocs onUploadClick={onGoToUpload} />
        ) : (
          <LayoutGroup>
            <AnimatePresence initial={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700, margin: "0 auto" }}>
                {documents.map((doc) => (
                  <DocCard
                    key={doc._id}
                    doc={doc}
                    onDelete={handleDelete}
                    confirmId={confirmId}
                    setConfirmId={setConfirmId}
                    isDeleting={deletingId === doc._id}
                  />
                ))}
              </div>
            </AnimatePresence>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
};

export default DocumentsPanel;
