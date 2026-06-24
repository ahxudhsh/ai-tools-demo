# PDF Summary Prompt

**Tool**: PDF Summary
**Model**: Groq llama-3.3-70b-versatile
**Temperature**: 0.3
**Output Format**: Structured plaintext (streaming)

## Output Fields

| Field | Constraint | Usage |
|---|---|---|
| Core idea | <=30 Chinese chars | Blue gradient card |
| Key points | 4-7 bullets, <=50 chars each, verb-first | Numbered list |
| Summary | 300-500 Chinese chars | Body paragraph |
| Doc type | Enum: academic/business/tech/contract/policy/news/other | Blue tag |
| Difficulty | Enum: easy/medium/hard | Color tag |
| Audience | <=15 char phrase | Gray tag |

## Input Example

```
Document: Git Workflow Guidelines (PDF, 8 pages, technical doc)

Content (first 12000 chars):
Git Version Control Standards
1. Branch Naming Conventions
   Main: main/master
   Development: develop
   Feature: feature/xxx
   Hotfix: hotfix/xxx
2. Commit Message Format
   Format: <type>(<scope>): <subject>
   Types: feat / fix / docs / style / refactor / test / chore
```

## Output Example

```
Core idea: Standardize team Git workflow with unified branch naming and commit format

Key points:
- Adopt main/develop/feature/hotfix 4-tier branch structure
- Enforce feat/fix/docs type prefixes for commit messages
- Require all feature branches to merge via PR, no direct pushes to main
- Configure commit-lint and husky for automated format validation

Summary: [300-500 char detailed summary...]

Doc type: Technical Documentation
Difficulty: Easy
Audience: Software Engineers
```

## Version History

| Version | Changes |
|---|---|
| v1 | Initial JSON format output |
| v2 | Added audience field, fixed difficulty enum, enforced verb-first points |
| v3 | Changed to structured plaintext + SSE streaming, extended summary to 300-500 chars |
