# NIRVAAH — Product Requirements Document

**Version:** 1.4 — Build-ready thin slice; consolidates A1–A11 with security and scope corrections A12–A16 in `MEMORY.md` §3  
**Date:** 20 November 2026 (IST)  
**Team:** Vistaar — Atherva Rajapurkar and Smith Ritesh Patil (known as Smit in team conversation; verify preferred public spelling before final submission)  
**Stage:** Ideation entering prototype implementation  
**Status:** Proposed requirements; not a claim of implemented functionality
**Evidence baseline:** Team Vistaar's submitted eight-page *NIRVAAH (TEAM VISTAAR)* pitch deck, reconciled with the broader Nirvaah + CanvasDesk blueprint. This document supersedes the v1.0 build specification; the submitted deck is not evidence that a feature is implemented.

> **Product promise:** Your business. A clearer way forward.  
> **Product category:** Adaptive business operations workspace.

## 1. What Nirvaah is

Nirvaah turns business information into the task-specific workspace a person needs, highlights verifiable priorities and proposes controlled next steps. Users can start with guided choices or plain-language requests; critical business calculations run in deterministic application code. Consequential changes require review, explicit approval and a traceable result.

The product is not another fixed dashboard, a generic chatbot, an autonomous operator that acts without consent, or a replacement for existing records and applications.

**Positioning:** Speak to businesses ready to operate and grow with greater clarity. Avoid framing customers as technologically incapable or defining the whole brand as software for "small" or "cheap" businesses. Our first test segment is deliberately narrow; the brand need not be.

## 2. Problem and initial customer

Business information is scattered across bills, notebooks, spreadsheets, messages and applications. A business owner must repeatedly reconstruct basic answers: which orders need attention, what money remains to collect, which deadline is at risk and what action should follow. Existing tools often have rigid views or stop at advice without reviewable follow-through.

**Initial validation customer:** An Indian made-to-order apparel/gifting merchant with roughly 1–5 staff, managing advances, orders and customer replies across Instagram/WhatsApp and a spreadsheet. The **daily 6 PM bottleneck** is finding exceptions and deciding which follow-up to make before closing. This segment and its pain intensity remain hypotheses pending interviews, not proven traction.

**Future customer paths:** Paper-first shops, spreadsheet-first sellers and multi-tool operations teams. First-time users get visible task presets; experienced users get natural language, filters, grouping and saved views. Paper capture, Hindi/Hinglish voice and multi-source connections are future work unless explicitly completed and tested.

## 3. First measurable job — a configurable example, not a fixed product rule

**Illustrative request from the submitted pitch (preserve it as a test case):**

> "Show custom orders above ₹2,000 with unconfirmed advance over 48h, oldest first."

**Atherva's confirmed product intent (20 Nov 2026):** **₹2,000 and 48 hours are example inputs, not universal thresholds.** Every business or operator may need different amounts, time windows, payment states and sorting. Nirvaah must read those parameters from the user's request or from editable guided controls; application logic must **not hard-code 2000/48** as merchant policy.

For the worked example, one *possible explicit interpretation* is `order total > ₹2,000` + `advance_status = unconfirmed` + `time since advance_requested_at > 48h`, sorted by oldest advance request. But **“orders above ₹2,000” could refer to total order value or outstanding amount**, and **“over 48h” could refer to order age, advance-request age or due-date delay**. The interface shows exactly which fields/clock it understood. In P0 each preset fixes one money field and one clock and shows the interpretation in its chips (e.g. "Interpreted as: order total"); a field/clock selector and a clarification question are P1 (A1). Never silently substitute a missing timestamp; put unclear records in **Needs Review**.

**Test another request:** "Show orders with more than ₹5,000 outstanding that were created over 72 hours ago, newest first." The app must apply **₹5,000 / 72h / descending order-created sort** without a code change. An operator can also edit amount and age chips directly, without typing a new prompt. The filter engine and same UI components must serve both examples.

**Separate supported question (from our expanded blueprint):**

> "Show orders with more than ₹2,000 outstanding that were created over 48 hours ago, oldest first."

