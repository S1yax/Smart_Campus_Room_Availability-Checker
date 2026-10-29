import type { Room } from './types';

export const ROOMS: Room[] = [
  {
    id: 'lib-101',
    name: 'Study Room A',
    building: 'Library',
    capacity: 8,
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
    blocked: true,
    bookings: [],
  },
  {
    id: 'sc-301',
    name: 'Science Seminar Room',
    building: 'Science Center',
    capacity: 20,
    blocked: false,
    bookings: [
      { id: 'b4', label: 'Lecture', start: 540, end: 600 },
      { id: 'b5', label: 'Workshop', start: 900, end: 1020 },
    ],
  },
];
