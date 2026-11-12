# Project memory

## Product intent & audience

- **Smart Campus Room Availability Checker** — a prototype web app for students/staff to check study room availability and book time slots on campus.
- Availability rules are codified as acceptance criteria AC1–AC6 (past-time rejection, duration limits, capacity filtering, mobile layout).
- No authentication or persistence by design (prototype scope); a `@supabase/supabase-js` dependency exists in `package.json` but is not yet wired up.

## Brand personality & voice

- Academic/utility tool; clarity over flair. Messaging is direct and rule-based (e.g., "Available", "Unavailable", reason strings with duration limits).

## Visual design & UX direction

- Vite + React + JSX, Tailwind CSS, Lucide React icons, `@/` path alias to `src/`.
- UI components: `RoomChecker` (main view with room list, filters, result card), `BookingForm` with `TimeField` (clamps numeric input).
- `index.html` loads Google Fonts and a bolt.new image on page load (external requests noted).
- Mobile responsiveness is an acceptance criterion (AC6) but not yet verified by tests.

## Decisions, constraints & rationale

- **`AGENTS.md`** governs agent operations: forbids editing `src/booking.js` and `python/can_book.py` (reference implementations in other languages); requires `npx vitest run` as verification. Lint/typecheck/build are NOT required by AGENTS.md.
- Three parallel rule implementations exist: `src/lib/availability.ts` (authoritative, tested), `src/booking.js` (untested), `python/can_book.py` (untested). Risk of drift.
- Rule constants live in `src/lib/booking-rules.ts`, but reason messages in `availability.ts` hard-code limit values (e.g., "120 min", "1440 min") as literal text instead of referencing constants.
- `currentTime` is a user-input field (default 540 = 9:00 AM) representing minutes-of-day, not tied to real clock time — intentional for prototyping/testing.

## Open questions & assumptions

- **Known bug:** `suggestNextSlot` in `availability.ts` can suggest a slot starting exactly at `currentTime`, which `checkAvailability` then rejects (off-by-one). No unit test covers this function.
- **Known bug:** `RoomChecker.tsx` does not clear `result` when filters change; sync effect (lines 51–55) can switch active room without re-running check, causing result-card/room-detail mismatch.
- **Known gap:** `checkAvailability` does not reject NaN inputs (returns "available"); currently unreachable from UI due to `TimeField` clamping but risky for future callers.
- **Unverified:** AC6 mobile layout has no test coverage.
- **Unverified:** Whether leftover edit markers in `vite.config.ts` (e.g., "CHANGED: was 'vite'") should be cleaned up.
- **Assumption:** Supabase dependency is dormant; no client instantiation exists in `src/` based on files reviewed, but full search not completed.