import type { Room } from './types';

export const ROOMS: Room[] = [
  {
    id: 'lib-101',
    name: 'Study Room A',
    building: 'Library',
    capacity: 8,
    equipment: ['Whiteboard', 'Monitor'],
    blocked: false,
    bookings: [
      { id: 'b1', label: 'Group Study', start: 600, end: 660 },
      { id: 'b2', label: 'Seminar', start: 840, end: 930 },
    ],
  },
  {
    id: 'lib-102',
    name: 'Study Room B',
    building: 'Library',
    capacity: 6,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b3', label: 'Office Hours', start: 720, end: 780 },
    ],
  },
  {
    id: 'eng-205',
    name: 'Engineering Lab',
    building: 'Eng Hall',
    capacity: 30,
    equipment: ['Projector', 'Workstations', 'Whiteboard'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'sc-301',
    name: 'Science Seminar Room',
    building: 'Science Center',
    capacity: 20,
    equipment: ['Projector', 'Video Conference', 'Audio System'],
    blocked: false,
    bookings: [
      { id: 'b4', label: 'Lecture', start: 540, end: 600 },
      { id: 'b5', label: 'Workshop', start: 900, end: 1020 },
    ],
  },
  {
    id: 'tech-104',
    name: 'Executive Boardroom',
    building: 'Tech Center',
    capacity: 12,
    equipment: ['Projector', 'Video Conference', 'Whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b6', label: 'Project Review', start: 660, end: 720 },
    ],
  },
];
