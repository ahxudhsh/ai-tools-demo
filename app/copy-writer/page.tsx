"use client";

import { useState } from "react";
import Link from "next/link";

interface CopyItem {
  title: string;
  body: string;
  cta: string;
}

interface CopyResult {
  success: boolean;
  copies: {
    formal: CopyItem;
    casual: CopyItem;
    grass: CopyItem;
  };
  error?: string;
}

const STYLE_CONFIG = {
  formal: {
    label: "\u6b63\u5f0f\u4e13\u4e1a",
    icon: "[\u6b63\u5f0f]",
    desc: "\u5546\u52a1\u573a\u666f / \u5b98\u65b9\u53d1\u5e03",
    color: "border-slate-300",
    headerBg: "bg-slate-700",
    tagBg: "bg-slate-100 text-slate-600",
  },
  casual: {
    label: "\u6d3b\u6cfc\u6709\u8da�",
    icon: "[\u6d3b\u6cfc]",
    desc: "\u5e74\u8f7b\u7528\u6237 / \u793e\u4ea4\u5a92\u4f53",
    color: "border-violet-300",
    headerBg: "bg-violet-600",
    tagBg: "bg-violet-100 text-violet-600",
  },
  grass: {
    label: "\u79cd\u8349\u5b89\u5229",
    icon: "[\u79cd\u8349]",
    desc: "\u5c0f\u7ea2\u4e66 / \u6296\u97f3\u98ce\u683c",
    color: "border-pink-300",
    headerBg: "bg-pink-500",
    tagBg: "bg-pink-100 text-pink-600",
  },
} as const;

type StyleKey = keyof typeof STYLE_CONFIG;

export default function CopyWriterPage() {
  const [form, setForm] = useState({
    productName: "",
    productDesc: "",
    targetAudience: "",
    keyFeatures: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.productDesc.trim()) {
      setError("\u8bf7\u586b\u5199\u4ea7\u54c1\u540d\u79f0\u548c\u63cf\u8ff0");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/copy-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: CopyResult = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");
      } else {
        setResult(data);
      }
    } catch {
      setError("\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u8fde\u63a5\u540e\u91cd\u8bd5");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (style: StyleKey, item: CopyItem) => {
    const text = `${item.title}\n\n${item.body}\n\n${item.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(style);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const reset = () => { setResult(null); setError(""); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#9999;&#65039;</span>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">\u6587\u6848\u751f\u6210</h1>
              <p className="text-xs text-slate-400">AI \u4e00\u952e\u751f\u6210\u591a\u98ce\u683c\u8425\u9500\u6587\u6848</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <h2 className="font-semibold text-slate-700 mb-6">\u586b\u5199\u4ea7\u54c1\u4fe1\u606f</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  \u4ea7\u54c1\u540d\u79f0 <span className="text-red-500">*</span>
                </label>
                <input name="productName" value={form.productName} onChange={handleChange} placeholder="\u4f8b\uff1a\u8f7b\u989c\u76f8\u673a Pro" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">\u76ee\u6807\u53d7\u4f17</label>
                <input name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="\u4f8b\uff1a18-30 \u5c81\u7231\u62cd\u7167\u7684\u5973\u6027\u7528\u6237" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                \u4ea7\u54c1\u63cf\u8ff0 <span className="text-red-500">*</span>
              </label>
              <textarea name="productDesc" value={form.productDesc} onChange={handleChange} rows={3} placeholder="\u4f8b\uff1a\u4e00\u6b3e AI \u7f8e\u989c\u76f8\u673a App" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">\u6838\u5fc3\u5356\u70b9</label>
              <input name="keyFeatures" value={form.keyFeatures} onChange={handleChange} placeholder="\u4f8b\uff1a\u514d\u8d39\u4f7f\u7528\uff0c\u65e0\u5e7f\u544a\uff0c\u4e00\u952e\u5bfc\u51fa" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm" />
            </div>
            {error && (<div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">&#9888; {error}</div>)}
            <button type="submit" disabled={loading} className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold text-base hover:from-violet-600 hover:to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>AI \u521b\u4f5c\u4e2d\uff0c\u8bf7\u7a0d\u5019\u2026</> : <>&#10024; \u751f\u6210\u4e09\u7248\u6587\u6848</>}
            </button>
          </form>
        </div>
        {result && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-lg">\u751f\u6210\u7ed3\u679c</h2>
              <button onClick={reset} className="text-sm text-slate-400 hover:text-slate-600 underline">\u91cd\u65b0\u751f\u6210</button>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {(Object.keys(STYLE_CONFIG) as StyleKey[]).map((style) => {
                const cfg = STYLE_CONFIG[style];
                const item = result.copies[style];
                return (
                  <div key={style} className={`bg-white rounded-2xl border-2 ${cfg.color} shadow-sm overflow-hidden`}>
                    <div className={`${cfg.headerBg} text-white px-6 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span>{cfg.icon}</span>
                        <span className="font-semibold">{cfg.label}</span>
                        <span className="text-white/70 text-xs">{cfg.desc}</span>
                      </div>
                      <button onClick={() => copyToClipboard(style, item)} className="text-white/80 hover:text-white text-xs border border-white/30 rounded-lg px-2.5 py-1">
                        {copiedKey === style ? "\u2713 \u5df2\u590d\u5236" : "\ud83d\udccb \u590d\u5236"}
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cfg.tagBg}`}>\u6807\u9898</p>
                        <p className="font-bold text-slate-800 text-lg">{item.title}</p>
                      </div>
                      <div>
                        <p className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cfg.tagBg}`}>\u6b63\u6587</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <p className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cfg.tagBg}`}>\u884c\u52a8\u53f7\u53ec</p>
                        <p className="font-semibold text-slate-800">{item.cta}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { const allText = (Object.keys(STYLE_CONFIG) as StyleKey[]).map((s) => { const cfg = STYLE_CONFIG[s]; const item = result.copies[s]; return `=== ${cfg.label} ===\n\u6807\u9898\uff1a${item.title}\n\n\u6b63\u6587\uff1a${item.body}\n\nCTA\uff1a${item.cta}`; }).join("\n\n"); navigator.clipboard.writeText(allText); }} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2">
              &#128203; \u590d\u5236\u5168\u90e8\u4e09\u7248\u6587\u6848
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
