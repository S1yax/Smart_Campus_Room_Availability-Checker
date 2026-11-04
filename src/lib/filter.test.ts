import { describe, it, expect } from 'vitest';
import { filterRooms } from '@/lib/filter';
import { checkAvailability } from '@/lib/availability';
import type { Room } from '@/lib/types';

describe('Room Filtering Rules (F1 - F5)', () => {
  const sampleRooms: Room[] = [
    {
      id: 'room-small',
      name: 'Small Focus Room',
      building: 'Building A',
      capacity: 4,
      equipment: ['Whiteboard'],
      blocked: false,
      bookings: [{ id: 'b1', label: '1:1 Sync', start: 600, end: 660 }],
    },
    {
      id: 'room-medium',
      name: 'Medium Meeting Room',
      building: 'Building B',
      capacity: 10,
      equipment: ['Projector', 'Whiteboard'],
      blocked: false,
      bookings: [],
    },
    {
      id: 'room-large',
      name: 'Large Conference Hall',
      building: 'Building C',
      capacity: 50,
      equipment: ['Projector', 'Whiteboard', 'Video Conference', 'Audio System'],
      blocked: false,
      bookings: [{ id: 'b2', label: 'All Hands', start: 720, end: 840 }],
    },
    {
      id: 'room-blocked',
      name: 'Hardware Lab',
      building: 'Building D',
      capacity: 25,
      equipment: ['Workstations', 'Projector'],
      blocked: true,
      bookings: [],
    },
  ];

  // F1. Capacity filter tests
  describe('F1: Capacity Filter', () => {
    it('exact capacity boundary: requested 10 matches room of capacity 10 and 50, but excludes capacity 4', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 10,
        requiredEquipment: [],
      });
      const ids = result.map((r) => r.id);
      expect(ids).toContain('room-medium');
      expect(ids).toContain('room-large');
      expect(ids).toContain('room-blocked');
      expect(ids).not.toContain('room-small');
    });

    it('insufficient capacity boundary: requested 11 excludes room of capacity 10', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 11,
        requiredEquipment: [],
      });
      const ids = result.map((r) => r.id);
      expect(ids).not.toContain('room-medium');
      expect(ids).toContain('room-large');
      expect(ids).toContain('room-blocked');
    });

    it('zero minCapacity includes all rooms regardless of capacity', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 0,
        requiredEquipment: [],
      });
      expect(result.length).toBe(sampleRooms.length);
    });
  });

  // F2. Equipment filter tests
  describe('F2: Equipment Filter', () => {
    it('single required item matches all rooms that have it', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 0,
        requiredEquipment: ['Projector'],
      });
      const ids = result.map((r) => r.id);
      expect(ids).toEqual(['room-medium', 'room-large', 'room-blocked']);
    });

    it('multiple required items: room must contain ALL selected items', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 0,
        requiredEquipment: ['Projector', 'Video Conference'],
      });
      const ids = result.map((r) => r.id);
      // Only room-large has both
      expect(ids).toEqual(['room-large']);
    });

    it('missing even one required item excludes the room', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 0,
        requiredEquipment: ['Projector', 'Audio System'],
      });
      const ids = result.map((r) => r.id);
      expect(ids).not.toContain('room-medium');
      expect(ids).not.toContain('room-blocked');
      expect(ids).toContain('room-large');
    });
  });

  // F3. Blocked status rule
  describe('F3: Blocked Room Availability', () => {
    it('a blocked room cannot be reported as available regardless of interval', () => {
      const blockedRoom = sampleRooms.find((r) => r.blocked)!;
      expect(blockedRoom).toBeDefined();

      const result = checkAvailability(blockedRoom, 600, 660, 540);
      expect(result.status).toBe('unavailable');
      expect(result.reasons).toContain(
        'This room is currently blocked and cannot be booked.'
      );
    });
  });

  // F4. Empty state rule
  describe('F4: Empty State on No Matches', () => {
    it('returns empty array when requested capacity exceeds all rooms', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 100,
        requiredEquipment: [],
      });
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('returns empty array when equipment requirements cannot be satisfied by any room', () => {
      const result = filterRooms(sampleRooms, {
        minCapacity: 0,
        requiredEquipment: ['Whiteboard', 'Workstations'], // No room has both
      });
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  // F5. Room switching & isolated bookings
  describe('F5: Room Selection Uses Chosen Room Bookings', () => {
    it('availability check uses chosen room bookings and does not leak bookings between rooms', () => {
      const smallRoom = sampleRooms.find((r) => r.id === 'room-small')!; // has booking 600-660
      const mediumRoom = sampleRooms.find((r) => r.id === 'room-medium')!; // has NO bookings

      // Interval 600-660
      const checkSmall = checkAvailability(smallRoom, 600, 660, 540);
      const checkMedium = checkAvailability(mediumRoom, 600, 660, 540);

      expect(checkSmall.status).toBe('unavailable');
      expect(checkSmall.reasons[0]).toMatch(/Overlaps an existing booking/);

      expect(checkMedium.status).toBe('available');
      expect(checkMedium.reasons.length).toBe(0);
    });
  });
});
