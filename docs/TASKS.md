# NIRVAAH — Buildathon Tasks, Ownership and Test Plan

**Version:** 1.4 · 20 November 2026 · Submitted pitch, configurable thresholds and consolidated mentor/security amendments A1–A16  
**Status legend:** `[x] verified`, `[ ] not verified / not started`, `[~] in progress (requires evidence)`.

> **Deadline caution:** Team reported a Day 2, 09:00 IST prototype submission expectation for 21 November 2026. Confirm the actual rule and upload requirements with organisers. Submit early enough to allow failures/retries.

## 1. Confirmed environment status

- [x] Atherva's Antigravity can create and execute a Node.js file.
- [x] Smith's Antigravity can create and execute a Node.js file.
- [x] Both laptops have Node.js, npm and Git.
- [x] Private GitHub `atherva15/Nirvaah` exists; Smith accepted access.
- [x] Next.js/TypeScript/Tailwind scaffold at `web/` runs on Atherva's `localhost:3000`.
- [x] Initial commit `898ed6973f029a9465dd0c0438373f38cbe25cde` pushed to `main`.
- [x] Smith reports having matching short commit `898ed69`.
- [x] Atherva installed and had Antigravity verify 15 Superpowers skills.
- [ ] Verify Smith can run Next.js on his laptop (matching commit alone proves code sync, not runtime).
- [ ] Verify Smith's Superpowers installation.
- [ ] Verify 21st.dev skill installation if UI code discovery is needed.
- [ ] Validate first **real** Sheets read and permitted write with synthetic data.
- [ ] Validate Gemini structured output in a server-only route.
- [x] Founder clarified **₹2,000 and 48 hours are examples only**; different businesses/operators must be able to request different thresholds. **This is a product requirement, not verified implementation.**
- [ ] Agree the amount and duration ranges and each preset's one fixed money field and clock (A1); the interpretation is always shown in the chips.
- [ ] Produce and approve the named **Triage Queue** and **Exposure Summary** compositions.
- [ ] Verify an explicit permission field and an agreed permitted test contact before attempting WhatsApp draft/link work.
- [ ] Timeboxed **30-minute** hello-world deploy of `web/` to Cloud Run (A9/A15). If blocked, return to the local vertical slice.
- [ ] Service account created; synthetic Sheet shared to its email; actual read/write permission tested **as soon as possible** (A5).
- [ ] Before any public writeback, verify **server-side operator/session authorization + durable action storage**. Otherwise public deployment is **read-only** (A12/A13).

**Do not mislabel setup success as application feature completion.** The current committed app is the Next.js foundation, not a working Nirvaah workflow.

## 2. Team ownership and merge policy

| Owner | Primary files / responsibility | Handshake |
|---|---|---|
| Atherva | `web/src/app/` main views, `web/src/components/`, `web/src/features/`, CSS and copy | Use agreed type/API contracts; no fake backend state. |
| Smith | `web/src/lib/` adapters/rules, `web/src/app/api/`, tests, server-only secrets setup | Return typed, documented responses; do not redesign main UI. |
| Both | `web/src/types/` shared contracts, `docs/`, integration, review and demo | Review together before edits to shared definitions. |

Branches: `feat/nirvaah-interface` and `feat/nirvaah-backend` are proposed working branches. Confirm actual branch before coding. Do not both rewrite the same file concurrently. Prefer small commits, review/PR, lint/build and source-backed tests before merging. Keep original milestone on `main` intact until review.

## 3. P0 implementation board — order matters

