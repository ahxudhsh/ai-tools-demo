export function translateApiError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  if (lower.includes("402") || lower.includes("insufficient balance") || lower.includes("insufficient_balance")) {
    return "API \u914d\u989d\u5df2\u7528\u5c3d\uff0c\u8bf7\u524d\u5f80 console.groq.com \u786e\u8ba4\u514d\u8d39\u989d\u5ea6\u6216\u66f4\u6362 Key";
  }
  if (lower.includes("401") || lower.includes("invalid api key") || lower.includes("authentication")) {
    return "API Key \u65e0\u6548\u6216\u5df2\u8fc7\u671f\uff0c\u8bf7\u68c0\u67e5 .env.local \u4e2d\u7684 GROQ_API_KEY \u914d\u7f6e";
  }
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("too many requests")) {
    return "\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u7b49 10 \u79d2\u540e\u91cd\u8bd5";
  }
  if (lower.includes("404") || lower.includes("model not found") || lower.includes("permission")) {
    return "\u5f53\u524d\u6a21\u578b\u4e0d\u53ef\u7528\uff0c\u8bf7\u786e\u8ba4 API Key \u6709\u6743\u9650\u8bbf\u95ee deepseek-chat";
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("econnreset")) {
    return "AI \u670d\u52a1\u54cd\u5e94\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5";
  }
  if (lower.includes("503") || lower.includes("service unavailable") || lower.includes("overloaded")) {
    return "AI \u670d\u52a1\u6682\u65f6\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5";
  }
  if (lower.includes("enotfound") || lower.includes("econnrefused") || lower.includes("network")) {
    return "\u7f51\u7edc\u8fde\u63a5\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5";
  }
  return `\u8c03\u7528 AI \u670d\u52a1\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff08${raw.slice(0, 80)}\uff09`;
}
