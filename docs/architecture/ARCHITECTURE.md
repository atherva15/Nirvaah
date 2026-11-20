# NIRVAAH — System Architecture and Data Contracts

**Version:** 1.4 · 20 November 2026 · Thin-slice implementation contract; reconciles mentor A1–A11 plus safety corrections A12–A16 in `MEMORY.md` §3. Not implemented status.

## 1. Architecture at a glance

```text
Browser / Next.js React UI
    | guided task or plain-language request
    v
Next.js server route: task planner
    | Gemini produces restricted JSON -> schema/allowlist validation
    v
Deterministic rules + data adapters
    | source read, normalize, calculate, filter, sort and explain
    v
Registered UI components (cards/table/groups/evidence)
    | optionally: contact-permission gate -> Gemini editable draft -> user opens wa.me
    | user attests manual send OR chooses reviewed-only path
    | user previews an allowed status update
    v
Server action boundary -> re-check -> permitted write -> re-read -> receipt
    |                                    |
    +-- audit record                       +-- Google Sheet / labelled CSV/local fallback
```

**Golden boundary:** Gemini interprets requests and chooses *among* permitted view structures. Only trusted application code interprets source values, computes money/date facts, controls permissions or changes business records.

## 2. Existing repository (do not create a second app)

```text
C:\Development\Nirvaah\
  .git/                    # Single repository, GitHub atherva15/Nirvaah
  docs/                    # These cross-team requirements
    product/PRD.md
    architecture/ARCHITECTURE.md
    design/DESIGN.md
    RULES.md
    TASKS.md
    MEMORY.md
  web/                     # Existing Next.js TypeScript application
    src/app/               # Routing / server endpoints
    src/components/        # Shared presentation primitives
    src/features/          # Task-specific UI and hooks
    src/lib/               # Models, rules, adapters, Gemini server logic
    src/types/             # Shared domain and view contracts
    tests/                 # Unit/integration tests (when added)
    public/
    package.json
```

