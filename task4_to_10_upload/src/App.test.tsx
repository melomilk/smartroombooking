import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '@/App';
import { currentTime } from '@/data/rooms';
import { formatTime } from '@/lib/availability';

describe('App header clock label (A5-R1 regression)', () => {
  const html = renderToStaticMarkup(<App />);

  it('does not claim the hours are live', () => {
    expect(html).not.toContain('Live campus hours');
  });

  it('states the fixed demo time taken from currentTime', () => {
    expect(html).toContain(`Demo time ${formatTime(currentTime)}`);
  });
});
