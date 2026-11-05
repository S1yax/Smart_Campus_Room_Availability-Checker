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
  - AC1: reject start >= end and requests that start in the past.
  - AC2: reject durations longer than 120 minutes.
  - AC3: reject a blocked room.
  - AC4: reject overlaps; bookings touching only at endpoints are allowed.
  - AC5–AC6: do not mutate booking data; keep clear desktop and mobile feedback.
- No backend, login, database or saved booking creation.
- Do not change the existing UI, fixture data or validation messages unless asked.
- Do not touch src/booking.js or python/can_book.py.

## Engineering rules
- Prefer pure functions and minimal changes.
- Use at most 2 justified design patterns; if none is justified, use none and explain why.
- Do not mutate booking fixtures.
- Do not weaken or delete existing test assertions.

## Verification
- Run all tests with: npx vitest run
- Add focused regression tests for any changed behavior.
- Report: changed files, rationale, and test evidence (command, output, passed/failed count).