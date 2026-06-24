# Framework Selection

> AI Tools Demo - 2026 Sprint
> Decision: **Next.js 16 (App Router) + Groq API**

## Background

Build a demonstrable AI tool set in one week with these constraints:
- 3-day dev window (Tue framework, Wed dev, Thu integration, Fri demo)
- Free AI API (Groq free quota)
- Secure: API key must not be exposed to browser
- Deployable: stable online demo for review

## Candidates Evaluated

### Streamlit (Python)
- Pro: Zero frontend skill needed, few lines of code
- Con: Fixed UI, poor multi-tool integration, no streaming

### Gradio (Python)
- Pro: Designed for AI model demos, easy sharing
- Con: Poor multi-tool organization, share links expire in 72h

### Flask + HTML (Python)
- Pro: Full control, good for learning HTTP
- Con: Two codebases, too slow for 1-week sprint

### Next.js 16 (Selected)
- Pro: Unified full-stack, API key secure on server, streaming SSE built-in
- Con: Higher learning curve

## Why Next.js

1. **Security**: API Key stays on server side, never exposed to browser
2. **Streaming**: Web Streaming API natively supports SSE for real-time AI output
3. **Single repo**: Frontend pages + backend API routes in one codebase
4. **PDF parsing**: pdf-parse requires Node.js, only works server-side
5. **Deployment**: Vercel / Alibaba Cloud DevOps one-click deploy

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.x App Router | Full-stack unified |
| Language | TypeScript | 5+ | Type safety |
| Style | Tailwind CSS | 4+ | Rapid UI dev |
| AI SDK | openai (npm) | 6.x | Groq/DeepSeek/OpenAI compat |
| AI Model | Groq Llama 3.3 70B | - | Free, fast (~1-2s) |
| PDF | pdf-parse | 1.1.1 | Server-side PDF text extraction |
| Testing | Vitest | 4.x | Unit + integration tests |
| Deploy | Vercel / Alibaba Cloud | - | Stable CN access |

## Why Groq (not DeepSeek)

| | DeepSeek | Groq |
|---|---|---|
| Free quota | Small signup bonus | Daily free quota, no credit card |
| Speed | 2-5s | 0.5-2s (much faster for demo) |
| CN access | OK | OK |
| OpenAI SDK compat | Yes | Yes |

Switch cost: only change `baseURL` and env var name in `lib/ai-client.ts`.

## Known Limitations

| Limitation | Notes | Potential Fix |
|---|---|---|
| PDF text layer only | Scanned images fail | OCR service (Alibaba Cloud) |
| 12000 char truncation | Long docs lose latter half | Map-Reduce chunking |
| No user history | Results lost on reload | Supabase DB |
| Fixed 3 copy styles | Can't customize | User-configurable style input |
