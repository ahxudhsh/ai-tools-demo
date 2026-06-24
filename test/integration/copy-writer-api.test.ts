import { describe, it, expect, vi } from "vitest";

const MOCK_COPIES = {
  formal: { title: "Professional AI Platform", body: "Enterprise AI solutions for productivity.", cta: "Try Now" },
  casual: { title: "Your AI super assistant", body: "Save time on copy and docs with AI!", cta: "Get Started" },
  grass: { title: "Can't go back after using this", body: "Went from 2 hours to 10 minutes. Boss noticed my efficiency!", cta: "Try Free" },
};

vi.mock("@/lib/ai-client", () => ({
  aiClient: { chat: { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: JSON.stringify(MOCK_COPIES) } }] }) } } },
  AI_MODEL: "llama-3.3-70b-versatile",
}));

async function getHandler() {
  const mod = await import("@/app/api/copy-writer/route");
  return mod.POST;
}

function makeRequest(body: object): Request {
  return new Request("http://localhost:3000/api/copy-writer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

describe("POST /api/copy-writer", () => {
  describe("Input validation - missing required fields returns 400", () => {
    it("missing productName -> 400", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest({ productDesc: "An AI tool" }) as never);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("\u5fc5\u586b");
    });
    it("missing productDesc -> 400", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest({ productName: "AI Assistant" }) as never);
      expect(res.status).toBe(400);
    });
    it("empty body -> 400", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest({}) as never);
      expect(res.status).toBe(400);
    });
  });

  describe("Happy path - valid input returns 3 copy styles", () => {
    const validInput = { productName: "AI Tools", productDesc: "Multi-function AI assistant platform", targetAudience: "Product managers and developers", keyFeatures: "Free, fast, multi-style" };
    it("returns 200 + success: true", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest(validInput) as never);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
    it("returns 3 styles: formal / casual / grass", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest(validInput) as never);
      const body = await res.json();
      expect(body.copies).toHaveProperty("formal");
      expect(body.copies).toHaveProperty("casual");
      expect(body.copies).toHaveProperty("grass");
    });
    it("each style has title / body / cta", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest(validInput) as never);
      const body = await res.json();
      for (const style of ["formal", "casual", "grass"] as const) {
        expect(body.copies[style].title).toBeTruthy();
        expect(body.copies[style].body).toBeTruthy();
        expect(body.copies[style].cta).toBeTruthy();
      }
    });
    it("optional fields missing still works", async () => {
      const POST = await getHandler();
      const res = await POST(makeRequest({ productName: "Test", productDesc: "A test product" }) as never);
      expect(res.status).toBe(200);
    });
  });

  describe("AI errors return Chinese messages", () => {
    it("invalid JSON from AI -> 500 + format error", async () => {
      const { aiClient } = await import("@/lib/ai-client");
      vi.mocked(aiClient.chat.completions.create).mockResolvedValueOnce({ choices: [{ message: { content: "invalid json {{{" } }] } as never);
      const POST = await getHandler();
      const res = await POST(makeRequest({ productName: "Test", productDesc: "Test desc" }) as never);
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toContain("\u683c\u5f0f\u5f02\u5e38");
    });
    it("429 rate limit -> 500 + wait message", async () => {
      const { aiClient } = await import("@/lib/ai-client");
      vi.mocked(aiClient.chat.completions.create).mockRejectedValueOnce(new Error("429 Rate limit exceeded"));
      const POST = await getHandler();
      const res = await POST(makeRequest({ productName: "Test", productDesc: "Test desc" }) as never);
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).not.toContain("Rate limit");
      expect(body.error).toContain("\u7a0d\u7b49");
    });
  });
});
