import fs from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";



export const extractPdf = async (filePath) => {

    if (!filePath) {
        throw new Error("File path is required");
    }

    // PDFDocumentLoadingTask is what getDocument() returns directly.
    // destroy() lives on the LoadingTask, NOT on PDFDocumentProxy.
    // Hoisted outside try so the finally block can always reach it.
    let loadingTask = null;

    try {
        const pdfBuffer = await fs.readFile(filePath);

        const pdfData = new Uint8Array(
            pdfBuffer.buffer,
            pdfBuffer.byteOffset,
            pdfBuffer.byteLength
        );

        // Keep the loadingTask reference — this is the object that has destroy().
        loadingTask = pdfjsLib.getDocument({ data: pdfData });

        // pdf (PDFDocumentProxy) is used only for page access inside this block.
        const pdf = await loadingTask.promise;

        const pages = [];

        const totalPages = pdf.numPages;

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

            const page = await pdf.getPage(pageNumber);

            const textContent = await page.getTextContent();

            const text = textContent.items.map(item => item.str).join(" ");

            pages.push({
                pageNumber,
                text,
            });
        }

        return {
            totalPages,
            pages,
        };

    } catch (error) {
        throw new Error(`Failed to extract PDF: ${error.message}`);
    } finally {
        // loadingTask.destroy() is the correct pdfjs-dist API for full teardown.
        // It terminates the worker, aborts pending streams, and releases the
        // XRef table, page buffers, and font caches from the V8 heap.
        // PDFDocumentProxy has cleanup() (cache only), not destroy().
        if (loadingTask) {
            await loadingTask.destroy();
        }
    }

};