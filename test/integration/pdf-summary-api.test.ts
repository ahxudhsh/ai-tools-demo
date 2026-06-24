import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const TEST_DIR = join(__dirname, "../test_file");

function mockStream(text: string) {
  const tokens = text.match(/.{1,5}/g) ?? [text];
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          if (i >= tokens.length) return { done: true, value: undefined };
          return { done: false, value: { choices: [{ delta: { content: tokens[i++] } }] } };
        },
      };
    },
  };
}

const MOCK_TEXT = [
  "\u6838\u5fc3\u4e3b\u65e8\uff1a",
  "\u8fd9\u662f\u4e00\u4efd Git \u7248\u672c\u63a7\u5236\u89c4\u8303\u6307\u5bfc\u6587\u6863",
  "",
  "\u5173\u952e\u8981\u70b9\uff1a",
  "\u2022 \u89c4\u8303\u5206\u652f\u547d\u540d\u683c\u5f0f",
  "\u2022 \u7edf\u4e00\u63d0\u4ea4\u4fe1\u606f\u98ce\u683c",
  "\u2022 \u5f3a\u5236\u4ee3\u7801\u5ba1\u67e5\u6d41\u7a0b",
  "",
  "\u8be6\u7ec6\u6458\u8981\uff1a",
  "\u672c\u6587\u6863\u8be6\u7ec6\u4ecb\u7ecd\u4e86 Git \u5de5\u4f5c\u6d41\u89c4\u8303\u3002",
  "",
  "\u6587\u6863\u7c7b\u578b\uff1a\u6280\u672f\u6587\u6863",
  "\u9605\u8bfb\u96be\u5ea6\uff1a\u4e2d\u7b49",
  "\u9002\u5408\u8bfb\u8005\uff1a\u5f00\u53d1\u5de5\u7a0b\u5e08",
].join("\n");

vi.mock("@/lib/ai-client", () => ({
  aiClient: { chat: { completions: { create: vi.fn().mockResolvedValue(mockStream(MOCK_TEXT)) } } },
  AI_MODEL: "llama-3.3-70b-versatile",
}));

async function getHandler() {
  const mod = await import("@/app/api/pdf-summary/route");
  return mod.POST;
}

async function collectEvents(res: Response): Promise<Array<Record<string, unknown>>> {
  const events: Array<Record<string, unknown>> = [];
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const raw = line.replace(/^data: /, "").trim();
      if (raw) { try { events.push(JSON.parse(raw)); } catch { /* skip */ } }
    }
  }
  return events;
}

function makeRequest(file: File | null): Request {
  const fd = new FormData();
  if (file) fd.append("file", file);
  return new Request("http://localhost:3000/api/pdf-summary", { method: "POST", body: fd });
}

describe("POST /api/pdf-summary (SSE streaming)", () => {
  describe("Response format", () => {
    it("Content-Type is text/event-stream", async () => {
      const POST = await getHandler();
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const file = new File([buffer], "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf", { type: "application/pdf" });
      const res = await POST(makeRequest(file) as never);
      expect(res.headers.get("content-type")).toContain("text/event-stream");
    });
    it("stream contains progress -> token -> done events", async () => {
      const POST = await getHandler();
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const file = new File([buffer], "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf", { type: "application/pdf" });
      const res = await POST(makeRequest(file) as never);
      const events = await collectEvents(res);
      const types = events.map((e) => e.type);
      expect(types).toContain("progress");
      expect(types).toContain("token");
      expect(types).toContain("done");
    });
  });
  describe("Input validation - invalid inputs return error events", () => {
    it("no file -> error event with upload message", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest(null) as never);
      const events = await collectEvents(res);
      const err = events.find((e) => e.type === "error");
      expect(err).toBeDefined();
      expect(err!.message as string).toContain("\u4e0a\u4f20");
    });
    it("non-PDF file (.txt) -> error event with PDF message", async () => {
      const POST = await getHandler();
      const file = new File(["hello"], "test.txt", { type: "text/plain" });
      const res = await POST(makeRequest(file) as never);
      const events = await collectEvents(res);
      const err = events.find((e) => e.type === "error");
      expect(err!.message as string).toContain("PDF");
    });
    it("file >10MB -> error event with 10MB message", async () => {
      const POST = await getHandler();
      const bigBuf = Buffer.alloc(11 * 1024 * 1024, "A");
      const file = new File([bigBuf], "huge.pdf", { type: "application/pdf" });
      const res = await POST(makeRequest(file) as never);
      const events = await collectEvents(res);
      const err = events.find((e) => e.type === "error");
      expect(err!.message as string).toContain("10MB");
    });
  });
  describe("AI errors return Chinese error events", () => {
    it("AI throws 402 -> error event with Chinese quota message", async () => {
      const { aiClient } = await import("@/lib/ai-client");
      vi.mocked(aiClient.chat.completions.create).mockRejectedValueOnce(new Error("402 Insufficient Balance"));
      const POST = await getHandler();
      const buffer = readFileSync(join(TEST_DIR, "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf"));
      const file = new File([buffer], "Git\u89c4\u8303\u6307\u5bfc\u6587\u6863.pdf", { type: "application/pdf" });
      const res = await POST(makeRequest(file) as never);
      const events = await collectEvents(res);
      const err = events.find((e) => e.type === "error");
      expect(err!.message as string).not.toContain("Insufficient Balance");
      expect(err!.message as string).toContain("\u914d\u989d");
    });
  });
});
