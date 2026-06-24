import { NextRequest } from "next/server";
import { aiClient, AI_MODEL } from "@/lib/ai-client";
import { PDF_SUMMARY_PROMPT } from "@/lib/prompts";
import { translateApiError } from "@/lib/api-error";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buf: Buffer) => Promise<{ text: string; numpages: number }> = require("pdf-parse");

function sseEvent(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(sseEvent(data)));
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) { send({ type: "error", message: "\u8bf7\u4e0a\u4f20 PDF \u6587\u4ef6" }); controller.close(); return; }
        if (!file.name.toLowerCase().endsWith(".pdf")) { send({ type: "error", message: "\u4ec5\u652f\u6301 PDF \u683c\u5f0f\u6587\u4ef6" }); controller.close(); return; }
        if (file.size > 10 * 1024 * 1024) { send({ type: "error", message: "\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7 10MB" }); controller.close(); return; }
        send({ type: "progress", stage: "parsing", message: "\u6b63\u5728\u89e3\u6790 PDF\u2026" });
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let pdfText = ""; let numPages = 0;
        try { const data = await pdfParse(buffer); pdfText = data.text; numPages = data.numpages; }
        catch { send({ type: "error", message: "PDF \u89e3\u6790\u5931\u8d25" }); controller.close(); return; }
        if (!pdfText || pdfText.trim().length < 50) { send({ type: "error", message: "PDF \u5185\u5bb9\u8fc7\u5c11\u6216\u65e0\u6cd5\u8bc6\u522b" }); controller.close(); return; }
        send({ type: "progress", stage: "parsed", message: "\u89e3\u6790\u5b8c\u6210\uff0cAI \u5206\u6790\u4e2d\u2026", filename: file.name, num_pages: numPages, char_count: pdfText.length });
        const truncated = pdfText.slice(0, 12000);
        const prompt = PDF_SUMMARY_PROMPT.replace("{CONTENT}", truncated);
        const completion = await aiClient.chat.completions.create({ model: AI_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.3, stream: true });
        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content ?? "";
          if (token) send({ type: "token", text: token });
        }
        send({ type: "done" });
      } catch (err: unknown) { send({ type: "error", message: translateApiError(err) }); }
      finally { controller.close(); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