| ID | Owner | Task | Definition of done | State |
|---|---|---|---|---|
| T-00 | Both | Approve these six docs (with Amendments A1–A11) and terminology. | Agree configurable amount and duration inputs, the fixed field and clock per preset, status and permission enums; **no global ₹2,000/48h rule**. | `[ ]` |
| T-00a | Smith | **Timebox 30 minutes** for a hello-world Cloud Run deploy (A9/A15). | Private/authenticated URL responds or read-only public URL responds; env/secret path understood; else defer hosting. | `[ ]` |
| T-01 | Atherva | Create realistic synthetic custom-order merchant dataset of ~20 orders using **only nine P0 columns** (A16). | Order/payment/advance fields and statuses; ISO-text timestamps and fixed fixture `now` (A4); separate invalid fixture with duplicates/bad dates. **No consent, phone, due-date or assignee column in P0.** | `[ ]` |
| T-02 | Smith | Create dedicated synthetic Google Sheet and **service account** (A5); share the Sheet to its email. | Test real read and permitted update as soon as possible; never use customer records or keys in Git. | `[ ]` |
| T-03 | Smith | Implement schema parser + normalized `Order` model and simple Needs Review count/list. | Reject bad rows, duplicate IDs, invalid amounts/dates and missing advance-age evidence. Do not add optional P1 columns. | `[ ]` |
| T-04 | Smith | Implement one **parameterized** rule engine and tests. | Numeric amount and duration values are typed inputs; each preset has one fixed money field and clock (A1); rules take `now`; two or more different requests (₹2,000/48h and ₹5,000/72h) filter/sort/justify independently. | `[ ]` |
| T-05 | Both | Freeze backend API + restricted UI DSL. | Agree request/response types; typed examples pass validation. | `[ ]` |
| T-06 | Atherva | Build premium persistent shell and guided Today. | New user opens Triage Queue or Exposure Summary without prompts, **with editable amount/delay controls**; source mode labelled; only built tasks shown as tiles (A6). | `[ ]` |
| T-07 | Atherva | Build two different registered task compositions. | Triage Queue vs Exposure Summary visibly differ; chips show each preset's fixed field and clock and the **current operator's** amount and duration (A1). | `[ ]` |
| T-08 | Smith | Build Sheets adapter + read-only API. | Browser UI consumes genuine normalized records. | `[ ]` |
| T-09 | Smith | Build server-side Gemini plan endpoint. | Valid structured output or truthful safe fallback; no model facts/writes. Plan uses ₹ and `{ amount, unit }` durations (A2); 8-second timeout, input length cap and per-IP rate limit (A8). | `[ ]` |
| T-10 | Both | Integrate planner, rules and UI. | Prompt changes modules/filters; verified values remain correct. | `[ ]` |
| T-11 | Atherva | Build Evidence Lens and action-review UI. | Source field, selected amount/clock, rule and exact `pending → reviewed` before/after shown; cancel safe. | `[ ]` |
| T-12 | Smith | Implement `followup_status` allowlisted update + recheck + receipt. | Only **server-stored, actor/session-bound `actionId`** is executable; original Sheet's one cell changes on explicit approval and is re-read. **No anonymous public writes** (A3/A12). | `[ ]` |
| T-13 | Smith | Implement idempotency, failure/audit and source uncertainty. | If publicly hosted with write, use Firestore durable single-use action state. If Firestore/auth unavailable, deploy **read-only** and demonstrate protected local-only writes. A lost process is **not** restart-safe merely because Cloud Run max-instances=1 (A13). | `[ ]` |
| T-14 | Both | End-to-end validation and fallback. | Full loop runs three times; offline/local fallback is visibly labelled. | `[ ]` |
| T-15 | Atherva | Polish 90s demonstration, slides and recording. | Judge can see source, dynamic UI, approval, original changed source and receipt. | `[ ]` |
| T-16 | Both | Submit required prototype/evidence. | Confirm actual upload portal, format, deadline and successful receipt. | `[ ]` |
| T-17 | Smith (P0.5a, only after the release gate passes) | Implement consent-gated follow-up draft API and safe link contract. | Denied/missing/unknown → no draft/link; Gemini sees minimal fields; no sending API. | `[ ]` |
| T-18 | Atherva (P0.5a) | Build editable draft and user-initiated `wa.me` handoff (no status write). | Opening the link does not update status and creates no `contacted` claim. | `[ ]` |
| T-19 | Both (P1, A10) | Integrate attested `pending/drafted → contacted` action. | Only after explicit actual-send attestation; source verified; receipt says delivery unverified. | `[ ]` |
| T-20 | Both (P1, A6) | CSV approved-change export. | Download a new CSV; original upload is not falsely called synced. | `[ ]` |
| T-21 | Both (P1) | Assisted schema mapping and merchant confirmation. | No unknown mapping used until confirmed; invalid rows go to Needs Review. | `[ ]` |

**Critical path:** **T-00 first** (T-00a timeboxed in parallel) → T-01/T-02/T-03/T-04 → T-05 → T-08/T-07/T-09 → T-10 → T-11/T-12/T-13 → T-14 → T-16. **T-04/T-07:** adjustable amount and duration change results without code/source changes. If Sheets auth blocks, use truthful local fallback. **Only after release gate**, T-17/T-18 (P0.5a); T-19–T-21 are P1. **Never sacrifice the working loop for Cloud Run deployment or Firestore integration; choose an honestly read-only public build with protected local writeback if needed.**

## 4. First implementation tickets — scoped for agents

### Atherva ticket F-01: task-first experience

