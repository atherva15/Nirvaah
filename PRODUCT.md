# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router (React, TypeScript, Tailwind CSS) synchronized with `web/` from GitHub (`atherva15/Nirvaah`). Server-side Gemini API for structured task and view planning, with Google Sheets API (service account) / local CSV / synthetic fallback data adapters.

## Users

Primary users are Indian made-to-order apparel and gifting merchants with 1–5 staff who coordinate custom orders, advance deposits, and customer communications across Instagram, WhatsApp, and spreadsheets. Their primary operational moment is the daily 6 PM closing bottleneck: identifying payment and advance exceptions and deciding which orders require immediate follow-up before closing shop.

## Product Purpose

Nirvaah transforms scattered business information into an adaptive, task-specific operations workspace. It highlights verified priorities, explains exact underlying reasons, and proposes controlled next steps without autonomous or unapproved actions. Success means the merchant can inspect daily priorities, review proposed updates with full data provenance, and confirm single-field changes back to the source records with a transparent, verified receipt.

## Positioning

"Your business. A clearer way forward." Nirvaah is an adaptive business operations workspace—not another static dashboard, generic chatbot, autonomous black-box agent, or heavy ERP. It addresses businesses ready to operate and scale with clarity, rejecting patronizing "cheap" or "small" merchant tropes. Critical business math runs deterministically in application code; generative AI only plans restricted task views and drafts restrained communication copy.

## Operating Context

- Daily 6 PM closing routine triaging custom orders, unconfirmed advances, and overdue follow-ups.
- Fragmented communication and records across WhatsApp chats, Instagram DMs, paper notes, and Google Sheets.
- Operations run across desktop and mobile browsers in retail or home-studio environments.
- Source data originates from live Google Sheets, uploaded CSVs, or labelled synthetic demo datasets.

## Capabilities and Constraints

- **Adaptive Task Layouts:** Dynamic recomposition between two P0 registered views: **Triage Queue** (orders table, summary cards, evidence drawer, action panel) and **Exposure Summary** (summary cards, grouped queue by payment status).
- **Deterministic Parameterized Engine:** Math, money parsing (integer paise), date diffs, and filter rules execute strictly in deterministic code with an explicit `now` clock. Thresholds (such as ₹2,000 and 48 hours) are user-configurable inputs, not hardcoded merchant policies.
- **Strict Human-in-the-Loop Mutation:** Zero autonomous writes. P0 only allows updating allowlisted metadata: `followup_status: pending → reviewed`. Actions require server-stored previews keyed by secure single-use `actionId` and explicit human approval.
- **Messaging Boundaries (P0.5a / P1):** No automated message sending or delivery claims. P0.5a supports consent-gated editable draft reminders and a manual `wa.me` prefilled link handoff. Attestation of manual send and updating `followup_status` to `contacted` are deferred to P1.
- **Data Integrity & Needs Review:** Strict parsing of ISO-8601 timestamps and canonical order fields. Rows with duplicate IDs, invalid dates, or inconsistent amounts are quarantined in a visible "Needs Review" list rather than included in confident queues.

## Brand Commitments

- **Name:** Nirvaah.
- **Team:** Vistaar (Atherva Rajapurkar & Smith Ritesh Patil).
- **Voice & Tone:** Calm, capable, transparent, premium operations cockpit; avoids casino aesthetics, AI hype jargon, and clutter.
- **Visual Identity:** Warm light canvas (`#F7F8FA`), crisp card surfaces (`#FFFFFF`), calm teal-green brand accents (`#256C64`), high-contrast ink (`#17212B`), and restrained status colors with explicit labels.

## Evidence on Hand

- Nine canonical P0 Sheet headers: `order_id`, `customer_name`, `created_at`, `total_amount_inr`, `paid_amount_inr`, `payment_status`, `advance_status`, `advance_requested_at`, `followup_status`.
- Startup Buildathon India 2026 (Mumbai City Buildathon) 8-page pitch deck and v1.4 architectural specifications.
- **Explicit Absences:** No automated WhatsApp Business API integration, no automated banking or payment gateway transactions, no real customer PII in AI prompts.

## Product Principles

1. **Determinism over Hallucination:** All financial calculations, time intervals, and filter logic execute in typed, deterministic application code. AI never computes money or decides eligibility.
2. **Review before Consequence:** Consequential actions require explicit before/after preview, stable record re-check, and human sign-off. Cancel never mutates.
3. **Adaptive via Registered Modules:** Dynamic interfaces are assembled from audited, accessible design components, never by executing unconstrained LLM-generated code.
4. **Source Honesty & Traceability:** Every screen distinguishes live Sheets, imported CSVs, and synthetic local data. Every completed action produces an auditable receipt.

## Accessibility & Inclusion

- Adherence to WCAG AA contrast standards for all text and UI elements.
- Full keyboard navigability with visible focus indicators and accessible dialogs.
- Status and alerts conveyed through text and iconography, never color alone.
- Responsive design tailored for desktop operations and mobile quick-checks.
