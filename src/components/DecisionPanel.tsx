import { Check, Clock3, X } from 'lucide-react';
import type { Decision } from '@/data/rooms';

const stepLabels = {
  available: 'Good to go',
  unavailable: 'A small change is needed',
} as const;

type DecisionPanelProps = {
  decision: Decision | null;
};

export function DecisionPanel({ decision }: DecisionPanelProps) {
  if (decision === null) {
    return (
      <div className="decision-card empty" aria-live="polite">
        <div className="decision-symbol waiting"><Clock3 size={23} /></div>
        <span className="step-label">Your answer will appear here</span>
        <h2>Ready when<br />you are.</h2>
        <p>Set your room and time, then check to see a clear availability result.</p>
      </div>
    );
  }

  const state = decision.available ? 'available' : 'unavailable';

  return (
    <div className={`decision-card ${state}`} aria-live="polite">
      <div className="decision-symbol">{state === 'available' ? <Check size={25} /> : <X size={25} />}</div>
      <span className="step-label">{stepLabels[state]}</span>
      <h2>{decision.title}</h2>
      <p>{decision.message}</p>
      <div className="decision-details">
        {decision.details.map((detail) => <div key={detail}><span />{detail}</div>)}
      </div>
      {state === 'available' && (
        <p className="read-only-note">Availability is shown for reference only. This checker does not create reservations.</p>
      )}
    </div>
  );
}
