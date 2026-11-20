export type Booking = {
  start: number;
  end: number;
  label: string;
};

export type Room = {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  color: string;
  blocked: boolean;
  bookings: Booking[];
};

export type Decision = {
  available: boolean;
  title: string;
  message: string;
  details: string[];
};

export const currentTime = 10 * 60 + 30;

export const rooms: Room[] = [
  {
    id: 'north-204',
    name: 'North Hall 204',
    building: 'North Hall',
    floor: '2nd floor',
    capacity: 8,
    color: 'coral',
    blocked: false,
    bookings: [
      { start: 12 * 60, end: 13 * 60, label: 'Study group' },
      { start: 15 * 60 + 30, end: 16 * 60 + 30, label: 'Peer tutoring' },
    ],
  },
  {
    id: 'library-118',
    name: 'Library 118',
    building: 'Main Library',
    floor: '1st floor',
    capacity: 12,
    color: 'blue',
    blocked: false,
    bookings: [
      { start: 11 * 60 + 30, end: 12 * 60 + 30, label: 'Workshop' },
      { start: 14 * 60, end: 15 * 60 + 30, label: 'Project meeting' },
    ],
  },
  {
    id: 'arts-301',
    name: 'Arts Center 301',
    building: 'Arts Center',
    floor: '3rd floor',
    capacity: 6,
    color: 'green',
    blocked: true,
    bookings: [],
  },
];

export const sampleSlots = [
  { label: 'Try 11:00 – 11:45', start: '11:00', end: '11:45' },
  { label: 'Try 13:00 – 14:30', start: '13:00', end: '14:30' },
];
