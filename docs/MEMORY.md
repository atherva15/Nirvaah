# NIRVAAH — Project Memory and Decision Log

**Updated:** 20 November 2026 IST  
**Specification revision:** 1.4 — keeps Claude's v1.3 A1–A11 and adds A12–A16 to correct Cloud Run state, public write authorization, P0.5 boundaries, deployment timeboxing and dataset scope. **Documentation updated; product features still unverified.**
**Purpose:** Short, factual continuity record for Atherva, Smith and their coding agents. This is **not** the long product strategy or a replacement for Git history.

## 1. Product identity

- **Product:** Nirvaah.
- **Team:** Vistaar — Atherva Rajapurkar (product/experience) and **Smith Ritesh Patil** (backend/integration; called **Smit** in the team's earlier messages). Use the submitted deck spelling for public materials unless Smith requests otherwise; verify with the cofounder before final submission.
- **Event:** Startup Buildathon India 2026, Mumbai City Buildathon, 20–21 November 2026.
- **Initial stage:** Idea + founder application/pitch deck, now starting prototype implementation.
- **Thesis:** Adaptive, task-first operating workspace that presents verified business facts, supports guided or natural-language tasks and requires approval before consequential actions.
- **Brand principle:** Accessible to businesses with different starting points; sell progress, clarity and control, not a stigmatizing "cheap/small" identity.
- **First vertical:** The submitted deck's **daily 6 PM made-to-order merchant bottleneck**: **Triage Queue** for unconfirmed advances, **Exposure Summary**, source-backed reasons, and an approved metadata write to one Google Sheet.
- **Submitted-pitch contact loop:** Optional consent-gated editable WhatsApp reminder, **manual** `wa.me` handoff, separate operator attestation, then approved `contacted` status. Not a programmatic send or delivery confirmation; implement the draft and link only after the release gate passes; the attested `contacted` write is P1 (A10).
- **Future:** Paper/manual capture, multi-tool sources, voice/language localization, saved task playbooks, broader domains and subscriptions, all pending validation.

## 2. Current verified technical state

| Item | Confirmed state |
|---|---|
| GitHub | Private repo `https://github.com/atherva15/Nirvaah`; Smith accepted invitation. |
| Initial commit | `898ed6973f029a9465dd0c0438373f38cbe25cde` on `main`, reportedly pushed and matching on Smith's clone. |
| Atherva local repo | `C:\Development\Nirvaah` with Next.js app in `web/`. |
| Smith local repo | Reported matching short commit `898ed69`; do not assume Next dev server independently verified until checked. |
| Next.js | TypeScript, Tailwind, App Router scaffold; `localhost:3000` worked on Atherva's laptop. |
| Antigravity | Installed and verified on both laptops with JS health check. |
| Superpowers | Fifteen skills installed and Antigravity-verified on Atherva's laptop. |
| Gemini key | Created by Atherva; secret value must not enter Git or chat; integration unverified. |
| 21st.dev | Discussed as UI aid; no verified install recorded yet. |
| Google Sheets | Preferred source integration; live read/write **not yet verified**. |
| Nirvaah features | No production feature completion is verified by this document. |

## 3. Founding decisions already made

1. Nirvaah and the former CanvasDesk concept are a **single product**, with CanvasDesk's real Sheet-writeback idea forming the demo backbone.
2. Customers get both guided entry and power input; no prerequisite knowledge of prompt writing or spreadsheets.
3. Gemini interprets permitted task/view plans; deterministic rules own dates, currency, priorities and action eligibility.
4. Generated UI means choosing approved view components, never executing AI-generated React or arbitrary scripts.
5. Preview, explicit user approval, restricted write, source re-read and actual audit form the trust contract.
6. Start with one narrow synthetic merchant workflow; represent other industries, paper, OCR and multi-source future honestly.
7. Antigravity + Superpowers are dev tools. 21st.dev is an optional UI aid; Supabase MCP is not required for the planned Sheets/Google Cloud architecture.
8. There is one Git repository and one Next.js app under `web/`; do not create duplicate scaffolds.
9. Both founders use separate feature branches for code and coordinate shared models before merging.
10. The **actual 8-page submitted Vistaar pitch deck** is the source for first merchant flow, the two preset names, consent-gated manual contact and CSV proposal. The broader master blueprint supplies safe implementation detail; avoid silently removing promised steps or falsely claiming they are built.
11. **Confirmed by Atherva:** ₹2,000 and 48h in the pitch are **illustrative example parameters**, **not fixed or universal merchant rules**. Different users/businesses set different amounts and durations through natural-language requests or editable guided filters. Supported money fields (total vs outstanding) and clocks (order creation vs advance request) stay distinct; in P0 each preset fixes one field and one clock and shows them in its chips; the selector and clarification prompt are P1 (A1). Both preset views use the same parameterized deterministic engine.
12. Approved P0 action is `followup_status: pending → reviewed` and explicitly does **not** mean a customer was contacted. `pending/drafted → contacted` (P1, A10) is gated on a truthful **manual-send operator attestation**, secondary explicit approval and successful source re-read. Delivery is unverified.
13. Unknown/denied/missing `contact_permission` is fail-closed; no AI follow-up draft or WhatsApp link. A synthetic demo must not accidentally send messages to a real third party.
14. Named **Google Agent Skills** in the deck — `data-schema-normalizer`, `safe-writeback-guard`, `compliant-followup-drafter` — were **planned custom workflows**; do not mistake them for the installed Superpowers skill set or shipped app features.

**Consolidated amendments v1.4 (20 Nov; conflicts must be reconciled rather than overridden silently):**
- **A1:** P0 views are Triage Queue (order total > amount, advance unconfirmed, advance wait > duration) and Exposure Summary (outstanding > amount, order age > duration, summary cards + grouped by payment status). Each preset has one fixed field and clock shown in its chips; only the amount and duration chips are editable. Field/clock selectors and the clarification prompt are P1.
- **A2:** Gemini plans use rupees and `{ amount, unit }` durations; the server converts to paise and hours.
- **A3:** Previews are stored server-side, bound to authenticated actor/session and expiry; execute accepts only a strong random `actionId`. For public Cloud Run writes, state must persist in Firestore; `max-instances=1` is **not** durable.
- **A4:** Rule functions take `now`; `NIRVAAH_NOW` pins a labelled demo clock; Sheet dates are ISO-8601 text with offset; Q07 and Q08 use a fixture clock.
- **A5:** Sheets auth choice is service account; verify edit access **as soon as practical**. The former 12:00 Day 1 target is a timebox, **not evidence it was achieved**.
- **A6:** Cut for P0: Sources screen (badge and small Needs Review list stay), mapping UI, CSV export, timeline, tiles for unbuilt tasks, phone column.
- **A7:** Release gate: Q01, Q03, Q07, Q08, Q10, Q11, Q12, Q13, Q14, Q16, Q22, Q23.
- **A8:** Rate limits, input caps, an 8-second Gemini timeout and a billing alert on public endpoints.
- **A9:** Attempt hello-world Cloud Run deploy early, **timebox to 30 minutes**; do not sacrifice local verified functionality if blocked.
- **A10:** P0.5a (consent check + editable draft + `wa.me` link, no status write) only after the release gate passes. The attested `contacted` write is P1.
- **A11:** Use **Smith Ritesh Patil** in public materials to match the submitted deck; he has also been called **Smit** in earlier team instructions, so confirm his preference before final submission.
- **A12 (public write authorization):** Rate limiting and an unpredictable action ID do **not** authenticate users. Public `/api/actions/preview` and `/api/actions/execute` require a protected operator/session. Without that, deploy **read-only** and perform a labelled protected local write demo.
- **A13 (durability honesty):** Cloud Run instances are stateless. Firestore is required for restart-resistant public action state; claim actions once in a Firestore transaction, never write Sheets inside a retried transaction. A crash between claim and verification can mean **unknown outcome**—reconcile with the actual Sheet, never auto-retry. In-memory `max-instances=1` is local-only/ephemeral, not a durable substitute.
- **A14 (P0.5 boundary):** Consent-gated editable WhatsApp draft + manually opened link only in P0.5a. **No `I sent this manually` CTA, no `contacted` status write, and no contact receipt in P0.5a**; those are P1.
- **A15 (deployment timebox):** 30-minute hello-world Cloud Run attempt, then focus on the source → rules → adaptive views → protected approval → verified update loop.
- **A16 (minimal source):** P0 uses **exactly nine Sheet columns**: `order_id`, `customer_name`, `created_at`, `total_amount_inr`, `paid_amount_inr`, `payment_status`, `advance_status`, `advance_requested_at`, `followup_status`. Defer `due_at`, `assigned_to`, `contact_permission`, phone and mapping/export UI until actually needed.

## 4. Outstanding decisions / blockers

- [ ] Confirm actual 21 Nov submission time and upload requirements onsite (team reported 09:00 IST).
- [~] Six Markdown specifications reconciled to **v1.4 (A1–A16)**; founders still need to approve and commit to the repository.
- [x] Atherva confirmed the specific amount/delay in the submitted deck were **examples only**, and must vary by user. This resolves the global-threshold question (not the ambiguity of an individual user's money field or time clock).
- [ ] Approve the amount and duration validation bounds and each preset's fixed field and clock (A1). Selectors and the clarification prompt are P1.
- [ ] Confirm the **nine-column P0** order schema, `advance_status`, `followup_status: pending → reviewed` transition and approved amount/duration ranges; `contact_permission` belongs to P0.5a only.
- [ ] Prepare one dedicated Google Sheet containing synthetic merchant records.
- [ ] Check a **consented team-owned test phone** is available, or keep WhatsApp as an unsent draft-only demonstration (never claim `contacted`).
- [ ] Sheets auth is decided **in design**: service account (A5). **No verified read/write yet**; test immediately on the synthetic Sheet.
- [ ] Confirm Gemini SDK/model access, allowed quota and structured-output behavior from a server route.
- [ ] Timebox a Cloud Run hello-world attempt to 30 minutes (A9/A15); verify **G1/G2** before making any public write route available, otherwise use read-only public + protected local presenter demo.
- [ ] Obtain usability feedback and actual passing tests; do not infer these from a completed installation.
- [ ] Decide whether there is enough verified time for the P0.5a **WhatsApp draft and link** (the `contacted` write is P1). If not, disclose as planned; don't block the functioning Sheet-writeback loop.

## 5. What changed because of the two reference videos

**Video 1:** Reinforced the principle of a requirements-first workflow, small verified coding increments and tool specialization: Product Requirement Craft (requirements review), Superpowers (development/test discipline), 21st.dev (UI inspiration), optional Supabase MCP only if Supabase is selected. No new mandatory production dependencies were introduced.

**Video 2:** Proposed six readable files **before vibe coding**: `PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`. This documentation set adapts exactly those six file roles to Nirvaah and its existing `web/` structure. It does not copy the video's sample StudentHub application.

## 6. Starting a new coding-agent session

Use a new Antigravity conversation in **`C:\Development\Nirvaah`**, not the old `Antigravity-Test` workspace.

Suggested first message:

> Read `docs/MEMORY.md`, `docs/product/PRD.md`, `docs/architecture/ARCHITECTURE.md`, `docs/RULES.md`, `docs/design/DESIGN.md` and `docs/TASKS.md`; inspect the actual repository. **Founder clarification:** ₹2,000/48h is an example, not a global rule; P0 changes amount/duration while each preset fixes and labels its money field/clock. Build exactly two distinct views (**Triage Queue**, **Exposure Summary**) and a verified `pending → reviewed` **protected** Sheet update with server-held `actionId`. If Firestore and operator authentication are not ready, the **public app stays read-only**; never pretend `max-instances=1` gives durable state. Use an explicit fixture `now` and honest `NIRVAAH_NOW` badge. Run the release gate in `docs/TASKS.md` §5 before P0.5; P0.5a is **unsent WhatsApp draft/link only**, and `contacted` belongs to P1. Do not build any cut/P1 feature. No unapproved pushes or secrets in code. The six docs are a proposed specification awaiting founder commit; report real tests/blocks, not claims. Ensure Antigravity actually loads these docs, and ask only for a missing decision that blocks the next bounded ticket.

An agent must not claim it read these files until they're actually present in its local workspace. PDF strategy material provides background; the six Markdown documents are the implementation-ready brief once the founders approve and commit them.

## 7. Updating memory after a verified milestone

Append one short factual entry:

```text
YYYY-MM-DD HH:MM IST | Owner | Commit/branch | Change | Evidence | Remaining issue
```

Example format only (not a real completed change):

```text
2026-11-20 18:00 IST | Smith | feat/sheet-read / <hash> | Added synthetic Sheet read | Q01 passed on 20 rows | Write permission not yet tested
```

Keep this file short, factual and updated after verified results. Keep the detailed scope and test checklist in `TASKS.md`.

## 8. Source lineage

Prepared from the **actual eight-page *NIRVAAH (TEAM VISTAAR)* submitted pitch deck**, the Nirvaah + CanvasDesk Unified Master Blueprint v2 dated 20 Nov 2026, the original submitted startup idea, CanvasDesk review and the founders' two shared reference videos. The submitted deck's four stages (**connect/clean, slice/reshape, consent-gated draft, approve/write-back**) are preserved as intended functionality, with explicit readiness gates. The slide's **14-day free assisted pilot, Solo ₹799/month and Team ₹1,999/month** are **unvalidated pricing/market hypotheses**, not working billing features. Proposed **Gemini model names must be checked** against actual AI Studio availability, not assumed. Any feature listed as proposed is not proof it is built.

## 9. Documentation-only revision history

`2026-11-20 | Specification v1.1 | Compared submitted deck to v1.0 six-file docs; restored exact two preset names, consent-gated manual WhatsApp flow, advance/payment semantics distinction, Needs Review, CSV export proposal and custom Google Agent Skills. No product code, Git commit or deployment was modified.`

`2026-11-20 | Founder clarification / Specification v1.2 | Atherva confirmed ₹2,000 and 48h are illustrative, not fixed; revised PRD, architecture, rules, design, tasks and this memory to require user-defined amount/duration, explicit money-field/clock interpretation, editable chips and multiple threshold tests. No product code, Git commit or deployment was modified.`

`2026-11-20 | Specification v1.3 | Restored Amendments A1–A11 (lost in the v1.2 rewrite) and trimmed P0 to two fixed-interpretation presets with editable amount/duration chips; moved the attested `contacted` write, CSV export, mapping and selectors to P1; corrected the teammate's name to Smith. No product code, Git commit or deployment was modified.`

`2026-11-20 | Specification v1.4 | Reconciled Claude-provided v1.3 with cloud security/runtime constraints. Added A12–A16 for public operator authorization, real Firestore durability (no max-instances shortcut), explicit uncertain external-write state, clean P0.5 draft-only UX, 30-minute deployment timebox and nine-column P0 Sheet. Public identity uses Smith Ritesh Patil pending his confirmation; colloquial Smit acknowledged. No product code, Git commit or deployment was modified.`
