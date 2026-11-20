import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  DoorOpen,
  Info,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { currentTime, rooms, sampleSlots } from '@/data/rooms';
import type { Decision } from '@/data/rooms';
import { checkAvailability, formatTime, toMinutes } from '@/lib/availability';
import { DecisionPanel } from '@/components/DecisionPanel';

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('11:45');
  const [decision, setDecision] = useState<Decision | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? rooms[0],
    [selectedRoomId],
  );

  const checkAvailabilityHandler = () => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const result = checkAvailability(selectedRoom, start, end, currentTime);
    setDecision(result);
  };

  const updateRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setDecision(null);
  };

  const selectSample = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    setDecision(null);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><DoorOpen size={19} strokeWidth={2.5} /></div>
        <span className="brand-name">Campus<span>space</span></span>
        <div className="topbar-divider" />
        <span className="product-label">Room availability</span>
        <div className="topbar-status"><span className="status-dot" /> Live campus hours</div>
      </header>

      <section className="intro-section">
        <div className="eyebrow"><Sparkles size={15} /> Find your focus space</div>
        <h1>Check a room<br /><em>before you go.</em></h1>
        <p className="intro-copy">Pick a campus room and time to see if it is ready for your next study session.</p>
      </section>

      <section className="checker-layout" aria-label="Room availability checker">
        <div className="checker-card">
          <div className="card-heading">
            <div>
              <span className="step-label">01 / Choose a room</span>
              <h2>Where would you like to work?</h2>
            </div>
            <div className={`room-icon ${selectedRoom.color}`}><DoorOpen size={21} /></div>
          </div>

          <label className="field-label" htmlFor="room-select">Available spaces</label>
          <div className="select-wrap">
            <select id="room-select" value={selectedRoomId} onChange={(event) => updateRoom(event.target.value)}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}{room.blocked ? ' · blocked today' : ''}</option>
              ))}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </div>

          <div className="room-meta">
            <span><MapPin size={14} /> {selectedRoom.building} · {selectedRoom.floor}</span>
            <span><Users size={14} /> Up to {selectedRoom.capacity}</span>
          </div>

          <div className="field-separator" />

          <div className="card-heading time-heading">
            <div>
              <span className="step-label">02 / Choose a time</span>
              <h2>When do you need it?</h2>
            </div>
            <Clock3 size={20} className="heading-icon" />
          </div>

          <div className="time-fields">
            <div>
              <label className="field-label" htmlFor="start-time">Start time</label>
              <input id="start-time" type="time" value={startTime} onChange={(event) => { setStartTime(event.target.value); setDecision(null) }} />
            </div>
            <div className="time-arrow"><ArrowRight size={17} /></div>
            <div>
              <label className="field-label" htmlFor="end-time">End time</label>
              <input id="end-time" type="time" value={endTime} onChange={(event) => { setEndTime(event.target.value); setDecision(null) }} />
            </div>
          </div>

          <div className="time-hint"><Info size={14} /> Current campus time is {formatTime(currentTime)} · Up to 120 minutes</div>

          <button className="check-button" type="button" onClick={checkAvailabilityHandler}>
            Check availability <ArrowRight size={18} />
          </button>

          <div className="sample-row">
            <span>Quick try</span>
            {sampleSlots.map((slot) => (
              <button key={slot.label} type="button" onClick={() => selectSample(slot.start, slot.end)}>{slot.label}</button>
            ))}
          </div>
        </div>

        <aside className="side-column">
          <DecisionPanel decision={decision} />

          <div className="today-card">
            <div className="today-header"><span>Today in {selectedRoom.name}</span><CalendarDays size={16} /></div>
            <div className="booking-list">
              {selectedRoom.blocked ? (
                <div className="blocked-note"><span className="booking-line blocked-line" />Room blocked all day</div>
              ) : selectedRoom.bookings.length === 0 ? (
                <div className="blocked-note"><span className="booking-line" />No bookings scheduled</div>
              ) : selectedRoom.bookings.map((booking) => (
                <div className="booking-item" key={`${booking.start}-${booking.end}`}>
                  <span className="booking-line" />
                  <div><strong>{formatTime(booking.start)} – {formatTime(booking.end)}</strong><span>{booking.label}</span></div>
                </div>
              ))}
            </div>
            <p className="read-only-note">Existing bookings are shown for reference only.</p>
          </div>
        </aside>
      </section>

      <footer className="page-footer"><span className="footer-mark">C</span><span>Campuspace</span><span className="footer-note">A simple way to find your focus.</span></footer>
    </main>
  );
}

export default App;
