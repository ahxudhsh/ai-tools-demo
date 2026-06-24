# Copy Writer Prompt

**Tool**: Copy Writer
**Model**: Groq llama-3.3-70b-versatile
**Temperature**: 0.8
**Output Format**: JSON Object (3 styles)

## 3 Style Comparison

| Dimension | Formal | Casual | Grass |
|---|---|---|---|
| Tone | Authoritative, data-driven | Energetic, friendly | 1st person, authentic |
| Pronoun | Brand/3rd person | You (2nd) | I/We (1st) |
| Emoji | None | 1-3, natural | Optional |
| Channel | Website, press, B2B | WeChat, Weibo | Xiaohongshu, Douyin |

## Input Example

```
Product: Aurora Thermos
Description: 316 medical-grade stainless steel, vacuum double-layer, 12hr temp retention, 72mm wide mouth, 500ml, 280g
Audience: Office workers, fitness enthusiasts
Features: Durable, easy to clean, long-lasting warmth
```

## Output Example

```json
{
  "formal": {
    "title": "Aurora Thermos - Professional Temperature Solution",
    "body": "316 medical stainless steel inner, vacuum insulation technology, maintaining temperature for 12 hours. 72mm wide opening for easy cleaning.",
    "cta": "Learn More"
  },
  "casual": {
    "title": "12hr warmth? Not kidding!",
    "body": "Morning coffee still hot at 5pm! Aurora uses medical-grade steel, 72mm wide for super easy cleaning. Office workers must-have!",
    "cta": "Get Yours Now"
  },
  "grass": {
    "title": "Used 3 months, genuinely recommend",
    "body": "Tried several thermoses before, none kept temp well. Switched to Aurora and my morning Americano stays warm all afternoon. 72mm wide mouth, no more smell issues.",
    "cta": "Must Try!"
  }
}
```

## Output Field Constraints

| Field | Constraint |
|---|---|
| title | <=15 Chinese chars |
| body | 80-120 Chinese chars |
| cta | <=10 Chinese chars, starts with verb |

## Tips

| Scenario | Input Tip |
|---|---|
| Holiday promotion | Add "Double 11/Spring Festival" in description |
| B2B product | Set audience to "enterprise decision makers" |
| Personal brand | Include "founder story" in description |
| Feature product | Use specific numbers in features (e.g. "saves 3 hours") |
