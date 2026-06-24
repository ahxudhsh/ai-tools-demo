import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// Import internal pdf-parse to bypass self-test issue in ESM/Vitest context
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buf: Buffer) => Promise<{ text: string; numpages: number }> =
  require("pdf-parse/lib/pdf-parse.js");

const TEST_DIR = join(__dirname, "../test_file");

describe("PDF parsing - pdf-parse 1.x", () => {
  describe("Normal file parsing", () => {
    it("Chinese PDF (Git guidelines) - extracts text", async () => {
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const data = await pdfParse(buffer);
      expect(data.text).toBeTruthy();
      expect(data.text.trim().length).toBeGreaterThan(50);
    });
    it("Chinese PDF - numpages > 0", async () => {
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const data = await pdfParse(buffer);
      expect(data.numpages).toBeGreaterThan(0);
    });
  });
  describe("Format validation", () => {
    it("non-PDF buffer throws", async () => {
      const fakeBuffer = Buffer.from("this is not a pdf");
      await expect(pdfParse(fakeBuffer)).rejects.toThrow();
    });
    it("empty buffer throws", async () => {
      const emptyBuffer = Buffer.alloc(0);
      await expect(pdfParse(emptyBuffer)).rejects.toThrow();
    });
  });
  describe("Content quality", () => {
    it("extracted text length >= 100 chars", async () => {
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const data = await pdfParse(buffer);
      expect(data.text.trim().length).toBeGreaterThanOrEqual(100);
    });
    it("truncated to 6000 chars still meaningful", async () => {
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const data = await pdfParse(buffer);
      const truncated = data.text.slice(0, 6000);
      expect(truncated.trim().length).toBeGreaterThan(50);
    });
  });
});
