# NIRVAAH — Experience and Design System

**Version:** 1.4 · 20 November 2026 · Thin-slice task-first UX; consistent with `MEMORY.md` amendments A1–A16

## 1. Design thesis

**"Your business. A clearer way forward."**

Nirvaah must feel capable, calm and premium, without implying that a beginner is inferior or that a growing team is too complex. It should work for an operator who presses a button and one who types a precise business query. The UI **adapts to the job**, but its identity, navigation, safety controls and data provenance remain predictable.

Reference tone: a considered operations cockpit, not a flashy AI toy, finance casino, spreadsheet clone or generic analytics SaaS. Prefer immediate clarity over dense dashboards; provide detail on demand.

## 2. Visual language — proposed tokens

These are starter tokens for visual exploration, not an approved brand lockup. Atherva should approve after testing one light and one dark variant.

| Token | Suggested value | Purpose |
|---|---|---|
| `--surface-0` | `#F7F8FA` | Warm light canvas; avoid pure-white glare everywhere. |
| `--surface-1` | `#FFFFFF` | Cards and foreground panels. |
| `--text-primary` | `#17212B` | Main dark ink. |
| `--text-secondary` | `#627080` | Explanatory metadata and helper copy. |
| `--brand` | `#256C64` | Calm, confident green-teal. |
| `--brand-deep` | `#174D47` | Emphasis, selected navigation. |
| `--accent` | `#D9A15F` | Sparse warm highlights, never payment-success semantics. |
| `--border` | `#E1E7E9` | Low-contrast separators. |
| `--success` | `#24764C` | Real verified success only. |
| `--warning` | `#9C621B` | Data gaps or action review. |
| `--danger` | `#AE3D43` | Errors, denied/rejected operations. |

Dark mode can use slate/charcoal foundations with the same calm accent; do not sacrifice contrast or status semantics. Prefer **Inter** or a high-quality system sans for UI; use consistent tabular numerals for amounts and dates. Restrict display heading styles to a few sizes; 4/8px spacing rhythm; 8–14px radii; subtle shadows; no gratuitous gradient/glow. Respect reduced motion.

## 3. Information hierarchy

**Persistent shell:** Nirvaah wordmark; business/workspace label; visible source badge (LIVE SHEET / IMPORTED CSV / LOCAL DEMO); last refresh time; a "Demo clock" badge with the pinned time whenever `NIRVAAH_NOW` is set (A4); navigation; compact account/help affordances.

**Task header:** Human-readable job title, **editable amount and duration chips** (the money field, clock, status and sort each preset uses are shown on its chips; selectors for them are P1, A1), records examined, date range and source scope. Clearly distinguish AI interpretation from verified calculated totals. Two named layout modes from the submission are **Triage Queue** and **Exposure Summary**. **No fixed ₹2,000/48h policy** is embedded in the interface.

**Task body:** P0 chooses registered summary cards, priority queue or **payment-status grouped queue**, evidence drawer and action proposal by intent. **No timeline** in P0. Keep no more than 2–3 strongest issues above the fold; reveal deeper metrics with expandable detail.

**Action boundary:** A consistent review screen or modal with target record, original and new metadata values, scope, consequence, cancel/approve. Distinct applying/succeeded/failed/stale states. P0's `reviewed` update is allowed only in a **protected operator session or labelled local-only mode**. Optional P0.5a WhatsApp draft/link is **unsent only**; `I sent this manually` and `contacted` updates are explicitly **P1**.

## 4. Screens and expected behavior

### Screen A — Entry / start

- Hero: "Know what matters. Make the next move with confidence."
- Primary button: **Explore a sample business** (works with synthetic records).
- Secondary: **Connect a Google Sheet** only if a real read flow works; otherwise use a truthful setup message.
- Future-path concepts (enter records, scan bills, connect tools) should be hidden or explicitly "Planned" and nonfunctional.
- One-line trust statement: "Review important changes before they happen."

### Screen B — Today

- Top: business, source mode, refresh time.
- Primary zero-prompt tiles: **Triage Queue** (advance follow-ups requiring attention) and **Exposure Summary** (amounts/outstanding by status). They open with clear **editable amount and delay controls**; sensible example values are placeholders, not business-wide defaults. No tile is shown for a task that is not built (A6).
- Natural-language input: "Ask Nirvaah what needs attention..." with a visible example.
- Initial summary: 2–3 validated issues with evidence links. Avoid invented revenue numbers.
- Guided mode and power-user mode expose the **same** facts. No separate, inconsistent datasets.

### Screen C — Adaptive task workspace

