import { describe, it, expect } from "vitest";
import { translateApiError } from "@/lib/api-error";

describe("translateApiError", () => {
  it("402 -> quota message", () => {
    expect(translateApiError(new Error("402 Payment Required"))).toContain("\u914d\u989d");
  });
  it("insufficient balance -> quota message", () => {
    expect(translateApiError(new Error("insufficient_balance"))).toContain("\u914d\u989d");
  });
  it("401 -> key message", () => {
    expect(translateApiError(new Error("401 Unauthorized"))).toContain("API Key");
  });
  it("invalid api key -> key message", () => {
    expect(translateApiError(new Error("Invalid API Key"))).toContain("GROQ_API_KEY");
  });
  it("429 -> rate limit message", () => {
    expect(translateApiError(new Error("429 Too Many Requests"))).toContain("\u7a0d\u7b49");
  });
  it("rate limit -> rate limit message", () => {
    expect(translateApiError(new Error("Rate limit exceeded"))).toContain("\u7a0d\u7b49");
  });
  it("404 -> model unavailable", () => {
    expect(translateApiError(new Error("404 model not found"))).toContain("\u6a21\u578b\u4e0d\u53ef\u7528");
  });
  it("timeout -> timeout message", () => {
    expect(translateApiError(new Error("Request timeout"))).toContain("\u8d85\u65f6");
  });
  it("ENOTFOUND -> network message", () => {
    expect(translateApiError(new Error("ENOTFOUND api.groq.com"))).toContain("\u7f51\u7edc\u8fde\u63a5\u5931\u8d25");
  });
  it("503 -> busy message", () => {
    expect(translateApiError(new Error("503 Service Unavailable"))).toContain("\u7e41\u5fd9");
  });
  it("overloaded -> busy message", () => {
    expect(translateApiError(new Error("The server is currently overloaded"))).toContain("\u7e41\u5fd9");
  });
  it("unknown error -> contains original message", () => {
    const result = translateApiError(new Error("Some completely unknown error XYZ"));
    expect(result).toContain("Some completely unknown error XYZ");
  });
  it("null does not throw", () => {
    expect(() => translateApiError(null)).not.toThrow();
  });
  it("402 message does not contain Insufficient Balance", () => {
    expect(translateApiError(new Error("402 Insufficient Balance"))).not.toContain("Insufficient Balance");
  });
  it("429 message does not contain Rate Limit", () => {
    expect(translateApiError(new Error("429 Rate Limit"))).not.toContain("Rate Limit");
  });
});
