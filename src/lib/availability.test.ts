import { test, expect } from 'vitest';
import { checkAvailability } from '@/lib/availability';

const NOW = 540; // 09:00

const makeRoom = (over: Record<string, unknown> = {}) => ({
  id: 'test-room',
  name: 'Test Room',
  building: 'A',
  capacity: 10,
  blocked: false,
  bookings: [{ id: 'b1', label: 'Sample', start: 600, end: 660 }],
  ...over,
});

const status = (start: number, end: number, over = {}) =>
  checkAvailability(makeRoom(over) as any, start, end, NOW).status;

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

test('AC5: bookings are not changed', () => {
  const room = makeRoom();
  const before = JSON.stringify(room.bookings);
  checkAvailability(room as any, 660, 720, NOW);
  checkAvailability(room as any, 630, 690, NOW);
  expect(JSON.stringify(room.bookings)).toBe(before);
});

// Мои случаи (обоснуйте их сами в отчёте)
test('Own 1 AC1: request in the past (500-560) is unavailable', () =>
  expect(status(500, 560)).toBe('unavailable'));
test('Own 2 AC1/AC4: one minute after now, touching booking start (541-600)', () =>
  expect(status(541, 600)).toBe('available'));