- The **Triage Queue** makes each actionable custom order prominent: selected age/clock, status, customer context, reason pills, and action affordance. For the submitted example, chips might read `Order value > ₹2,000`, `Advance unconfirmed`, `Waiting since advance request > 48h`, `Oldest first`. **Every chip is reviewable; amount and duration can be edited. The money field and clock are fixed per preset and shown on the chips (selectors are P1, A1).**
- **Exposure Summary** emphasizes verified total/outstanding values, groups and summary cards with drill-down. It should look structurally different, not just recolor the same table: summary cards plus a `grouped_queue` grouped by payment status (A1). A user can request `Outstanding > ₹5,000` and `Order age > 72h` and receive the verified result **using the same rule engine**.
- **P0 grouping:** payment-status groups with counts and expandable rows. Assignee grouping is **P1**, since `assigned_to` is not present in the nine-column P0 Sheet.
- Show filter chips and the statement "Showing N of M validated orders".
- When an amount or duration changes, show a brief recalculating state and refreshed count; use server-validated results. If an input is invalid, keep the last valid result visible with an **invalid filter** warning, not a fabricated list.
- (P1, A1) For ambiguous requests, an inline decision such as "Above ₹2,000: order total or unpaid balance?" and "Older than 48h: since order creation or since advance request?" lets the operator choose. In P0, show the interpretation the preset uses in its chips and never hide it.
- Support two distinct compositions through **registered components**, not model-generated React.
- Empty state: "No matching orders in this source" plus a clear reset control. Loading and failure are distinct.

### Screen D — Evidence Lens

- Opens by clicking **Why this order?** on a priority item.
- Display `orderId`, source name/row reference, created time, advance-request time (if present), advance confirmation, total, paid, outstanding, exact rule ID and explanation. A user must be able to see which clock and amount field drove the flag.
- Separate verified facts from any AI-authored suggested follow-up wording.
- If a field is missing or inconsistent, display a data-quality warning and prevent unsafe action.

### Screen E — Editable follow-up draft (P0.5a: draft and link only; no `contacted` action)

- Show a **permission gate first**: `Contact permitted`, `Permission denied`, or `Permission unknown`. Only **explicitly allowed** permission unlocks draft generation and the WhatsApp handoff. Missing/denied never gets a link.
- Show the proposed English/Hinglish reminder in an **editable** field with source context. Clearly label `AI-assisted draft — not sent` and avoid exposing the customer's phone number to Gemini.
- **Open WhatsApp** is user-triggered; the URL fills a chat but does **not** send. Do not mark the record contacted when the link opens or the tab returns.
- **Do not offer `I sent this manually` in P0.5a.** Show only `Open WhatsApp` and `Back / Keep editing`, with the status `Draft ready — not sent by Nirvaah`. Offer **Save draft** only if real persistence exists; otherwise the draft remains in the current UI session. Attestation and the separate `contacted` record-update modal are **future P1 screens**.
- A missing or revoked permission disables the link and prompts a recheck. Do not infer an external send or update the source when the WhatsApp tab opens.
- In a purely synthetic demo, use a consented team-owned test number for any actual manual message; otherwise label draft-only and do not pretend a message was sent.

### Screen F — Action review and receipt

- Explicit heading: "Review proposed change".
- P0 example: `Order ORD-104 · followup_status · pending → reviewed`.
- P1 example from the deck (A10): `Order ORD-104 · followup_status · pending → contacted`, **only after separate operator attestation**.
- Text for reviewed: `This marks a record reviewed. It does not send a message or collect money.` Text for contacted: `You confirmed sending a message manually. Nirvaah has not verified delivery.`
- Buttons: **Cancel** (no mutation) and **Approve update** (single target only).
- During application: disable duplicate submissions; display "Verifying source...".
- If a deployed demo is **read-only**, label `Writeback available in protected presenter demo` and **disable** action controls there; never show a fake clickable approve button.
- On success: show confirmed value, source, actor, timestamp and receipt ID; permit opening the original source when available.
- On stale/error: never show a success badge; explain why and offer review again.

### Screen G — Sources / data health / Needs Review (CUT for P0 except the source badge and a small Needs Review list, A6)

Not built as a screen for P0. The notes below are the P1 specification.

- Cards show `Live Google Sheet`, `Imported CSV`, or `Local sample` truthfully, with explicit mode.
- Display source name, row count, validation issues, read/write capability and refresh timestamp.
- Show `Needs Review` for invalid dates, duplicate IDs, inconsistent amounts and ambiguous advance timestamps. Do not quietly count these as eligible.
- If assisted header mapping is implemented, use a **proposed mapping → merchant confirms → import result** step. Do not claim automatic clean import for unknown schemas until tested.
- For CSV mode, make **Export approved changes** a download and explain that the source CSV uploaded earlier was not modified in-place.
- Connection failure describes remediation and leaves earlier data explicitly marked stale.
- Avoid claiming OAuth, permissions or cross-platform sync unless implemented.

### Screen H — Activity / saved work