When the user **explicitly** says `outstanding` and `created over 48 hours ago`, that uses `outstandingPaise > 200000`, `now - createdAt > 48h`, sorted by `createdAt ASC`. The example parameters are changeable. Do not conflate total order value, outstanding balance, advance request age and order age. Render chosen meanings as **editable** filter chips, show counts and request clarification when necessary. An **unconfirmed advance** does not prove the full order amount is outstanding.

The first-time operator can select **Triage Queue** without knowing prompts; a second preset, **Exposure Summary**, provides a distinctly different composition. Both presets must use the same verified source facts.

### Required verified vertical slice (P0 — finish before embellishment)

1. Launch a clearly labelled synthetic merchant workspace.
2. Load valid orders from one sample Google Sheet. If authentication blocks the event demo, use a clearly labelled CSV/local fallback.
3. Select **Triage Queue** or enter a custom follow-up request. The initial example may use ₹2,000 and 48 hours, but the user can change both. Offer **Exposure Summary** as the second zero-prompt preset.
4. Gemini returns a **restricted task-and-view plan**, not executable code. Validate the plan on the server; a deterministic preset works if Gemini is unavailable or exceeds an 8-second timeout. Plans use rupees and durations with explicit units; server code converts units (A2, A8).
5. Recompose the view using registered UI components. The result must actually change arrangement or modules for two supported views: Triage Queue and Exposure Summary (A1).
6. Calculate selected amounts, selected time intervals and eligibility using **one deterministic parameterized rule engine** rather than model statements; quarantine bad records in **Needs Review**.
7. Let the user inspect **why** an order appears: exact source fields, calculated values and rule identifiers.
8. Propose updating **one allowlisted metadata field** such as `followup_status: pending → reviewed`, clearly a **reviewed item, not a sent message**.
9. Show exact before/after values and wait for explicit approval. Cancel produces **no write**.
10. On approval, re-check the original row by stable `order_id`, validate the current old value, write the permitted field, re-read the Sheet, and show an accurate action receipt plus audit entry. The server executes only a **server-stored `actionId` bound to the authenticated operator/session**; the browser never supplies old or new values. **No anonymous public writeback.** (A3, A12, A13).

**P0 integrity rule:** No payment or customer message is sent by Nirvaah. An item marked `reviewed` is not proof a customer was contacted.

### Submitted-pitch follow-up loop (P0.5a draft and link after the release gate passes; the attested `contacted` write is P1, A10)

1. For a **specific order**, the server confirms `contact_permission = allowed` and a usable, user-authorized test contact; missing/unknown/denied permission means **no draft or WhatsApp action**.
2. Gemini may propose a restrained English/Hinglish reminder using only allowed order fields. The merchant **reads and edits** the draft; neither the model nor Nirvaah sends it.
3. A user gesture may open a properly encoded **`wa.me` prefilled chat link**. This is a handoff, **not evidence that a message was sent**. Avoid real customers and accidental sending in the synthetic demonstration; use a consented team test number only if a live send is actually required.
4. **(P1, A10)** The user separately attests **“I sent this manually”**. Only then can the app propose `followup_status: pending → contacted`; review shows before/after and exact source. The log records **operator-confirmed contact, delivery unverified**. If they did not send, leave the record `pending` or optionally `drafted`, not `contacted`.
5. **P1 only:** Preview, approval, source re-check, single-field `contacted` write, re-read and audit follow the P0 action boundary. The P0.5a extension does **not** implement this attestation or update. No WhatsApp Business API, bulk send, auto-send or delivery claim.

This loop appears in the submitted deck. If time prevents it from passing security and end-to-end tests, demo the honest P0 `reviewed` path and disclose that manual WhatsApp handoff is planned, not working.

## 4. Requirements and acceptance criteria

