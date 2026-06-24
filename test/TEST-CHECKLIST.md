# Test Checklist - AI Tools Demo

> For use on 6/25 integration testing & 6/26 demo review

## 1. Environment
- [ ] `npm run dev` starts without errors
- [ ] Browser loads `localhost:3000` correctly
- [ ] `.env.local` has `GROQ_API_KEY` configured
- [ ] `npm run build` builds with 0 errors
- [ ] `npm test` all automated tests pass

## 2. Homepage
- [ ] Two tool cards display correctly
- [ ] Click PDF card navigates to `/pdf-summary`
- [ ] Click Copy Writer card navigates to `/copy-writer`

## 3. PDF Summary Tool
- [ ] Upload area accepts PDF drag-and-drop
- [ ] File name and size shown after upload
- [ ] Non-PDF file shows error: "\u4ec5\u652f\u6301 PDF \u683c\u5f0f\u6587\u4ef6"
- [ ] File >10MB shows error: "\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7 10MB"
- [ ] Valid PDF shows streaming progress then structured result
- [ ] Result shows: core idea, key points, summary, tags
- [ ] Copy button works

## 4. Copy Writer Tool
- [ ] Empty required fields shows error on submit
- [ ] Valid input returns 3 styled copies (formal/casual/grass)
- [ ] Each copy has title, body, cta
- [ ] Copy button works for each style

## 5. Error Handling
- [ ] All error messages are in Chinese
- [ ] API quota error shows Groq console link
- [ ] Invalid key error shows GROQ_API_KEY hint

## 6. Performance
- [ ] Homepage loads < 2s
- [ ] PDF summary returns < 10s (Groq)
- [ ] Copy writer returns < 8s
