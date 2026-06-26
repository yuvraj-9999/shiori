import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUpload, HiCheckCircle, HiOutlineX, HiOutlineDocumentAdd } from "react-icons/hi";
import { uploadDocuments } from "../services/document.service.js";
import { useDocuments } from "../context/DocumentContext.jsx";

const UploadSection = ({ onUploadSuccess }) => {
  const { refreshAfterUpload } = useDocuments();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const pdfFiles = Array.from(files).filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) {
      setError("Only PDF files are supported.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 10 : p));
    }, 350);

    const formData = new FormData();
    pdfFiles.forEach((f) => formData.append("documents", f));

    try {
      await uploadDocuments(formData);
      clearInterval(progressInterval);
      setProgress(100);
      setUploadedFiles(pdfFiles.map((f) => f.name));

      await refreshAfterUpload();
      onUploadSuccess?.();

      setTimeout(() => {
        setUploadedFiles([]);
        setProgress(0);
      }, 4000);
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getZoneStyle = () => {
    const base = {
      borderRadius: 18,
      padding: "64px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      textAlign: "center",
      cursor: uploading ? "default" : "pointer",
      transition: "border-color 0.2s ease, background 0.2s ease",
      border: "2px dashed",
      borderColor: dragging ? "#C1623F" : uploading ? "#D4806A" : "#E6DDD5",
      background: dragging ? "#F5EAE4" : uploading ? "#FDFAF8" : "#FFFFFF",
    };
    return base;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Drop zone ─────────────────────────────── */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={getZoneStyle()}
        onMouseEnter={(e) => {
          if (!uploading && !dragging) {
            e.currentTarget.style.borderColor = "#C1623F";
            e.currentTarget.style.background = "#F5EAE4";
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading && !dragging) {
            e.currentTarget.style.borderColor = "#E6DDD5";
            e.currentTarget.style.background = "#FFFFFF";
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          style={{ display: "none" }}
          id="file-upload-input"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Icon */}
        <motion.div
          animate={{ scale: dragging ? 1.08 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: dragging ? "#C1623F" : "#F5EAE4",
            border: `1px solid ${dragging ? "#C1623F" : "#E5C0AC"}`,
          }}
        >
          {uploading ? (
            <HiOutlineDocumentAdd
              style={{ fontSize: 26, color: dragging ? "#fff" : "#C1623F" }}
            />
          ) : (
            <HiOutlineUpload
              style={{ fontSize: 26, color: dragging ? "#fff" : "#C1623F" }}
            />
          )}
        </motion.div>

        {/* Text */}
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#181614" }}>
            {uploading ? "Uploading and indexing…" : dragging ? "Drop to upload" : "Drag & drop PDFs here"}
          </p>
          <p style={{ margin: 0, fontSize: 13.5, color: "#9A9088" }}>
            {uploading ? "Please wait — this may take a moment" : "or click to browse · PDF files only"}
          </p>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ width: "100%", maxWidth: 280 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#6F675F" }}>Processing…</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#C1623F" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "#F5EAE4",
                }}
              >
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #A84F31, #C1623F)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Error ─────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              fontSize: 13.5,
            }}
          >
            <HiOutlineX style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#B91C1C",
                opacity: 0.6,
                padding: 0,
                display: "flex",
                fontFamily: "inherit",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
            >
              <HiOutlineX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success ───────────────────────────────── */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#6F675F" }}>
              Successfully indexed:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {uploadedFiles.map((name) => (
                <motion.div
                  key={name}
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 12.5,
                    padding: "5px 12px",
                    borderRadius: 999,
                    fontWeight: 500,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    color: "#15803D",
                  }}
                >
                  <HiCheckCircle style={{ flexShrink: 0 }} />
                  <span style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadSection;
