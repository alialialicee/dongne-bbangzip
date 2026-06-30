import { useEffect, useMemo } from 'react';
import { jumpScareMessages } from '../data/fortunes';
import { seededPick } from '../utils/generateFortune';

interface JumpScareProps { seed: string; onComplete: () => void; }

export function JumpScare({ seed, onComplete }: JumpScareProps) {
  const message = useMemo(() => seededPick(jumpScareMessages, seed.length * 77 + seed.charCodeAt(0)), [seed]);
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1000);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen jump-screen" aria-live="assertive">
      <div className="close-mask" aria-hidden="true"><span className="eye left-eye" /><span className="eye right-eye" /></div>
      <p className="jump-message glitch-text">{message}</p>
    </section>
  );
}
