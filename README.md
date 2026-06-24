# AI Tools Demo

> 多功能智能助手平台 · 2026 Sprint Demo
> 基于 **Next.js 16 + Groq API** 构建，包含 PDF 概括与文案生成两个可演示 AI 工具。

## 功能预览

| 工具 | 描述 | 路由 |
|---|---|---|
| PDF 概括 | 上传 PDF，AI 提取核心主旨、关键要点、文档摘要 | `/pdf-summary` |
| 文案生成 | 输入产品信息，一键生成正式/活泼/种草三版营销文案 | `/copy-writer` |

## 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/ahxudhsh/ai-tools-demo.git
cd ai-tools-demo

# 2. 安装依赖
npm install

# 3. 配置 API Key
cp .env.local.example .env.local
# 编辑 .env.local 并填入 GROQ_API_KEY
# 申请地址: https://console.groq.com/

# 4. 启动开发服务器
npm run dev
```

打开浏览器访问: http://localhost:3000

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm test             # 运行所有自动化测试
npm run test:watch   # 监听模式
npm run test:coverage  # 生成测试覆盖率报告
```

人工测试清单见 [test/TEST-CHECKLIST.md](test/TEST-CHECKLIST.md)

## 项目结构

```
ai-tools-demo/
├── app/
│   ├── page.tsx              # 首页工具导航
│   ├── pdf-summary/page.tsx  # PDF 概括页面
│   ├── copy-writer/page.tsx  # 文案生成页面
│   └── api/
│       ├── pdf-summary/route.ts  # SSE 流式 API
│       └── copy-writer/route.ts   # 文案 JSON API
├── lib/
│   ├── ai-client.ts          # AI 客户端配置 (Groq)
│   ├── api-error.ts          # 错误信息中文化
│   └── prompts.ts            # 提示词常量
├── prompts/               # 提示词说明文档
├── test/                  # 测试文件
├── docs/                  # 项目文档
├── FRAMEWORK.md           # 框架选型说明
├── KNOWN-ISSUES.md        # 已知问题清单
└── README.md
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 4
- **AI**: Groq API (Llama 3.3 70B, 免费高速)
- **PDF 解析**: pdf-parse@1.1.1
- **测试**: Vitest
- **部署**: 云效 / Vercel

详细框架选型说明见 [FRAMEWORK.md](./FRAMEWORK.md)

## License

MIT
