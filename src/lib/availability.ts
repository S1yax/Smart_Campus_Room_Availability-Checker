import type { Room, CheckResult } from './types';
import { intervalsOverlap, clamp } from './utils';

const MAX_BOOKING_MIN = 120;
const MAX_TIME = 1440;

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): CheckResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // AC1: interval validity — 0 ≤ start < end ≤ 1440 and start after current time
  if (start < 0) {
    reasons.push('Start time cannot be before 00:00 (0 min).');
  }
  if (end > MAX_TIME) {
    reasons.push('End time cannot exceed 24:00 (1440 min).');
  }
  if (start >= end) {
    reasons.push('End time must be after start time.');
  }
  if (start <= currentTime) {
    reasons.push(
      `Start (${start}) must be after the current time (${currentTime}).`
    );
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > MAX_BOOKING_MIN) {
    reasons.push(
      `Booking duration is ${end - start} min — the maximum allowed is 120 min.`
    );
  }

  // AC3: reject when the selected room is blocked
  if (room.blocked) {
    reasons.push('This room is currently blocked and cannot be booked.');
  }

  // AC4: reject intervals that overlap an existing booking (touching is allowed)
  const conflicts = room.bookings.filter((b) =>
    intervalsOverlap(start, end, b.start, b.end)
  );
  if (conflicts.length > 0) {
    const first = conflicts[0];
    reasons.push(
      `Overlaps an existing booking (${first.label}, ${first.start}–${first.end}).`
    );
  }

  const available = reasons.length === 0;

  if (available && end - start === MAX_BOOKING_MIN) {
    warnings.push('This is exactly the maximum allowed duration.');
  }

  return {
    status: available ? 'available' : 'unavailable',
    reasons,
    warnings,
  };
}

export function suggestNextSlot(
  room: Room,
  currentTime: number,
  duration: number
): { start: number; end: number } | null {
  const dur = clamp(duration, 1, MAX_BOOKING_MIN);
  const sorted = [...room.bookings].sort((a, b) => a.start - b.start);

  let cursor = Math.max(currentTime, 0);

  for (const b of sorted) {
    if (cursor + dur <= b.start) {
      return { start: cursor, end: cursor + dur };
    }
    cursor = Math.max(cursor, b.end);
  }

  if (cursor + dur <= MAX_TIME) {
    return { start: cursor, end: cursor + dur };
  }

  return null;
}
