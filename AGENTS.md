# AGENTS.md

## Project
Smart Campus room availability checker. One-page web app (React + TypeScript + Vite, Vitest tests). Students check whether a room is free for a chosen time interval. Fictional fixture data only.

## Structure
- src/lib/availability.ts: booking rules (checkAvailability, suggestNextSlot)
- src/lib/booking-rules.ts: shared rule constants (MAX_BOOKING_MIN, MAX_TIME, SUGGESTION_LENGTH_MIN)
- src/lib/data.ts: fixture data (rooms and bookings)
- src/lib/filter.ts, src/lib/utils.ts, src/lib/types.ts: helpers and types
- src/components/: UI (RoomChecker, Timeline, BookingForm, etc.)
- Tests: src/lib/availability.test.ts, src/lib/filter.test.ts, src/components/RoomChecker.test.tsx

## Constraints
- Preserve acceptance criteria AC1–AC6:
  - AC1: reject start >= end, a start at or before the current time, a start before 0, and an end after 1440.
  - AC2: reject durations longer than 120 minutes.
  - AC3: reject a blocked room.
  - AC4: reject overlaps; bookings touching only at endpoints are allowed.
  - AC5: booking data is never changed; the fixtures are identical after any check.
  - AC6: the result and its reasons are readable on desktop and on a phone-sized screen, with no horizontal scrolling and no hidden messages.
- No backend, login, database or saved booking creation.
- The Supabase package in package.json stays dormant: do not remove it, connect to it, or call it unless the user explicitly asks.
- No secrets or API keys in the code, and no external deployments or publishing.
- Do not change the existing UI, fixture data or validation messages unless asked.
- Do not touch src/booking.js or python/can_book.py. They are reference copies of the rules and are not used by the app.

## Engineering rules
- Prefer pure functions and minimal changes.
- Use at most 2 justified design patterns; if none is justified, use none and explain why.
- Do not mutate booking fixtures.
- Do not weaken or delete existing test assertions.
- Known bugs R1 and R2 (see Known deviations) are deferred to Task 8 and are fixed there only with a minimal patch.

## Verification
- Run all tests with: npx vitest run. They must pass before any change is proposed for acceptance.
- Run the typecheck with: npm run typecheck. It must pass before any change is proposed for acceptance.
- Add focused regression tests for any changed behavior.
- AC6 has no automated test; check it by hand at desktop and phone-sized widths and note the result.
- Report: changed files, rationale, and test evidence (command, output, passed/failed count).

## Known deviations
- Room count: the project constraint says one fictional room, but the fixture data has five (lib-101, lib-102, eng-205, sc-301, tech-104). The five-room data is kept and must not change.
- R1: suggestNextSlot in src/lib/availability.ts can suggest a slot that starts at the current time, which checkAvailability then rejects. Deferred to Task 8.
- R2: RoomChecker.tsx does not clear the result when filters change, so the result card can describe a different room from the one shown. Deferred to Task 8.
- AC6 has no automated test coverage.
