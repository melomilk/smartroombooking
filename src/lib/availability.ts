import type { Booking, Decision, Room } from '@/data/rooms';

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${suffix}`;
};

export const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Pure availability check. Returns a Decision describing whether the room can
 * be booked for the given minute range. Does not mutate the room or its bookings.
 */
export const checkAvailability = (
  room: Room,
  start: number,
  end: number,
  now: number,
): Decision => {
  const duration = end - start;
  const details: string[] = [];

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > 1440 || start >= end) {
    return {
      available: false,
      title: 'Check the time range',
      message: 'Choose a start and end time where the start comes before the end.',
      details: ['Time must stay within a single day.'],
    };
  }

  if (start <= now) {
    details.push(`Start after the current time of ${formatTime(now)}.`);
  }

  if (duration > 120) {
    details.push('Keep the request to 120 minutes or less.');
  }

  if (room.blocked) {
    details.push('This room is blocked for maintenance today.');
  }

  const conflictingBooking = room.bookings.find(
    (booking: Booking) => start < booking.end && end > booking.start,
  );
  if (conflictingBooking) {
    details.push(
      `Overlaps ${conflictingBooking.label.toLowerCase()} from ${formatTime(conflictingBooking.start)} to ${formatTime(conflictingBooking.end)}.`,
    );
  }

  if (details.length > 0) {
    return {
      available: false,
      title: 'Not available this time',
      message: 'Try another time or choose a different room.',
      details,
    };
  }

  return {
    available: true,
    title: 'Room is available',
    message: `${room.name} is open for your requested time.`,
    details: [`${formatTime(start)} – ${formatTime(end)}`, `${duration} minute session`],
  };
};
