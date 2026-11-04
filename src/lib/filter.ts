import type { Room, FilterCriteria } from './types';

export const ALL_EQUIPMENT_OPTIONS = [
  'Projector',
  'Whiteboard',
  'Video Conference',
  'Audio System',
  'Workstations',
  'Monitor',
] as const;

/**
 * Filter rooms according to user-selected criteria.
 * - F1: room.capacity >= criteria.minCapacity (if minCapacity > 0)
 * - F2: room must contain ALL selected required equipment items
 * - F4: returns an empty array if no rooms match, enabling clear empty state
 */
export function filterRooms(rooms: Room[], criteria: FilterCriteria): Room[] {
  return rooms.filter((room) => {
    // F1: Capacity filter
    if (criteria.minCapacity > 0 && room.capacity < criteria.minCapacity) {
      return false;
    }

    // F2: Equipment filter - room must include all required items
    if (criteria.requiredEquipment.length > 0) {
      const hasAllEquipment = criteria.requiredEquipment.every((req) =>
        room.equipment.includes(req)
      );
      if (!hasAllEquipment) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Extract all unique equipment available across a collection of rooms.
 */
export function extractAvailableEquipment(rooms: Room[]): string[] {
  const set = new Set<string>();
  for (const r of rooms) {
    for (const eq of r.equipment) {
      set.add(eq);
    }
  }
  return Array.from(set).sort();
}