**Inputs:** `PRD.md`, `DESIGN.md`, sample typed contract from `ARCHITECTURE.md`.  
**Touch:** Main UI/components/styles; do **not** alter backend routes or real data files.  
**Deliver:** Persistent shell, **Triage Queue** and **Exposure Summary** presets, **editable amount/duration chips (each preset's field and clock shown, A1)**, task input, priority queue, source badge, loading/empty/error states and evidence drawer. Initially use **visibly labelled synthetic data**; wire to real API once Smith's contract is merged.  
**Proof:** Screenshot at laptop and mobile width; keyboard tab/submit; no broken console errors; lint and build outputs.  
**Avoid:** Fake live badge, unsupported navigation pages, a Sources screen, a priority timeline, arbitrary AI-generated JSX or production-claim copy.

### Smith ticket B-01: truthful data and rules

**Inputs:** `ARCHITECTURE.md` Order contract; same fixture schema.  
**Touch:** Domain, adapters, validation, tests and API routes; do **not** alter main UI files.  
**Deliver:** Parser, valid/invalid fixtures, source mode/provenance, deterministic **user-configurable amount/time filters and sorting**, explicit consent normalization, stable IDs, read-only orders endpoint and explicit errors. Test synthetic Sheets read as soon as credentials are ready.  
**Proof:** Unit tests for **₹2,000/48h vs ₹5,000/72h**, total vs outstanding, order vs advance clock, invalid numbers/dates and duplicate IDs; API with source labels. Consent tests apply only if P0.5a ships.  
**Avoid:** Writing to original records before an approved review contract, leaking credentials or inventing status.

### Shared ticket I-01: one working flow

Connect actual read results to the adaptive workspace; show source-backed evidence; finish a permitted status change **only after explicit approval**; re-read the original Sheet and audit. Conduct a live screen-share from the other laptop. The agreed schema and routes are a prerequisite; don't merge two incompatible implementations blindly.

## 5. Thirty acceptance checks: a 12-check release gate (A7), 11 further P0 checks and 7 conditional checks

**Source and schema**

- [ ] Q01: Real permitted synthetic Sheet read returns expected number and IDs.
- [ ] Q02: Missing required column is shown as a schema issue, not a silent empty list.
- [ ] Q03: Duplicate `order_id` blocks mutations and is reported.
- [ ] Q04: Invalid/negative amounts and `paid > total` are rejected.
- [ ] Q05: Unparsable/ambiguous date is rejected or marked unverified.

**Planner and adaptive UI**

- [ ] Q06: Today preset needs no AI prompt.
- [ ] Q07: **Example A:** the Triage Queue preset with ₹2,000 / 48h on the fixture clock matches an independently computed result.
- [ ] Q08: **Example B:** the Exposure Summary preset with outstanding > ₹5,000 and order age > 72h on the fixture clock produces independently correct results; oldest/newest sort changes order with stable ties.
- [ ] Q09: Second intent/grouping produces a different component arrangement.
- [ ] Q10: Unsupported model field/operator is rejected; an ambiguous request shows its interpretation in the chips (the clarification prompt is P1).

**Review and actions**

- [ ] Q11: Cancel/close makes zero changes to original Sheet.
- [ ] Q12: Approved `pending → reviewed` changes exactly one allowed Sheet cell, re-read matches, and no contact claim is created.
- [ ] Q13: Repeated approval/double-click does not repeat effect.
- [ ] Q14: Changed source value or moved row requires re-preview, never blind overwrite.
- [ ] Q15: Read-only/denied permissions produce truthful failure and no success receipt.

**Reliability and UX**

- [ ] Q16: Gemini timeout gives a known safe preset with explicit AI-unavailable status.
- [ ] Q17: Source refresh failure leaves stale results labelled and proposes recovery.
- [ ] Q18: Reload doesn't fabricate task, approval or history persistence.
- [ ] Q19: Narrow screen, focus and keyboard are usable.
- [ ] Q20: A new person can finish the **Triage Queue** preset without prompts from the founders.

**Pitch-alignment and optional contact path**

- [ ] Q21 (P0): Missing **selected** date clock goes to Needs Review instead of substituting another clock.
- [ ] Q22 (P0): Changing typed amount/duration chips **without a code change** refreshes the verified queue/count; invalid values show errors (ambiguous-field clarification is P1).
- [ ] Q23 (P0): Triage Queue and Exposure Summary use visibly distinct registered UI compositions; source row explains the **currently selected** money field and timestamp.
- [ ] Q24 (P0.5a): `contact_permission = denied` means no reminder generated and no WhatsApp link.
- [ ] Q25 (P0.5a): Missing/unknown/revoked permission is fail-closed even if Gemini or client requests a draft.
- [ ] Q26 (P0.5a): Allowed contact gets an **editable** unsent draft; phone does not enter Gemini prompt or logs.
- [ ] Q27 (P0.5a): `wa.me` URL is correctly encoded and only opens on user gesture; opening it causes no source update.
- [ ] Q28 (P1, A10): Without an **actual** manual-send attestation, `pending/drafted → contacted` is denied; no delivery confirmation is invented.
- [ ] Q29 (P1, A10): After truthful explicit attestation and approval, exactly one metadata cell changes; audit states **operator-confirmed / delivery-unverified**.
- [ ] Q30 (P1, A6): CSV export creates a separate approved updated file, and does not claim to mutate the uploaded CSV.

**Release gate (A7):** Q01, Q03, Q07, Q08, Q10, Q11, Q12, Q13, Q14, Q16, Q22 and Q23 must pass before P0.5/P1 work. **Additional hard safety gates when relevant:** Q04/Q05 invalid data cannot be treated as trusted; Q15 failure cannot be misreported as success. For any public deployment with write enabled, **G1:** authenticated operator/session authorization is demonstrated and **G2:** action IDs/terminal states persist in Firestore through a restarted instance. If G1/G2 are unverified, **public deployment is read-only** and the protected local write may be demoed separately, with honest disclosure. This is a **deployment choice**, not a claim that public writeback passed. Q24–Q27 apply only if P0.5a ships; Q28–Q30 only for P1. Record actual pass/fail; no tick without evidence.

## 6. Demo script and fallback checkpoints

1. Show original synthetic Sheet, its IDs and a small unpaid example.
2. Open Nirvaah -> **Triage Queue** -> valid unconfirmed-advance exceptions.
3. Type the submitted **example** query -> inspect interpreted chips, **change ₹2,000 to ₹5,000 and 48h to 72h**, and prove records recalculate; switch to **Exposure Summary** for a second composition.
4. Open evidence for one selected order.
5. In a **protected presenter session/local-only mode**, preview `pending → reviewed` → approve → show one original Sheet cell changed (**no message sent**). A public read-only URL must not expose a working write button.
6. Return to action history -> show matching receipt.
7. **If P0.5a passes its checks:** show the consent badge → edit the unsent draft → open `wa.me` manually. Stop there; never pretend an opened link means sent or delivered.
8. If challenged: show a different grouping or explain the distinct amount/time clocks.

**If Sheets auth fails:** Local/CSV demo with accurate source badge and no live-Sheet claim.  
**If Gemini fails:** Validated preset and deterministic rules with accurate fallback label.  
**If deployment fails or safe public write protection is unfinished:** Local reproducible and **clearly protected** write demo + read-only public UI if available. Never imply publicly accessible writes or durable action state exist.  
**If time is low:** Freeze new modules; fix source read, **parameterized amount/time semantics**, two registered views, approved write/re-read/receipt. Keep at least two tested user-defined thresholds and one editable filter control. Defer WhatsApp, mapping and CSV export rather than present them as working.

## 7. Last-minute operational checklist

- [ ] Confirm event deadline and evaluation submission format with organiser/mentor.
- [ ] Rate limits, input caps, an 8-second Gemini timeout and a billing alert are in place before sharing the deployed URL (A8).
- [ ] **Deployment G1:** Test unauthenticated `/api/actions/preview` and `/api/actions/execute` requests are rejected (or the public build has no write routes enabled).
- [ ] **Deployment G2:** If public write is enabled, test Firestore-backed action replay after a simulated process restart; no max-instance memory shortcut. If not tested, remain read-only publicly.
- [ ] `NIRVAAH_NOW` is either unset or visibly labelled "Demo clock" in the UI (A4).
- [ ] Ensure all developer keys remain local and are absent from tracked files.
- [ ] Confirm `npm run lint`, `npm run build`, tests and happy-path logs.
- [ ] Confirm both founders can reproduce startup commands (`cd web`, `npm ci`, `npm run dev`).
- [ ] Founder clarification recorded: **₹2,000/48h are examples, not defaults**; verify the tested UI surfaces any ambiguity in money field or clock.
- [ ] Live contact demo, if any, uses only a consented team-owned number; no customer records or automatic send.
- [ ] Prepare a short screen recording of the verified demo and an offline-safe fallback.
- [ ] Rehearse a 90-second pitch and two skeptical judge questions.
- [ ] Push an approved, tested commit and note its hash in `MEMORY.md`.
- [ ] Submit ahead of the confirmed deadline and keep a submission confirmation.

## 8. Updating this board

Mark a task `[x]` only after the definition of done has fresh supporting evidence. When someone completes a task, note the commit, test command/outcome and any remaining failure in `MEMORY.md`. A failed test is not a project failure; hiding it is.

## 9. Cut list (A1, A6, A10): do not build until the release gate passes

Sources screen beyond the badge and a small Needs Review list; assisted mapping UI (T-21); CSV export (T-20); field/clock selectors and the clarification prompt; priority timeline and Daily Priorities; `daily_triage` and `order_lookup` intents; tiles for unbuilt tasks; the phone column (until P0.5a); the attested `contacted` write (T-19); saved workspaces; manual quick-add; voice; A2UI; Supabase; billing.
