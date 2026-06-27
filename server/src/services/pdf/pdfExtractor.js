import fs from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";



export const extractPdf = async (filePath) => {

    if (!filePath) {
        throw new Error("File path is required");
    }

    // Declared outside try so the finally block can always reach it
    // and call destroy() regardless of whether extraction succeeded or failed.
    let pdf = null;

    try {
        const pdfBuffer = await fs.readFile(filePath);

        // Node.js Buffer is a subclass of Uint8Array — pdfjs-dist accepts it
        // directly. Passing pdfBuffer instead of new Uint8Array(pdfBuffer)
        // avoids a full copy of the raw PDF bytes on the heap.
        pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;

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
        // pdf.destroy() releases the pdfjs internal document model from the
        // V8 heap immediately: XRef table, page stream buffers, font caches,
        // and all PDFPageProxy objects. Without this call the GC cannot
        // collect them because the PDFDocumentProxy holds live references.
        if (pdf) {
            await pdf.destroy();
        }
    }

};