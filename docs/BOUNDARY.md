# Input/Output Boundary Definitions

> AI Tools Demo - Updated: 2026-06-24

## PDF Summary Tool

### Input Boundaries

| Dimension | Limit | Behavior When Exceeded | Where Validated |
|---|---|---|---|
| File format | .pdf only | HTTP 400 | Frontend + Server |
| File size | Max 10 MB | HTTP 400 | Frontend + Server |
| Text layer | Must have extractable text | HTTP 422 | Server (pdf-parse) |
| Min text length | At least 50 chars | HTTP 422 | Server |
| Max analysis | First 12,000 chars (~20-30 pages) | Silent truncation | Server |
| Encrypted PDF | Not supported | HTTP 422 | Server |

### Output Constraints

| Field | Constraint | Note |
|---|---|---|
| Core idea | <=30 Chinese chars | Prompt enforced |
| Key points | 4-7 bullets, <=50 chars each | Prompt enforced |
| Summary | 300-500 Chinese chars | Prompt enforced |
| Doc type | Enum: academic/business/tech/contract/policy/news/other | AI inferred |
| Difficulty | Enum: easy/medium/hard | Fixed 3 options |
| Audience | <=15 char phrase | Prompt enforced |

## Copy Writer Tool

### Input Boundaries

| Field | Required | Suggested Length | When Empty |
|---|---|---|---|
| Product name | Yes | 2-20 chars | HTTP 400 |
| Product desc | Yes | 20-300 chars | HTTP 400 |
| Target audience | No | 5-30 chars | Defaults to general consumer |
| Key features | No | Comma-separated | AI extracts from description |

### Output Constraints (per style)

| Field | Constraint |
|---|---|
| title | <=15 Chinese chars |
| body | 80-120 Chinese chars |
| cta | <=10 Chinese chars, starts with verb |
| Styles | Fixed 3: formal / casual / grass |

## API Error Boundaries

| Status | Trigger | Chinese Message |
|---|---|---|
| 400 | Missing required fields | Field-specific message |
| 422 | File content unprocessable | PDF parse error message |
| 500 | AI API error | Translated Chinese message (lib/api-error.ts) |
