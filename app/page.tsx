import Link from "next/link";

const tools = [
  { id: "pdf-summary", icon: "📄", title: "PDF 概括", description: "上传 PDF 文件，AI 自动提取核心主旨、关键要点与一句话总结，快速掌握文档精华。", tags: ["文档处理", "AI 摘要"], href: "/pdf-summary", color: "from-blue-500 to-cyan-500", bgLight: "bg-blue-50", borderColor: "border-blue-200 hover:border-blue-400", tagColor: "bg-blue-100 text-blue-700" },
  { id: "copy-writer", icon: "✍️", title: "文案生成", description: "输入产品名称与描述，AI 一键生成多风格文案：正式发布、活泼种草、社交媒体版本任你选。", tags: ["内容创作", "多风格"], href: "/copy-writer", color: "from-violet-500 to-purple-500", bgLight: "bg-violet-50", borderColor: "border-violet-200 hover:border-violet-400", tagColor: "bg-violet-100 text-violet-700" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">AI</div>
            <span className="font-semibold text-slate-800 text-lg">多功能智能助手平台</span>
          </div>
          <span className="text-sm text-slate-400 hidden sm:block">Powered by Groq</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">AI 工具集</h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">集成多种实用 AI 工具，提升你的工作效率。选择下方工具开始体验。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.href}>
              <div className={`group relative rounded-2xl border-2 ${tool.borderColor} bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${tool.bgLight} flex items-center justify-center text-3xl`}>{tool.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{tool.description}</p>
                    <div className="flex gap-2">{tool.tags.map((tag) => (<span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-medium ${tool.tagColor}`}>{tag}</span>))}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-slate-400">AI 工具集 Demo · 多功能智能助手平台 · Built with Next.js 16 + Groq</div>
      </footer>
    </div>
  );
}
