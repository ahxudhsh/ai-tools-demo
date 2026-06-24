import { NextRequest, NextResponse } from "next/server";
import { aiClient, AI_MODEL } from "@/lib/ai-client";
import { COPY_WRITER_PROMPT } from "@/lib/prompts";
import { translateApiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, productDesc, targetAudience, keyFeatures } = body;
    if (!productName || !productDesc) {
      return NextResponse.json({ error: "\u4ea7\u54c1\u540d\u79f0\u548c\u63cf\u8ff0\u4e3a\u5fc5\u586b\u9879" }, { status: 400 });
    }
    const prompt = COPY_WRITER_PROMPT
      .replace("{PRODUCT_NAME}", productName.trim())
      .replace("{PRODUCT_DESC}", productDesc.trim())
      .replace("{TARGET_AUDIENCE}", (targetAudience ?? "\u5927\u4f17\u6d88\u8d39\u8005").trim())
      .replace("{KEY_FEATURES}", (keyFeatures ?? "").trim() || "\u5f85\u4ece\u63cf\u8ff0\u4e2d\u63d0\u70bc");
    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    let result;
    try { result = JSON.parse(raw); } catch { return NextResponse.json({ error: "AI \u8fd4\u56de\u683c\u5f0f\u5f02\u5e38\uff0c\u8bf7\u91cd\u8bd5" }, { status: 500 }); }
    return NextResponse.json({ success: true, copies: result });
  } catch (err: unknown) {
    return NextResponse.json({ error: translateApiError(err) }, { status: 500 });
  }
}
