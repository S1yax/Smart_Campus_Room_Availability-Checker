import { test, expect, describe } from 'vitest';
import { checkAvailability } from '@/lib/availability';
import type { Room } from '@/lib/types';
import { ROOMS } from '@/lib/data';

const NOW = 540; // 09:00

const makeRoom = (over: Partial<Room> = {}): Room => ({
  id: 'test-room',
  name: 'Test Room',
  building: 'A',
  capacity: 10,
  equipment: ['Projector', 'Whiteboard'],
  blocked: false,
  bookings: [{ id: 'b1', label: 'Sample', start: 600, end: 660 }],
  ...over,
});

const status = (start: number, end: number, over: Partial<Room> = {}) =>
  checkAvailability(makeRoom(over), start, end, NOW).status;

// Original AC1-AC5 regression suite
test('T01 AC4: touching after is available', () => expect(status(660, 720)).toBe('available'));
test('T02 AC1: starts now is unavailable', () => expect(status(540, 570)).toBe('unavailable'));
test('T03 AC1: zero duration', () => expect(status(720, 720)).toBe('unavailable'));
test('T04 AC1: reversed interval', () => expect(status(750, 720)).toBe('unavailable'));
test('T05 AC1: past day end', () => expect(status(1380, 1441)).toBe('unavailable'));
test('T06 AC2: exactly 120 min is available', () => expect(status(720, 840)).toBe('available'));
test('T07 AC2: 121 min is unavailable', () => expect(status(720, 841)).toBe('unavailable'));
test('T08 AC4: touching before is available', () => expect(status(570, 600)).toBe('available'));
test('T09 AC4: partial overlap', () => expect(status(630, 690)).toBe('unavailable'));
test('T10 AC4: contains booking', () => expect(status(570, 690)).toBe('unavailable'));
test('T11 AC4: inside booking', () => expect(status(615, 645)).toBe('unavailable'));
test('T12 AC4: identical interval', () => expect(status(600, 660)).toBe('unavailable'));
test('T13 AC3: blocked room', () => expect(status(660, 720, { blocked: true })).toBe('unavailable'));
test('T14 AC4: no bookings', () => expect(status(630, 690, { bookings: [] })).toBe('available'));

test('AC5: bookings are not changed (immutability)', () => {
  const room = makeRoom();
  const before = JSON.stringify(room.bookings);
  checkAvailability(room, 660, 720, NOW);
  checkAvailability(room, 630, 690, NOW);
  expect(JSON.stringify(room.bookings)).toBe(before);
});

test('Own 1 AC1: request in the past (500-560) is unavailable', () =>
  expect(status(500, 560)).toBe('unavailable'));
test('Own 2 AC1/AC4: one minute after now, touching booking start (541-600)', () =>
  expect(status(541, 600)).toBe('available'));

// Regression suite: expected results per acceptance criterion (AC1-AC6).
const check = (start: number, end: number, over: Partial<Room> = {}) =>
  checkAvailability(makeRoom(over), start, end, NOW);

describe('REG AC1: past time', () => {
  // Request starts before the current time (09:00), so it is in the past.
  test('start 500 (08:20) before now 540 is unavailable with a current-time reason', () => {
    const res = check(500, 560);
    expect(res.status).toBe('unavailable');
    expect(res.reasons).toContain('Start (500) must be after the current time (540).');
  });

  // Start equal to now is not strictly after now, so it is rejected.
  test('start equal to now 540 is unavailable', () => {
    expect(check(540, 570).status).toBe('unavailable');
  });
});

describe('REG AC1: reversed interval', () => {
  // End (720) before start (750) is invalid; the end-after-start reason must appear.
  test('start 750 with end 720 is unavailable with an end-after-start reason', () => {
    const res = check(750, 720);
    expect(res.status).toBe('unavailable');
    expect(res.reasons).toContain('End time must be after start time.');
  });
});

describe('REG AC2: duration limit', () => {
  // 121 minutes exceeds the 120-minute maximum.
  test('121-minute request (720-841) is unavailable with the duration reason', () => {
    const res = check(720, 841);
    expect(res.status).toBe('unavailable');
    expect(res.reasons).toContain(
      'Booking duration is 121 min — the maximum allowed is 120 min.'
    );
  });

  // Exactly 120 minutes is the maximum and stays bookable, with a notice.
  test('120-minute request (720-840) is available with the maximum-duration warning', () => {
    const res = check(720, 840);
    expect(res.status).toBe('available');
    expect(res.warnings).toContain('This is exactly the maximum allowed duration.');
  });
});

describe('REG AC3: blocked room', () => {
  // The slot 660-720 is otherwise free (it only touches the 600-660 booking),
  // so the blocked reason must be the only one.
  test('a free slot in a blocked room is unavailable with only the blocked reason', () => {
    const res = check(660, 720, { blocked: true });
    expect(res.status).toBe('unavailable');
    expect(res.reasons).toEqual(['This room is currently blocked and cannot be booked.']);
  });
});

describe('REG AC4: overlap', () => {
  // 630-690 starts inside the existing 600-660 booking.
  test('partial overlap (630-690) is unavailable and names the conflicting booking', () => {
    const res = check(630, 690);
    expect(res.status).toBe('unavailable');
    expect(res.reasons).toContain('Overlaps an existing booking (Sample, 600–660).');
  });
});

describe('REG AC4: touching endpoints', () => {
  // 660-720 begins exactly when the 600-660 booking ends.
  test('request starting at a booking end (660-720) is available', () => {
    const res = check(660, 720);
    expect(res.status).toBe('available');
    expect(res.reasons).toEqual([]);
  });

  // 570-600 ends exactly when the 600-660 booking starts.
  test('request ending at a booking start (570-600) is available', () => {
    const res = check(570, 600);
    expect(res.status).toBe('available');
    expect(res.reasons).toEqual([]);
  });
});

describe('REG AC5: fixtures unchanged', () => {
  // Running every check against every fixture room must leave the fixtures identical.
  test('checkAvailability does not change any fixture room or booking', () => {
    const before = structuredClone(ROOMS);
    for (const room of ROOMS) {
      checkAvailability(room, 660, 720, NOW);
      checkAvailability(room, 630, 690, NOW);
      checkAvailability(room, 540, 720, NOW);
    }
    expect(ROOMS).toEqual(before);
  });
});
