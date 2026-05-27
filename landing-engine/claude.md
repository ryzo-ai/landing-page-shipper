# Landing Engine — Claude Reference

## Project Overview
This is "landing-engine" — a Next.js 14 bulk landing page generator.
It generates on-brand, configurable landing pages from JSON content configs
and deploys them to Vercel. Built for client work and own projects.

## Key Files
- /theme.config.ts — visual design tokens (colors, fonts, border radius, design style)
- /content/*.json — one JSON file per landing page variant
- /tasks/todo.md — active task plans
- /tasks/lessons.md — mistake log and learned patterns

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Framer Motion (animations)
- Vercel (deployment)

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: IMMEDIATELY update both tasks/lessons.md AND claude.md
- In claude.md, add the lesson under a "## Learned Corrections" section at the bottom
- Format each lesson as: [date] — what went wrong + the rule to prevent it
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review the "## Learned Corrections" section at the START of every new session
- Treat claude.md as a living document — it should get smarter over time

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -> then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. **Plan First**: Write plan to tasks/todo.md with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review to tasks/todo.md
6. **Capture Lessons**: Update tasks/lessons.md after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Landing Page Architecture

### Content System
Each landing page is defined by a JSON file in /content/.
Example fields: slug, meta_title, meta_description, headline, subheadline, cta_text, cta_url.
New page variants are created by adding a new JSON file — no code changes needed.

### Theme System
All visual tokens live in theme.config.ts.
To restyle: change values in this file only.
Design style toggle: "flat" | "gradient" | "skeuomorphic"
Never hardcode colors, fonts, or border radius values in components.

### Bulk Generation
To generate 100 page variants: provide a keyword list and run the generation script.
Each keyword produces one JSON content config.
All pages are statically generated at build time for maximum speed.

### Deployment
Deploy via Vercel CLI or git push to main.
Each slug in content/*.json becomes a route at /[slug].

## Google Ads Integration

### Quality Score Strategy
Every landing page is built for maximum Google Ads Quality Score:
- Page URL, meta title, H1, and hero copy must all reflect the target keyword
- Each ad group or keyword cluster gets its own static page via a unique JSON config
- Never use one generic page for multiple campaigns

### URL Parameter Override System
All landing pages support dynamic copy injection via URL parameters.
A useAdParams() hook reads these params on load and overrides JSON content fields.

Parameter naming convention:
- h = hero headline override
- sh = hero subheadline override
- cta = CTA button text override
- kw = keyword (for tracking/analytics only, not displayed)

Example URL:
/lp/crm-for-agencies?h=Best+CRM+For+Agencies&sh=Try+free+for+14+days&cta=Start+Now&kw=crm+software

Fallback behavior:
- If no URL params present, render JSON content as normal
- Never break the page if params are missing or malformed

### Files
- /hooks/useAdParams.ts — reads and returns URL params with fallback to null
- All hero section props must accept optional overrides from useAdParams()

## Learned Corrections
<!-- Claude adds entries here automatically after every user correction -->
<!-- Format: [YYYY-MM-DD] — Mistake made → Rule to prevent it -->
