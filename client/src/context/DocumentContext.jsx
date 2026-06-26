import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getDocuments, deleteDocument } from "../services/document.service.js";

const DocumentContext = createContext(null);

/**
 * Single source of truth for all document state.
 * Mounted inside Dashboard so it is only active when authenticated.
 */
export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch from server ─────────────────────── */
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  /* ── Optimistic add after upload ───────────── */
  const addDocuments = useCallback((newDocs) => {
    // newDocs is the array returned by the upload endpoint
    setDocuments((prev) => {
      const existingIds = new Set(prev.map((d) => d._id));
      const fresh = newDocs.filter((d) => !existingIds.has(d._id));
      return [...fresh, ...prev];
    });
  }, []);

  /* ── Re-fetch after upload (server shapes differ) */
  const refreshAfterUpload = useCallback(async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch {
      /* keep existing state */
    }
  }, []);

  /* ── Optimistic delete ─────────────────────── */
  const removeDocument = useCallback(
    async (id) => {
      const snapshot = documents;
      // Optimistic: remove immediately
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      try {
        await deleteDocument(id);
      } catch {
        // Rollback on failure
        setDocuments(snapshot);
      }
    },
    [documents]
  );

  const docCount = documents.length;

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        docCount,
        fetchDocuments,
        addDocuments,
        refreshAfterUpload,
        removeDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error("useDocuments must be used inside <DocumentProvider>");
  return ctx;
};
