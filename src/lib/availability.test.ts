import { describe, it, expect } from 'vitest';
import { checkAvailability, toMinutes } from '@/lib/availability';
import { rooms, currentTime } from '@/data/rooms';
import type { Room } from '@/data/rooms';

const northRoom = rooms.find((r) => r.id === 'north-204') as Room;
const artsRoom = rooms.find((r) => r.id === 'arts-301') as Room;

describe('checkAvailability', () => {
  it('rejects a past-time request (AC1)', () => {
    const result = checkAvailability(northRoom, 9 * 60, 10 * 60, currentTime);
    expect(result.available).toBe(false);
    expect(result.details).toContain(
      `Start after the current time of 10:30 AM.`,
    );
  });

  it('rejects a reversed interval where start > end (AC1)', () => {
    const result = checkAvailability(northRoom, 14 * 60, 13 * 60, currentTime);
    expect(result.available).toBe(false);
    expect(result.title).toBe('Check the time range');
  });

  it('rejects when start equals end (AC1)', () => {
    const result = checkAvailability(northRoom, 12 * 60, 12 * 60, currentTime);
    expect(result.available).toBe(false);
    expect(result.title).toBe('Check the time range');
  });

  it('rejects malformed time values at the input boundary', () => {
    const result = checkAvailability(northRoom, toMinutes('not-a-time'), 13 * 60, currentTime);
    expect(result.available).toBe(false);
    expect(result.title).toBe('Check the time range');
  });

  it('allows exactly 120 minutes (AC2 boundary)', () => {
    const result = checkAvailability(northRoom, 13 * 60, 15 * 60, currentTime);
    expect(result.available).toBe(true);
  });

  it('rejects 121 minutes (AC2)', () => {
    const result = checkAvailability(northRoom, 13 * 60, 15 * 60 + 1, currentTime);
    expect(result.available).toBe(false);
    expect(result.details).toContain('Keep the request to 120 minutes or less.');
  });

  it('rejects a blocked room (AC3)', () => {
    const result = checkAvailability(artsRoom, 13 * 60, 14 * 60, currentTime);
    expect(result.available).toBe(false);
    expect(result.details).toContain('This room is blocked for maintenance today.');
  });

  it('rejects an overlap with an existing booking (AC4)', () => {
    // North Hall 204 has a booking 12:00–13:00 ("Study group").
    // 12:30–13:30 overlaps it.
    const result = checkAvailability(northRoom, 12 * 60 + 30, 13 * 60 + 30, currentTime);
    expect(result.available).toBe(false);
    expect(result.details.some((d) => d.startsWith('Overlaps study group'))).toBe(true);
  });

  it('allows a request that touches a booking start exactly (AC4)', () => {
    // 11:00–12:00 touches the 12:00 start of the Study group booking.
    const result = checkAvailability(northRoom, 11 * 60, 12 * 60, currentTime);
    expect(result.available).toBe(true);
  });

  it('allows a request that touches a booking end exactly (AC4)', () => {
    // 13:00–14:00 touches the 13:00 end of the Study group booking.
    const result = checkAvailability(northRoom, 13 * 60, 14 * 60, currentTime);
    expect(result.available).toBe(true);
  });

  it('returns available for a valid request with no conflicts', () => {
    const result = checkAvailability(northRoom, 16 * 60 + 30, 17 * 60, currentTime);
    expect(result.available).toBe(true);
    expect(result.title).toBe('Room is available');
    expect(result.details).toContain('4:30 PM – 5:00 PM');
    expect(result.details).toContain('30 minute session');
  });

  it('R-01 regression: decision changes when now crosses a later request window (AC1)', () => {
    // At the fixed clock (10:30) a 11:00-11:45 request is future and valid.
    const beforeNow = checkAvailability(northRoom, 11 * 60, 11 * 60 + 45, 10 * 60 + 30);
    expect(beforeNow.available).toBe(true);

    // The same request, evaluated with a later current time (12:00), must
    // now be rejected as past (this is what a live clock would produce,
    // and what the frozen `currentTime` constant in App.tsx never does).
    const afterNow = checkAvailability(northRoom, 11 * 60, 11 * 60 + 45, 12 * 60);
    expect(afterNow.available).toBe(false);
    expect(afterNow.details).toContain('Start after the current time of 12:00 PM.');
  });

  it('does not mutate room or booking fixtures (AC5)', () => {
    const deepCopy: Room = JSON.parse(JSON.stringify(northRoom));
    checkAvailability(northRoom, 12 * 60 + 30, 13 * 60 + 30, currentTime);
    checkAvailability(northRoom, 9 * 60, 10 * 60, currentTime);
    checkAvailability(northRoom, 13 * 60, 15 * 60 + 1, currentTime);
    expect(northRoom).toEqual(deepCopy);
    expect(rooms).toEqual(JSON.parse(JSON.stringify(rooms)));
  });
});