`web/` already exists and runs on localhost:3000. Do **not** build another Next.js app at the repository root. Use npm and the committed `web/package-lock.json` (`npm ci` on Smith's machine).

## 3. Working stack

| Layer | Choice | Why / guardrail |
|---|---|---|
| Editor/agent | Google Antigravity | Development tool, **not** an app dependency. |
| UI | Next.js App Router, React, TypeScript, Tailwind CSS | Existing scaffold, reusable controlled modules. |
| AI | Server-side Gemini API, structured response | Interpretation and view planning only. |
| Source P0 | Synthetic Google Sheet via Sheets API, **service-account auth** (A5) | A protected presenter can demonstrate a real source update. Share the Sheet to the service-account email; test read/write as soon as possible; not yet verified. |
| Fallback | Validated local/CSV dataset, labelled "Demo data" | Safe operation without Wi-Fi/credentials. |
| State | **Firestore for publicly deployed writes**, keyed by random `actionId`; in-memory previews only for **labelled single-process local-only mode** | **Max-instances=1 does not preserve memory across Cloud Run restarts.** If durable storage is unavailable, disable public write endpoints. |
| Hosting | Timebox early hello-world deploy of `web/` to Cloud Run to **30 minutes**; if blocked, return to local working loop | Public hosting is optional if it risks finishing the functional build. Env vars and secrets differ from `.env.local`. |
| Testing | Pure TS rule tests, API checks, browser happy path | Evidence for claims. |
| Optional dev utilities | Superpowers, 21st.dev, Playwright | Evaluate and review generated code, no implicit extra runtime service. |
| Pitch-mentioned agent skills | `data-schema-normalizer`, `safe-writeback-guard`, `compliant-followup-drafter` | **Planned custom development workflows**, not installed production modules. Their checks must exist in normal tested server code regardless. |

**Rejected P0 complexity:** Supabase solely to connect its MCP, Docker, multiple databases, autonomous agent frameworks, production OAuth multi-tenancy, A2UI protocol without a tested renderer. A typed local component registry is sufficient to demonstrate adaptive UI.

## 4. Canonical order contract

Use one validated canonical type regardless of whether raw rows came from Sheets or CSV.

```ts
type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'unknown';
type AdvanceStatus = 'unconfirmed' | 'confirmed' | 'not_required' | 'unknown';
type ContactPermission = 'allowed' | 'denied' | 'unknown';
type FollowupStatus = 'pending' | 'drafted' | 'reviewed' | 'contacted';

interface Order {
  orderId: string;                 // stable, unique, never a sheet row number
  customerName: string;
  createdAt: string;               // ISO-8601 instant with timezone/UTC
  dueAt?: string | null;           // P1; not required by P0 Sheet or P0 rule engine
  totalAmountPaise: number;        // safe nonnegative integer
  paidAmountPaise: number;         // safe integer, 0..total
  paymentStatus: PaymentStatus;
  advanceStatus: AdvanceStatus;    // confirmation state, distinct from payment amount
  advanceRequestedAt: string | null; // required for exact advance-age filter
  followupStatus: FollowupStatus;
  contactPermission?: ContactPermission; // P0.5a; defaults unknown, never inferred
  contactPhoneE164?: string | null; // P0.5a only; never transmit to Gemini
  assignedTo?: string | null;      // P1: no assignee grouping in P0
  sourceId: string;
  sourceRef: string;               // e.g. spreadsheet ID + sheet + matched row
  sourceFingerprint?: string;      // checked source fields / version if available
}
```

**Derived values:** `outstandingPaise = totalAmountPaise - paidAmountPaise` (never ask Gemini to compute it). `orderAgeHours = (nowUtc - createdAt)/3600000`; `advanceWaitHours = (nowUtc - advanceRequestedAt)/3600000` when known. For any **user-supplied duration** `thresholdHours`, "older than" means `elapsedHours > thresholdHours` (so 48h means `>48.0` in **that query**, not a global limit). The active query chooses which timestamp determines **oldest/newest first**; tie-break by stable `orderId`. `overdue` means `dueAt < now` when `dueAt` exists, and is distinct from order age and advance wait.

**Clock (A4):** every rule function takes `now` as an explicit parameter. The env var `NIRVAAH_NOW` may pin a demo clock so fixtures and checks (Q07, Q08) stay reproducible; the UI shows a visible "Demo clock" badge whenever it is set.

**Critical founder clarification:** The pitch's `₹2,000 / 48h` is an **example parameter pair**, not a rule baked into Nirvaah. Implement a **parameterized** filter expression over allowlisted source fields and user-provided typed values. For example, if the user explicitly chooses **order value** + **time since advance request**, the first example compiles to `totalAmountPaise > 200000 && advanceStatus === 'unconfirmed' && advanceWaitHours > 48`, sorted `advanceRequestedAt ASC`. Another user can choose **outstanding** + **order age** + `₹5,000 / 72h` and get `outstandingPaise > 500000 && orderAgeHours > 72`, sorted by their selected field. These share the **same rule engine**, not separate hard-coded feature branches. **P0 scope (A1):** each preset uses one fixed money field and one fixed clock, stated on its chips; the operator edits only the amount and duration. A field/clock selector and the clarification prompt are P1. Until then the UI shows the interpretation (e.g. "Interpreted as: order total") and never guesses silently. Missing selected date → **Needs Review**, never invent a clock.

**Limits:** Amounts must be finite, valid nonnegative integer paise after parsing; bounded to a defensible configured maximum. Durations must be valid positive hours within an approved limit. Only allowlisted comparisons (`gt`, `gte`, `lt`, `lte`, `eq`), sort fields/directions and enum values may execute. Never generate code, SQL or dynamic field access from arbitrary model text. Show the actual amount/age/status chips and number of matched rows as a preview before any action.

Never use binary floating point for money comparisons. Parse currency into integer paise and format only when displaying. Duplicate IDs, invalid dates and inconsistent balances become explicit validation issues, not silently accepted orders.

**Exactly nine P0 Sheet headers (A16):** `order_id`, `customer_name`, `created_at`, `total_amount_inr`, `paid_amount_inr`, `payment_status`, `advance_status`, `advance_requested_at`, `followup_status`. Store `created_at` and `advance_requested_at` as **plain-text ISO-8601 with offset** (e.g. `2026-11-18T14:30:00+05:30`), never Sheet date serials; parse strictly (A4). Advance request time is required **for advance-age eligibility**; if missing, mark that row as unverified, never infer another date. `due_at`, `assigned_to`, `contact_permission`, and `contact_phone_e164` are **not required in P0**. Introduce explicit `contact_permission` and a consented team-owned phone only if P0.5a actually ships; missing/unknown permission is never treated as allowed. Validate amounts into paise and quarantine bad rows.

**Source mapping:** For the prepared synthetic Sheet, fixed verified headers are acceptable P0. A generic CSV/Sheet import preview shows inferred-to-canonical header mappings and **requires merchant confirmation** before use if assisted mapping is implemented (P1). Gemini may suggest mappings but cannot silently decide them. Source row errors are counted and presented under **Needs Review**. CSV upload is read-only in-place: approved changes produce a **new downloadable CSV**, not mutation of the originally uploaded file.

## 5. Intent-to-UI contract

Gemini receives task context, **only necessary authorized metadata** and an allowlist; ideally it does not receive entire customer datasets. The model responds with a JSON object validated by a strict schema on the server.

Example (illustrative request, **not fixed defaults** or a production schema):

```json
{
  "intent": "advance_followup",
  "filters": [
    { "field": "totalInr", "operator": "gt", "value": 2000 },
    { "field": "advanceStatus", "operator": "eq", "value": "unconfirmed" },
    { "field": "advanceWait", "operator": "gt", "value": { "amount": 48, "unit": "hours" } }
  ],
  "sort": { "field": "advanceRequestedAt", "direction": "asc" },
  "groupBy": "none",
  "layout": "triage_queue",
  "modules": ["summary_cards", "orders_table", "evidence_drawer", "action_panel"]
}
```

**Enums and bounded operators:**

- `intent`: `advance_followup | outstanding_exposure | clarify` for P0. `daily_triage` and `order_lookup` are P1 and rejected until built (A6).
- `layout`: `triage_queue | exposure_summary` (approved compositions; never freeform HTML).
- `field`: approved canonical fields only: `totalInr`, `outstandingInr` (rupees), `orderAge`, `advanceWait` (durations), `paymentStatus`, `advanceStatus`, `assignedTo`. **Plans never use paise or raw hours (A2):** amounts are rupees and durations are `{ amount, unit: 'hours' | 'days' }`; server code converts ₹ × 100 → paise and days × 24 → hours, keeping the strictly-greater-than meaning.
- `operator`: `eq | gt | gte | lt | lte | in` with type-safe constraints.
- `sort`: approved field + `asc | desc`.
- `groupBy`: `none | paymentStatus` for P0; `assignedTo` is P1 if the column and feature are implemented.
- `modules`: registered IDs only. No HTML/JSX/SQL/function bodies from the model. P0 set: `summary_cards`, `orders_table`, `grouped_queue`, `evidence_drawer`, `action_panel`.
- `value`: parsed and bounded **per request**; for currency, rupees in the plan (the server converts to integer paise), for durations `{ amount, unit }` (the server converts to numeric hours), for status, an approved enum. `2000` and `48 hours` in the example above are **replaceable inputs**.
- **Clock (A1):** each elapsed-time condition names its clock through its field: `orderAge` counts from `createdAt`, `advanceWait` counts from `advanceRequestedAt`. In P0 each preset fixes one clock and shows it in its chips; a clock selector and clarification prompt are P1.

**Guided preset contract:** The Triage Queue and Exposure Summary open with **editable** default chips. Changing amount from ₹2,000 to ₹5,000 or delay from 48h to 72h updates the same typed view plan and recomputes server-backed results. For the event, in-session editable state is sufficient; **persisted per-business defaults are P1 unless implemented**. The server validates the edited plan again; client-side filtering alone is not the source of truth. **P0 compositions (A1):** Triage Queue = `summary_cards` + `orders_table` + `evidence_drawer` + `action_panel` (money field `totalInr`, clock `advanceWait`); Exposure Summary = `summary_cards` + `grouped_queue` grouped by `paymentStatus` (money field `outstandingInr`, clock `orderAge`). Only the amount and duration chips are editable in P0.

Unknown fields, unsupported operations, unreasonable limits and invalid JSON are rejected. A safe preset may be shown with a truthful "AI unavailable / preset view" indicator, or one clear clarification question may be asked. The model cannot decide that a write is authorized.

## 6. Backend service boundaries

Suggested endpoints/contracts to finalize before frontend/backend parallel work:

| Route (proposed) | Purpose | No-go behavior |
|---|---|---|
| `GET /api/orders` | Return validated orders, source type/freshness and validation issues. | Never expose service credentials. |
| `POST /api/plan` | Convert task text to a **validated** view specification. | Never execute arbitrary model code. |
| `POST /api/followups/draft` (P0.5a) | Verify consent and allowed fields, return **editable unsent** reminder plus safe `wa.me` handoff metadata. | Refuse unknown/denied permission; never transmit message or issue a send claim. |
| `POST /api/actions/preview` | Create an immutable **server-stored** preview keyed by an unguessable random `actionId`, bound to the authenticated operator/session and expiry; return only the ID and display-only diff. | Never trust browser-submitted old/new values or mutate during preview. |
| `POST /api/actions/execute` | On explicit approval, accept only `actionId`; verify actor/session, claim the action once in durable storage, re-check the Sheet, apply the one allowed update, re-read and receipt. | **No anonymous public writes.** Reject replay, expired, stale or mismatched sessions. |
| `POST /api/csv/export` (P1, cut for P0) | Produce a downloaded copy with user-approved changes and a truthful export receipt. | Never imply the originally uploaded file was edited remotely. |
| `GET /api/activity` | Return truthful action outcomes with timestamps. | Never invent success events. |

All handlers validate input and give structured errors. **Public-endpoint protection (A8 + A12):** a publicly reachable app is not necessarily authorized for writes. **Require an authenticated operator or server-validated protected demo session** for `/api/actions/preview` and `/api/actions/execute`; merely hiding UI buttons, using obscure action IDs or rate limiting **does not grant authorization**. If this gate is not implemented, the deployed version must be **read-only** and the presenter performs writeback only in protected local/private mode. Add per-IP/actor rate limits on `/api/plan` and action routes, a request-body cap, a prompt length cap (e.g. 300 characters), an 8-second Gemini timeout with preset fallback and a Google Cloud billing alert. Rate limiting is abuse/cost control **in addition to** authentication. Return stable IDs; never identify an order solely by sheet row index because rows can move.

## 7. Safe mutation protocol

1. Choose a single approved `orderId` and allowed operation (`followup_status` only for P0). `pending → reviewed` means a human reviewed it. `pending/drafted → contacted` requires a **separate explicit operator attestation** that a permitted, manually sent message actually occurred; it is **not a verified delivery receipt**. Never let merely creating a draft or opening `wa.me` qualify.
2. Server constructs an immutable preview with `expectedOldValue`, `newValue`, `sourceId`, `orderId`, **authorized actor/session**, unpredictable `actionId` and expiration, and **stores it server-side**. The browser holds only `actionId` (A3/A12).
3. UI displays exact before/after; user presses **Approve**. Closing/cancelling changes nothing.
4. Server loads the stored preview by `actionId` (never browser-supplied values), rechecks **operator identity and preview ownership**, expiration, allowed fields, stable `orderId`, uniqueness and current old value. For future `contacted`, also recheck contact permission and attestation; reject if missing/revoked.
5. If source value changed, reject as **stale** and require a new preview.
6. Server updates only the target cell, then re-reads and verifies it.
7. Write an audit record with actual result (`succeeded`, `failed`, `stale`), source, timestamp and actor.
8. **Public Cloud Run mode:** persist preview + action status in **Firestore**. Use a Firestore transaction to claim a pending action exactly once **before** any Sheets write, then record verified success/failure. Never execute a Sheets write within a retried Firestore transaction. A crash between claiming and verifying may leave **`uncertain`**; inspect the actual Sheet before manual reconciliation, **never blindly retry**. Firestore action-state atomicity does **not** make the external Sheets write atomic (A3/A13).

**Local-only fallback:** In-memory preview/action status may be used for one developer process with a **single operator** and labelled limitations; after a restart its idempotency history is lost, so it is **not suitable for public Cloud Run write endpoints**. `max-instances=1` or session affinity does not fix this. If Firestore or a protected operator gate is unavailable, deploy **read-only**, and demonstrate the approved write locally only if the single-process limitations are explicitly disclosed.

**Manual messaging boundary (P0.5a draft and link only; the attested `contacted` write is P1, A10):** The backend constructs a draft from minimum safe context *only after* `contactPermission === 'allowed'` and a valid test contact exists. Gemini sees no phone number; the app makes the encoded `https://wa.me/<digits>?text=<encoded text>` URL after review. A user click opens the chat but **sends nothing automatically**. In P0.5a the only states are **draft ready / unsent** and **link opened / sending unverified**. Operator attestation, `contacted` source changes and delivery claims are **not implemented until P1**. Use only consented team-owned test numbers.

**Technical honesty:** A simple Sheets read-check-write is *not* a truly atomic compare-and-swap against simultaneous external edits. For the Buildathon use controlled synthetic data, a single-user demo and conflict rechecks; production concurrency protection remains open work. Do not describe this as a bank-grade transaction.

## 8. Security, provenance and environments

- `GEMINI_API_KEY` exists **only** in `web/.env.local` on authorized developer machines/server secrets, never in source control, browser bundles or `NEXT_PUBLIC_*` variables.
- Google credentials likewise remain server-side; share only a synthetic test Sheet with the minimum needed permissions. Do not paste keys into agent conversations, PRs or screenshots.
- **Auth decision (A5):** service account. Share the synthetic Sheet to its email with edit access. Local dev reads the key from server-only env; on Cloud Run attach the service account, with no key file in the image or repo.
- Source notes and model outputs are untrusted text; escape rendering, disallow external code execution and treat prompt-injection content as inert data.
- No programmatic message sending, payments or financial field mutations. An actual *manual* test message is allowed only with explicit permission from the test recipient; otherwise showcase the editable draft as unsent and never mark `contacted`.
- The model should receive only minimum order data necessary for intent/draft; store no actual third-party phone data in logs. Treat `contact_permission` as default-deny and gate the draft **before** prompting Gemini.
- UI must display live Sheet vs CSV vs local demo mode and last refresh time.
- A production system will additionally need authenticated actors, tenant separation, encryption, consent, data retention and controlled OAuth credential lifecycle. Do not claim those already exist.

## 9. Deployment and fallback strategy

**Preferred:** Next.js app with server-only Gemini and Sheets access; attempt the `web/` Cloud Run hello-world deploy **early but timebox it to 30 minutes**. Cloud Run is private by default unless public access is enabled; if public, enforce the API protections above. A publicly shared app may be **read-only**, with protected local writeback shown by the presenter. **Backup:** Same UI and source contracts on a labelled local synthetic dataset. Never claim public writeback or persistence unless tested. A screen recording is supporting evidence, not a substitute for live verification.

**Go/no-go test:** Can the two named presets produce different registered views, can operators change **amount / delay** (the clock is fixed per preset in P0, A1) and obtain correct recomputed results *without code changes*, and can an approved action update the original source with a verified receipt? If no, stop adding features and repair that vertical slice. Only then attempt the manual WhatsApp draft and link (P0.5a, A10); mapping, export and the `contacted` write are P1.

## 10. Implementation order

1. Hello-world deploy of `web/` to Cloud Run; settle service-account auth (A5, A9).
2. Confirm the **fixed field and clock for each preset and the safe editable amount and duration ranges**. Keep the slide's amount/delay as example input, not defaults mandated for every business; then freeze the test Sheet columns, IDs and consent statuses.
3. Prove the Sheet read; prepare a clearly labelled local fallback behind the same adapter interface, and Needs Review cases.
4. Freeze typed order, request/response and view contracts; implement **one parameterized deterministic filter engine** (rules take `now`) and test ₹2,000/48h and ₹5,000/72h against a fixture clock, plus invalid values.
5. Build **Triage Queue** and **Exposure Summary** compositions; wire read-only API.
6. Add server-only Gemini constrained planning with validation, an 8-second timeout and preset fallback.
7. Implement `pending → reviewed` approved write, re-read and audit; run the release-gate checks (A7).
8. **Only after the release gate passes:** consent-gated editable draft and user-triggered manual `wa.me` handoff (P0.5a). The separately attested `contacted` action is P1 (A10); test never-contact paths and audit wording.
9. Assisted mapping and CSV export are P1; test, rehearse and submit early.

See `../RULES.md` for engineering safety and `../TASKS.md` for ownership and acceptance tests.