- Activity lists actual action attempts with succeeded, failed or cancelled states, record IDs and timestamps.
- Distinguish `draft prepared`, `link opened` (if client actually observed), `operator attested sent`, `source update verified`; **never label a WhatsApp message delivered** without provider evidence, which the planned prototype does not have.
- **Saved workspaces** are P1: if shipped, reopening reruns current source data; do not show a fake saved-view backend.

### Screen I — Paper record review (future)

- A conceptual bill screen highlights extracted fields and requires human correction/confirmation before saving.
- **Not a Buildathon P0 route**; show only as labelled future vision in a slide if unimplemented.

## 5. Main workflows

### First-time guided operator

Explore sample → Today → **Triage Queue** → Verified queue → Why flagged? → Review `pending → reviewed` → Approve or cancel → Actual source-backed receipt.

### Experienced operator

Ask specific task → Validate or edit interpreted chips → Triage Queue / Exposure Summary → Adjust amount or duration → Recomputed source-backed results → Inspect evidence → Review permitted change → Verified source result.

### Manual contact extension (P0.5a draft and link only, if implemented and tested)

Select eligible order → Consent check → Edit unsent draft → **Open WhatsApp manually** → Return to an **unsent/unverified** state. **Stop here in P0.5a**. The manual-send attestation, preview `pending → contacted`, approved write and receipt belong to the separately scheduled **P1** workflow and must not appear as working in P0.5a.

### Error recovery

Connected source unavailable → Truthful source-error state → Offer safe local demo without changing its label. Gemini invalid/timeout → Validated preset and "AI unavailable" explanation. Stale record → Re-preview, never silently overwrite.

## 6. Component inventory

| ID | Component | Reuse rule |
|---|---|---|
| `workspace_shell` | Persistent navigation and source badge | Static across supported tasks. |
| `task_input` | Prompt + guided preset chips | Must support keyboard submit. |
| `filter_editor` | Amount and duration chips (each preset's field and clock shown; selectors are P1) | Server validates changes; no ₹2,000/48h hardcoding. |
| `summary_cards` | Verified amount/count/age indicators | Values only from rule engine. |
| `orders_table` | Readable typed and sorted order queue | Correct currency/date formatting. |
| `grouped_queue` | Assignee/status grouping | A real structural difference from table view. |
| `priority_timeline` | Time/due-focused triage | P1, not built for P0 (A1). Only with valid timestamps. |
| `evidence_drawer` | Provenance, rules, concerns | Always tied to a stable record ID. |
| `action_panel` | Review/approve/cancel | No direct write outside approved server route. |
| `activity_receipt` | Confirmed result | Real action outcome, not animation only. |
| `source_health` | Connection and data readiness | Cut for P0 (A6); the source badge in `workspace_shell` covers it. |
| `consent_badge` | Allowed/denied/unknown messaging permission | Unknown defaults to **no draft/no link**. |
| `followup_draft` | Editable AI-suggested message | Never send automatically; draft-only label. |
| `manual_send_attestation` | Explicit operator confirmation | P1 (A10). Not a delivery receipt; never infer from link opening. |
| `needs_review` | Small list of invalid/ambiguous source rows | P0 minimal list (A6). Exclude from the confident queue until resolved. |
| `csv_export` | Download approved updated file | P1 (A6). Never claim the source CSV changed in place. |

**21st.dev usage:** Search for tables, drawers, dialogs and form patterns only after the design tokens and contract are agreed. Adapt components to Nirvaah; check accessibility, package dependencies and licensing before copying. Do not let an attractive template dictate information architecture.

## 7. Responsive and accessibility contract

- Desktop: navigation rail + main task workspace + contextual evidence as side panel when space permits.
- Tablet: compact navigation, main table horizontally scrolls intentionally, evidence as sheet/drawer.
- Mobile: stack cards, list-style order rows instead of unreadable full table, full-screen review panel.
- Tab order is logical; focus remains visible; modals trap focus and return it upon close.
- Status never conveyed by color alone; use explicit text/icons; contrast should meet WCAG AA for key text.
- Real content must be comprehensible in simple English before Hindi/Hinglish support is implemented.

## 8. Design acceptance and anti-patterns

**Pass:** A first-time user can access a meaningful task via one of the **two named presets**, edit amount and delay, and see correctly recomputed results; views differ structurally; important states and provenance are discoverable; cancel does not mutate; narrow/wide browser checks pass. If WhatsApp ships, denied/unknown consent never offers a draft/link and link opening alone never marks `contacted`.

**Reject:** Fake live status, fabricated money values, treating an unconfirmed advance as proven outstanding debt, marking `contacted` on mere link opening, claiming WhatsApp delivery, invisible approvals, AI-looking text as proof of work, six navigation tabs with empty pages presented as functioning, unnecessarily loud animation, dense charts that obscure priority, or premium styling that reduces readability.

Final visual choices require a screenshot review and approval by Atherva; treat these tokens as starter recommendations, not irrevocable founder decisions.
