import fs from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";



export const extractPdf = async (filePath) => {

    if (!filePath) {
        throw new Error("File path is required");
    }

    try {
        const pdfBuffer = await fs.readFile(filePath);

        const pdfData = new Uint8Array(pdfBuffer);

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

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
    }

};