"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

type Stage = "idle" | "parsing" | "streaming" | "done" | "error";

interface FileMeta {
  filename: string;
  num_pages: number;
  char_count: number;
}

interface ParsedResult {
  one_sentence: string;
  key_points: string[];
  summary: string;
  doc_type: string;
  difficulty: string;
  audience: string;
}

function parseStreamText(text: string): ParsedResult {
  const get = (label: string, nextLabel?: string): string => {
    const labelIdx = text.indexOf(label);
    if (labelIdx === -1) return "";
    const contentStart = labelIdx + label.length;
    if (!nextLabel) {
      return text.slice(contentStart).split("\n").find((l) => l.trim()) ?? "";
    }
    const nextIdx = text.indexOf(nextLabel, contentStart);
    const raw = nextIdx === -1 ? text.slice(contentStart) : text.slice(contentStart, nextIdx);
    return raw.trim();
  };

  const one_sentence = get("\u6838\u5fc3\u4e3b\u65e8\uff1a", "\u5173\u952e\u8981\u70b9\uff1a").split("\n").find((l) => l.trim()) ?? "";
  const kpBlock = get("\u5173\u952e\u8981\u70b9\uff1a", "\u8be6\u7ec6\u6458\u8981\uff1a");
  const key_points = kpBlock
    .split("\n")
    .map((l) => l.replace(/^[\u2022\-\*\d]+[.\u3002)\uff09]?\s*/, "").trim())
    .filter((l) => l.length > 0);
  const summary = get("\u8be6\u7ec6\u6458\u8981\uff1a", "\u6587\u6863\u7c7b\u578b\uff1a");
  const doc_type = get("\u6587\u6863\u7c7b\u578b\uff1a", "\u9605\u8bfb\u96be\u5ea6\uff1a").split("\n").find((l) => l.trim()) ?? "";
  const difficulty = get("\u9605\u8bfb\u96be\u5ea6\uff1a", "\u9002\u5408\u8bfb\u8005\uff1a").split("\n").find((l) => l.trim()) ?? "";
  const audience = get("\u9002\u5408\u8bfb\u8005\uff1a").split("\n").find((l) => l.trim()) ?? "";

  return { one_sentence, key_points, summary, doc_type, difficulty, audience };
}

