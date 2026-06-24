# Prompts Index

> Actual code is in `lib/prompts.ts`. These .md files are documentation only.

## Files

| File | Tool | Description |
|---|---|---|
| [pdf-summary.md](pdf-summary.md) | PDF Summary | Structured plaintext format with examples |
| [copy-writer.md](copy-writer.md) | Copy Writer | 3-style prompts with examples |

## How to Modify

Edit `lib/prompts.ts` - the .md files are not read by code.

```
lib/prompts.ts
  PDF_SUMMARY_PROMPT   <- used by PDF summary API
  COPY_WRITER_PROMPT   <- used by copy writer API
```

## Temperature Tuning

| Tool | Current | Range | Note |
|---|---|---|---|
| PDF Summary | 0.3 | 0.1-0.4 | Lower = more accurate |
| Copy Writer | 0.8 | 0.6-1.0 | Higher = more creative |

## Truncation Length (PDF Summary)

```ts
// app/api/pdf-summary/route.ts
const truncated = pdfText.slice(0, 12000); // change this
```

## Model Switch

Edit `lib/ai-client.ts`:
```ts
export const AI_MODEL = "llama-3.3-70b-versatile"; // Groq fast free
// export const AI_MODEL = "llama-3.1-8b-instant"; // even faster
```
