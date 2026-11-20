# NIRVAAH — Product Truth and Development Rules

**Version:** 1.4 · 20 November 2026 · A1–A11 consolidated with A12–A16 safety and delivery corrections in `MEMORY.md` §3  
**Applies to:** Atherva, Smith and any Antigravity coding agent working in this repository.

This file is the implementation rulebook. If it contradicts an actual security requirement, the stronger security rule wins. If it contradicts the approved PRD, stop and reconcile before changing code.

## 1. What the product must never pretend

1. An **AI answer** is not verified business data. Calculations and status checks come from validated records and deterministic rules.
2. A **mock or imported source** is not a connected Google Sheet. Always show the exact source mode.
3. A **status update** is not a payment, delivered message or customer response. Describe it accurately.
4. A **proposal** is not an action. No consequential write occurs until the user reviews and approves it.
5. A **green badge** is not proof of persistence. Confirm source write-back by re-reading the actual value.
6. **Future features** (OCR, voice, subscriptions, multi-tool integrations, roles) stay labelled roadmap until working and tested.
7. **One working demo** is not proof of product-market fit, a production-ready ERP, enterprise security or customer traction.
8. **A WhatsApp draft or opened chat** is not a sent or delivered message. A `contacted` record may only mean **the operator explicitly attested manual sending**; Nirvaah cannot verify delivery without a separate provider integration (not part of P0).
9. **An unconfirmed advance** does not prove the entire order amount is outstanding. Show exactly which value and timestamp drive a filtered result.
10. **₹2,000 / 48h are example parameters from a pitch slide, not universal business policies.** In P0 a merchant may change the amount and delay without a code change; each preset's money field and clock are fixed and visible, and selectors for them are P1 (A1).

## 2. Authoritative files and scope

- `product/PRD.md`: target user, problem, features and acceptance criteria.
- `architecture/ARCHITECTURE.md`: source of truth for data contracts, routes, AI and write boundaries.
- `design/DESIGN.md`: UX composition, visual tokens and truthful states.
- `TASKS.md`: current milestones, ownership, verification and blockers.
- `MEMORY.md`: concise decisions and actual progress; update after meaningful verified changes.

Do not build a competing Next.js project at the repository root. The deployed code lives under **`web/`**. The source repository is **`atherva15/Nirvaah`**, with a single Git history. Existing `web/AGENTS.md` belongs to the generated scaffold; inspect before making changes rather than assuming it is a completed product brief.

## 3. Business-rule invariants (P0)

| Rule | Meaning | Reject / explain |
|---|---|---|
| BR-01 | Outstanding balance = validated total - validated paid, in integer paise. | Negative totals, paid > total, invalid decimals. |
| BR-02 | Payment needs attention if outstanding > 0 or source status is unpaid/unconfirmed. | Flag mismatch between computed balance and source status; do not silently override. |
| BR-03 | **Parameterization:** thresholds are validated **per request**. Plans carry rupees and `{ amount, unit }` durations; server code converts to paise and hours (e.g. `totalInr > 2000` with `advanceWait > 48 hours`, or `outstandingInr > 5000` with `orderAge > 72 hours`) (A2). | Reject hard-coded ₹2,000/48h in the rule engine, invalid money/duration values and unauthorized fields/operators. |
| BR-04 | **Field and clock meaning (A1):** total amount, outstanding amount, advance wait and order age are distinct allowlisted fields. In P0 each preset fixes one field and one clock and shows them in its chips; ties sort by stable order ID. | Never guess silently: the interpretation is always visible. No silent fallback between timestamps; a missing selected clock goes to Needs Review. Selectors and clarification prompts are P1. |
| BR-05 (P1) | Overdue deadline = `dueAt < now` for work not marked complete; **dueAt is not part of the nine-column P0 Sheet**. | Do not accidentally build a due-date timeline or infer due date in P0. |
| BR-06 | Each record has a unique stable `orderId`. | Duplicate IDs are rejected before action. |
| BR-07 | Every order shown as urgent has a source-backed reason and rule ID. | No model-invented totals or reasons. |
| BR-08 | Only `followup_status` is P0 writable; `assigned_to` requires a separately approved contract after the demo. | Reject changes to amounts, payments, permissions or any unapproved field. |
| BR-09 | Cancel, timeout or failed approval never shows a success receipt. | Display truthful retry guidance and no external effect claim. |
| BR-10 | Recheck current source value and stable ID immediately before write. | Stale state triggers re-preview; single-user demo is not atomic transaction guarantee. |
| BR-11 | `contact_permission` defaults to `unknown`; only explicitly `allowed` permits generation of an external customer follow-up draft/link. | Denied/unknown/missing permission → no Gemini drafting, no `wa.me` link, no `contacted` update. |
| BR-12 | `pending → reviewed` records internal review, **not sending**. `pending/drafted → contacted` (P1, A10) requires a distinct explicit operator attestation after actual manual send and subsequent approved record update. | Opening a link, creating a draft or clicking Back is not contact proof. |
| BR-13 | CSV input is read-only in-place; an approved change can produce a **new downloadable CSV** (export is P1, A6). | Never claim original CSV source was synced/changed. |
| BR-14 | Execute accepts only an **unguessable, server-stored `actionId` bound to an authorized operator/session**. On publicly deployed Cloud Run, durable Firestore action state is required for cross-restart replay control (A3/A12/A13). | Never accept browser old/new values; if no durable store or auth, **disable public writes**. `max-instances=1` does not confer persistence. |
| BR-15 | Rule functions take `now` as a parameter; a pinned `NIRVAAH_NOW` is always labelled "Demo clock" in the UI (A4). | Never read the system clock inside a rule. |
| BR-16 | Durable actions use a one-time claimed state; a crash between claim and Sheets verification may leave `uncertain` (A13). | Never automatically retry a possibly applied external write; inspect the Sheet and reconcile manually. |

