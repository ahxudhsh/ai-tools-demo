# Known Issues & Improvement Roadmap

> AI Tools Demo - Updated: 2026-06-24

## Current Known Issues

| # | Description | Severity | Scope | Fix Direction |
|---|---|---|---|---|
| 1 | Scanned PDFs (image-based) cannot extract text | Medium | PDF Summary | Integrate OCR (Tesseract.js or cloud API) |
| 2 | Documents >12000 chars only analyze first portion | Medium | PDF Summary | Map-Reduce chunked summarization |
| 3 | No fallback when Groq free quota is exhausted | High | All | API key pool or multi-provider routing |
| 4 | Copy writer has no history - results lost on page reload | Low | Copy Writer | localStorage persistence |
| 5 | Mobile PDF drag-and-drop doesn't work | Low | PDF Summary | Detect device type, show click-only upload |
| 6 | SSE connection may drop after long inactivity | Low | PDF Summary | Auto-reconnect logic |

## Fixed Issues (Archive)

| # | Description | Fixed In | Solution |
|---|---|---|---|
| F1 | pdf-parse v2.x API incompatible | v1.0 | Downgrade to pdf-parse@1.1.1 |
| F2 | Turbopack panic on multibyte chars | v1.0 | Move Chinese strings to lib/prompts.ts as arrays |
| F3 | AI errors shown in English | v1.1 | Create lib/api-error.ts for Chinese translation |
| F4 | 402 Insufficient Balance no Chinese prompt | v1.1 | Added Groq quota-specific message |
| F5 | PDF streaming detail field showed only first char | v1.2 | Fix parseStreamText offset calculation |
| F6 | Summary too short (100-150 chars) | v1.2 | Update prompt to require 300-500 chars |

## Next Steps

### Near-term (P1)
- [ ] OCR support for scanned PDFs
- [ ] API key pool for Groq quota failover
- [ ] Single-style refresh button for copy writer

### Mid-term (P2)
- [ ] Map-Reduce long document summarization
- [ ] localStorage history for copy writer
- [ ] Mobile upload optimization

### Long-term (P3)
- [ ] Word/TXT format support
- [ ] Batch PDF export
- [ ] User-configurable prompts UI