| ID | Priority | Requirement | Observable acceptance |
|---|---|---|---|
| P-01 | P0 | Guided start | A new user opens **Triage Queue** or **Exposure Summary** without entering a prompt. |
| P-02 | P0 | Source honesty | Screen labels distinguish live Sheet, imported CSV and synthetic local data. |
| P-03 | P0 | Order integrity | Duplicate IDs, impossible amounts and malformed dates are flagged and excluded from confident calculations. |
| P-03a | P0 | Known schema import | The canonical sample Google Sheet (fixed, verified headers) is read with visible issue counts; unsupported/missing columns never silently become valid data. A local CSV is a labelled fallback only (A6). |
| P-04 | P0 | Task interpretation | Only approved intents, filters, columns, sort fields and modules are accepted. |
| P-05 | P0 | Genuine UI adaptation | **Triage Queue** and **Exposure Summary** produce visibly distinct task layouts/modules. |
| P-06 | P0 | User-configurable verified filters | User-supplied amount and duration (with each preset's fixed field and clock, comparator and sort) are validated and executed deterministically; e.g. ₹2,000/48h and ₹5,000/72h give correct, different outputs without code edits, checked against a fixture clock (A1, A4). |
| P-06a | P0 | Editable filter chips | The operator can inspect and adjust the amount and duration chips; each preset's field and clock are shown on its chips. A field/clock selector and a clarification prompt are P1 (A1). |
| P-07 | P0 | Evidence Lens | Every flagged item exposes source ID, fields, rule and reason. |
| P-08 | P0 | Review before mutation | Cancel and close never write; approving displays the exact target and value. |
| P-09 | P0 | Constrained source update | Only the approved field of the matching stable ID can change. |
| P-10 | P0 | Verified receipt | Success is displayed only after source re-read confirms the update. |
| P-11 | P0 | Graceful failure | Auth, AI, network, invalid data and stale-state errors remain understandable and do not create false success. |
| P-12 | P0 | Accessible responsive UI | One novice can finish the preset flow; keyboard and small-screen basics function. |
| P-12f | P0 | Endpoint protection | Rate limits, input caps and an 8-second Gemini timeout protect the public deployment (A8). |
| P-12h | P0 deploy gate | Actual write authorization | The publicly deployed app cannot preview or execute a Sheet change anonymously. If protected operator/session auth or durable action state is not ready, the public deployment remains **read-only**; writeback can be shown only in a labelled protected local demo (A12/A13). |
| P-12a | P0.5a | Consent-gated draft | No draft/link if contact permission is denied, missing or unknown; authorized draft is editable. |
| P-12b | P0.5a | Manual WhatsApp handoff | A user gesture opens a prefilled link; opening it never marks an order contacted. |
| P-12c | P1 | Operator-confirmed contact (A10) | Only explicit truthful attestation plus approved write can record `contacted`; the app does not claim delivery verification. |
| P-12d | P1 | CSV approved-change export (A6) | CSV mode exports a user-approved updated file; it never claims to edit the original uploaded file. |
| P-12e | P1 | Assisted column mapping | Gemini suggests headers; merchant confirms mapping before normalization; unknown/ambiguous rows enter Needs Review. |
| P-12g | P1 | Field/clock selector and clarification prompt (A1) | The operator can choose the money field and clock; ambiguous wording triggers a clarification before filtering. |
| P-13 | P1 | Save task view | A saved view reruns on **fresh** records rather than caching stale results. |
| P-14 | P1 | Manual quick-add | A user can enter basic records through a guided form. |
| P-15 | P2+ | Paper/bill recognition | User reviews uncertain extracted values before they enter trusted records. |
| P-16 | P2+ | More integrations | Source-specific permissions, provenance and tenant separation are proven. |

### Non-functional requirements

- **Trust:** No unsupported claim that external messages were sent, payments occurred or sources were connected.
- **Performance:** Show loading, failure, timeout and retry states; benchmark response time only after actual measurements.
- **Accessibility:** Semantic inputs and tables, visible focus, sufficient contrast, legible amounts and clear copy.
- **Safety:** No browser-exposed secrets; no model-directed writes; server-side input validation and allowlisted mutations. Public reads/plans need quota and abuse protection; **public write endpoints additionally need authenticated operator/session and durable single-use action state**. Rate limiting is not authorization. If absent, share a read-only public build and use protected local-only writeback (A12/A13).
- **Traceability:** Store actor, action ID, source, expected old value, actual result and timestamp for every attempt.
- **Resilience:** The demo can run against a labelled local fixture if event Wi-Fi or credentials fail.

## 5. Main screens

1. **Entry:** Explore sample business, import/connect permitted data; unbuilt routes visibly labelled future or hidden.
2. **Today:** The two preset tiles (Triage Queue and Exposure Summary; tiles only for built tasks, A6), an optional "Ask Nirvaah" input and verified priority summaries.
3. **Task Workspace:** Dynamic registered cards, table or groups (timeline is P1) plus active filters and source freshness.
4. **Evidence Lens:** Order facts, source reference, explicit rule, calculated rationale and data-quality warnings.
5. **Follow-up Draft (P0.5a):** Consent state, editable draft and manual WhatsApp handoff; **no send attestation or `contacted` write until P1**.
6. **Action Review:** Before/after, precise scope, cancel/approve and success/failure receipt; operator attestation distinct from delivery verification.
7. **Source badge + Needs Review list (A6):** no separate Sources screen in P0; the persistent badge shows source mode, row count and refresh time, and a small list shows invalid or ambiguous rows.
8. **Activity:** Reviewed attempts and successful/failed actions; saved task view is P1 if time remains.
9. **Paper Review:** Future concept only; no demo claim of live OCR unless separately implemented and verified.

See `../design/DESIGN.md` for layouts, states and accessibility details.

## 6. The 90-second demonstration

| Elapsed | What the judge sees | Evidence |
|---|---|---|
| 0–12s | Synthetic merchant Google Sheet | Original source is visible. |
| 12–24s | Nirvaah **Triage Queue** preset | Works without prompt knowledge. |
| 24–45s | User request, changing task view | Gemini plan is validated; UI composition changes. |
| 45–60s | Evidence panel | Rule and source values justify one priority. |
| 60–75s | Exact `pending → reviewed` review then approval | P0: transparent review without pretending a message was sent. |
| 75–85s | Refresh original Sheet | Only the reviewed status cell changed. |
| 85–90s | Activity receipt | Result is traceable and truthful. |

**P0.5a extension, only if the release gate has passed:** show the consent badge, edit the AI-proposed unsent reminder and open `wa.me` manually. Stop there. The attested `pending → contacted` write, with its `operator-confirmed / delivery-unverified` receipt, is P1 (A10). Rehearse this as a separate extension; do not squeeze a fake send into 90 seconds.

**Second judge challenge:** Switch to **Exposure Summary**, grouped by **payment status**. The UI must visibly recompose from Triage Queue, not merely change an AI paragraph above an unchanged table. Assignee grouping is P1 and needs another source field.

## 7. Explicit exclusions for the Buildathon

No billing/subscriptions, production tenant management, **automated** WhatsApp/SMS sending, WhatsApp Business API, bulk customer messaging, automatic bank transactions, real customer records, OCR of handwritten bills, inventory forecasting, general-purpose workflow designer, unrestricted AI code generation, a separate Sources screen, CSV export, a field/clock selector, a Daily Priorities timeline or all-industry ERP (P1 or cut, A1 and A6). A manual `wa.me` handoff is possible P0.5a, **not** automated sending. The original deck's pricing and pilots are **unvalidated hypotheses**, not functional product features: 14-day assisted pilot, provisional Solo ₹799/month and Team ₹1,999/month, interviews with 10 sellers and a three-merchant pilot.

## 8. Success definition and unresolved decisions

**Success:** The entire source → validated adaptive view → explain → approve → write → re-read → audit loop runs uninterrupted preferably three times, with an honest fallback demonstration recorded. Assess by actual functional evidence, not screens alone.

**Decisions to confirm BEFORE implementation:** Select sample demo fixtures and approved amount/duration bounds; use the **nine-header P0 test Sheet** specified in architecture; verify the permitted `pending → reviewed` transition, event deadline/upload rules, and whether protected Cloud Run writeback plus Firestore are achievable. Sheets auth choice is service account, **not yet verified**. Attempt an early Cloud Run deploy but **stop after 30 minutes if blocked** and finish the local loop. The proposal to fix ₹2,000/48h as global thresholds is rejected. Record actual decisions in `../MEMORY.md` and corresponding tasks.

**Source:** Team Vistaar's actual submitted *NIRVAAH (TEAM VISTAAR)* pitch deck (8 pages), Nirvaah Unified Product Strategy and Buildathon Master Blueprint v2 (20 Nov 2026), original founder application and CanvasDesk founder review. The submitted deck fixes the first-workflow narrative; the unified blueprint supplies broader engineering and design discipline. This file does not prove implementation.