Use explicit timezone semantics (Asia/Kolkata for displayed times; UTC instants internally). Handle missing values, duplicated action requests and invalid rows with visible error states, not fabricated defaults. Do not let an AI model compute these facts.

## 4. AI boundary

**Allowed:** Interpret intent, suggest permitted UI modules/filters/groups, summarize already-computed results, draft an unsent follow-up **only after server-side contact permission check**.  
**Not allowed:** Write arbitrary React/HTML/SQL, choose arbitrary backend tools, change amount/paid fields, execute actions, claim a source status, infer missing payments or silently authorize updates.

The server validates Gemini structured output with a strict schema and an allowlist. Refuse unknown intent/field/operator/module; fall back to a deterministic preset (a clarification prompt is P1, A1). Never run text from a data source as instructions. Gemini calls time out after 8 seconds and fall back to a preset (A8).

**Model naming is not configuration:** The original pitch mentions Gemini 3.8 Flash and Gemini 3.5 Flash-Lite as planned choices. Check actual supported model IDs, SDK compatibility, quota and response schema in the team's AI Studio project; do not hard-code slide claims or assert those models are provisioned. Gemini Live and multimodal payment-screenshot matching are explicitly **stretch**, not part of the verified core. The pitch's named `data-schema-normalizer`, `safe-writeback-guard` and `compliant-followup-drafter` are **planned custom skills/guardrail workflows**, not evidence that those skills were installed with the third-party Superpowers package.

## 5. Git and teamwork

- **Atherva:** Frontend, design, UX copy, guided workflow, demonstration narrative.
- **Smith:** Typed domain, rule engine, data adapters, API and audited action path.
- Both approve shared contracts, risky data writes and final demo claims.
- Work in feature branches (`feat/nirvaah-interface`, `feat/nirvaah-backend` or renamed agreed branches), not directly on `main`.
- Avoid editing the same file concurrently; negotiate shared `web/src/types/` contract before parallel implementation.
- Inspect `git status` and changes before committing. Do not add `node_modules/`, `.next/`, `.env*`, credentials or large local caches.
- Never overwrite or discard the other person's work without explicit coordination; use small reviewed merges/PRs.
- At each milestone, record test evidence and update `MEMORY.md` and `TASKS.md`.

**Antigravity workflow:** Read the relevant docs and current source files first, propose a short bounded implementation, then implement, run tests and report exactly what was verified. Superpowers may assist with debugging, plans and testing. Do not let generic tool workflows erase the approved product scope or occupy the entire Buildathon with re-planning.

## 6. Tool-use rules