export default function PdfSummaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [stageMsg, setStageMsg] = useState("");
  const [streamText, setStreamText] = useState("");
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const streamTextRef = useRef("");

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) { setErrorMsg("\u4ec5\u652f\u6301 PDF \u683c\u5f0f\u6587\u4ef6"); return; }
    if (f.size > 10 * 1024 * 1024) { setErrorMsg("\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7 10MB"); return; }
    setErrorMsg(""); setResult(null); setStage("idle"); setStreamText(""); streamTextRef.current = ""; setFile(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const reset = () => { setFile(null); setResult(null); setStage("idle"); setStreamText(""); streamTextRef.current = ""; setFileMeta(null); setErrorMsg(""); };

  const handleSubmit = async () => {
    if (!file) return;
    setStage("parsing"); setStageMsg("\u6b63\u5728\u89e3\u6790 PDF\u2026"); setErrorMsg(""); setResult(null); setStreamText(""); streamTextRef.current = "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/pdf-summary", { method: "POST", body: formData });
      if (!res.ok || !res.body) { setErrorMsg("\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"); setStage("error"); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const raw = line.replace(/^data: /, "").trim();
          if (!raw) continue;
          let evt: Record<string, unknown>;
          try { evt = JSON.parse(raw); } catch { continue; }
          if (evt.type === "error") { setErrorMsg(evt.message as string); setStage("error"); return; }
          if (evt.type === "progress") {
            setStageMsg(evt.message as string);
            if (evt.stage === "parsed") { setFileMeta({ filename: evt.filename as string, num_pages: evt.num_pages as number, char_count: evt.char_count as number }); setStage("streaming"); }
          }
          if (evt.type === "token") { const token = evt.text as string; streamTextRef.current += token; setStreamText(streamTextRef.current); }
          if (evt.type === "done") { const parsed = parseStreamText(streamTextRef.current); setResult(parsed); setStage("done"); }
        }
      }
    } catch { setErrorMsg("\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u8fde\u63a5\u540e\u91cd\u8bd5"); setStage("error"); }
  };

  const copyResult = () => {
    if (!result || !fileMeta) return;
    const text = [`[${fileMeta.filename}] AI \u6458\u8981`, "", `\u6838\u5fc3\u4e3b\u65e8\uff1a${result.one_sentence}`, "", "\u5173\u952e\u8981\u70b9\uff1a", ...result.key_points.map((p, i) => `${i + 1}. ${p}`), "", "\u8be6\u7ec6\u6458\u8981\uff1a", result.summary].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColor: Record<string, string> = {
    "\u7b80\u5355": "bg-green-100 text-green-700",
    "\u4e2d\u7b49": "bg-yellow-100 text-yellow-700",
    "\u8f83\u96be": "bg-red-100 text-red-700",
  };

  const isLoading = stage === "parsing" || stage === "streaming";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#128196;</span>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">PDF \u6982\u62ec</h1>
              <p className="text-xs text-slate-400">\u4e0a\u4f20 PDF\uff0cAI \u63d0\u53d6\u6838\u5fc3\u5185\u5bb9</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {stage !== "done" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="font-semibold text-slate-700 mb-4">\u4e0a\u4f20 PDF \u6587\u4ef6</h2>
            <div
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer ${
                isDragging ? "border-blue-400 bg-blue-50" : file ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-300"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => !isLoading && document.getElementById("file-input")?.click()}
            >
              <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {file ? (
                <div className="space-y-2">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-3xl mx-auto">&#128196;</div>
                  <p className="font-semibold text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  {!isLoading && <button className="text-xs text-blue-500 hover:text-blue-700 underline mt-1" onClick={(e) => { e.stopPropagation(); reset(); }}>\u91cd\u65b0\u9009\u62e9</button>}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl mx-auto">&#128194;</div>
                  <p className="text-slate-600 font-medium">\u62d6\u62fd PDF \u5230\u6b64\u5904\uff0c\u6216\u70b9\u51fb\u9009\u62e9\u6587\u4ef6</p>
                  <p className="text-sm text-slate-400">\u652f\u6301 PDF \u683c\u5f0f\uff0c\u6700\u5927 10MB</p>
                </div>
              )}
            </div>
            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                &#9888; {errorMsg}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="mt-6 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>{stageMsg}</>) : <>&#10024; \u5f00\u59cb AI \u6982\u62ec</>}
            </button>
          </div>
        )}
        {stage === "streaming" && streamText && (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-semibold text-slate-700 text-sm">AI \u6b63\u5728\u5206\u6790\u2026</h3>
              {fileMeta && <span className="ml-auto text-xs text-slate-400">{fileMeta.num_pages} \u9875 &middot; {fileMeta.char_count.toLocaleString()} \u5b57\u7b26</span>}
            </div>
            <pre className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
              {streamText}
              <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />
            </pre>
          </div>
        )}
        {stage === "done" && result && fileMeta && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">&#128196;</span>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{fileMeta.filename}</p>
                  <p className="text-xs text-slate-400">{fileMeta.num_pages} \u9875 &middot; {fileMeta.char_count.toLocaleString()} \u5b57\u7b26</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {result.doc_type && <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{result.doc_type}</span>}
                {result.difficulty && <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColor[result.difficulty] ?? "bg-slate-100 text-slate-700"}`}>{result.difficulty}</span>}
                {result.audience && <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">\u9002\u5408\uff1a{result.audience}</span>}
                <button onClick={reset} className="ml-2 text-sm text-slate-400 hover:text-slate-600 underline">\u91cd\u65b0\u4e0a\u4f20</button>
              </div>
            </div>
            {result.one_sentence && (
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <p className="text-xs font-medium opacity-80 mb-2 uppercase tracking-wide">\u4e00\u53e5\u8bdd\u6838\u5fc3\u4e3b\u65e8</p>
                <p className="text-xl font-bold leading-relaxed">{result.one_sentence}</p>
              </div>
            )}
            {result.key_points.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">&#127919; \u5173\u952e\u8981\u70b9</h3>
                <ul className="space-y-3">
                  {result.key_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <p className="text-slate-700 text-sm leading-relaxed pt-0.5">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.summary && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">&#128221; \u8be6\u7ec6\u6458\u8981</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{result.summary}</p>
              </div>
            )}
            <button onClick={copyResult} className={`w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${copied ? "border-green-300 bg-green-50 text-green-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {copied ? "\u2713 \u5df2\u590d\u5236\u5230\u526a\u8d34\u677f" : "&#128203; \u590d\u5236\u5168\u90e8\u6458\u8981"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