| Tool | Approved use | Avoid |
|---|---|---|
| Antigravity | Main coding assistant in the correct `Nirvaah` workspace. | Running tasks in old `Antigravity-Test`. |
| Superpowers | Testing, systematic debugging, bounded implementation/review. | Assuming the skill proves a feature works. |
| 21st.dev | Search/review suitable React UI code and themes. | Mixing many incompatible component styles or blind installs. |
| Product Requirement Craft | Review ambiguous requirements against the approved PRD. | Creating a second conflicting PRD source of truth. |
| 21st MCP | Optional component service if auth/benefit confirmed. | Legacy Magic install solely because a video mentions it. |
| Supabase MCP | Only if Supabase becomes an explicit architecture choice. | Connecting AI to unnecessary or real production data. |
| Claude Code | Optional backup agent, separately configured. | Concurrently rewriting files Antigravity owns. |
| Playwright | Core flow browser tests, if available. | Equating screenshots with working backend actions. |

Read third-party skill instructions before trusting them; they may run with broad agent privileges. Keep secrets out of prompts, repositories and screenshots.

**Manual WhatsApp safety:** Never add a send endpoint or automatic `wa.me` navigation. Require a user click. Build and encode the link from a **consented team-owned test number** if demonstrating contact. Do not pass phone numbers to Gemini unnecessarily; sanitize draft content and prevent logs from capturing phone data. **P0.5a ends at editable draft + manually opened link, with no contact attestation or source write**. The attested `contacted` path is P1 and, if implemented later, means operator-confirmed / delivery-unverified. Never fabricate permission.

## 7. Verification before calling a feature complete

Require **fresh** evidence for each applicable claim:

1. `npm run lint` or the project's configured lint equivalent passes.
2. `npm run build` passes.
3. Unit tests pass for the changed rules, including bad inputs.
4. For an API change, at least one valid and one failure request are exercised.
5. For UI changes, inspect keyboard navigation, narrow viewport, empty/loading/error states.
6. For source actions, inspect original source **before/after** and match audit receipt.
7. A functional second task produces a demonstrably different view composition.
8. Independent fixtures prove **₹2,000/48h** and **₹5,000/72h** yield correct recomputed results without code changes; each preset's field and clock stay fixed and visible, so the meaning never changes silently. Use a pinned fixture clock (A4).
9. If manual WhatsApp flow is implemented, test allowed, denied, unknown and revoked permissions; confirm a mere draft/link never triggers `contacted`.

Do not claim passing tests that were not run. Record actual results and known gaps. A demo-safe workaround must be clearly labelled.

## 8. Decision hierarchy for scope disputes

1. Data safety and honest functionality.
2. One end-to-end **advance triage → approved `reviewed` update** against a real synthetic source.
3. Evidence-backed **Triage Queue / Exposure Summary** adaptation and transparent review.
4. The deck's **consent-gated editable WhatsApp draft and manual `wa.me` handoff (P0.5a)**, only after the release gate passes. The attested `contacted` write is P1 (A10).
5. Usable, premium visual experience and demo resilience.
6. Mapping automation, CSV export, more integrations and other enhancements.

If a proposed new feature threatens the completion of priorities 1–3, defer it and be honest about what is planned. There is no acceptable "75%" implementation of a consequential write. **No fixed business-wide amount or delay may be inferred from the pitch example.** The operator must be able to inspect the resolved field and clock on the chips; selecting a different field or clock is P1 (A1).

## 9. Public endpoint rules (A8/A12/A13)

A Cloud Run service is **private by default** until public access is enabled. If a URL is made public, protect `/api/plan` with rate limits, request-body/prompt caps (e.g. 300 characters), an 8-second Gemini timeout/fallback and a billing alert. **Rate limiting alone never authorizes a Sheet write.** `/api/actions/preview` and `/api/actions/execute` must require an authenticated operator or server-validated protected demo session, with server-held, expiry-bound `actionId` and durable one-time action state (Firestore). **No auth or no durable store ⇒ public deployment is read-only.** A protected local-only write demo may use single-process memory with honest limitations; `max-instances=1` does not make Cloud Run memory persistent. Never expose secret values or customer data in client bundles or logs.

## 10. Scope freeze (A1, A6, A7, A10)

Do not build anything on the cut list in `TASKS.md` §9, or anything marked P1, until the release gate in `TASKS.md` §5 passes. The release gate is Q01, Q03, Q07, Q08, Q10, Q11, Q12, Q13, Q14, Q16, Q22 and Q23.
