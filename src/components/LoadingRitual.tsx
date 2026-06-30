import { useEffect, useMemo, useState } from 'react';
import { loadingMessages } from '../data/fortunes';

interface LoadingRitualProps { onComplete: () => void; }

export function LoadingRitual({ onComplete }: LoadingRitualProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const duration = useMemo(() => 4000 + Math.floor(Math.random() * 2000), []);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1 + Math.floor(Math.random() * 3)) % loadingMessages.length);
    }, 850);
    const endTimer = window.setTimeout(onComplete, duration);
    return () => { window.clearInterval(messageTimer); window.clearTimeout(endTimer); };
  }, [duration, onComplete]);

  return (
    <section className="screen loading-screen" aria-live="polite" aria-label="금기 기록을 여는 중">
      <div className="ritual-circle" aria-hidden="true"><i /><i /><i /></div>
      <div className="shaman" aria-hidden="true"><span className="mask" /></div>
      <div className="floating-talisman t1" aria-hidden="true">禁</div>
      <div className="floating-talisman t2" aria-hidden="true">符</div>
      <div className="floating-talisman t3" aria-hidden="true">門</div>
      <div className="smoke smoke-one" aria-hidden="true" />
      <div className="smoke smoke-two" aria-hidden="true" />
      <div className="candle center-candle" aria-hidden="true"><span /></div>
      <p className="loading-kicker">의식 진행 중</p>
      <h2>당신의 일주일을 들여다보는 중…</h2>
      <p className="loading-message">{loadingMessages[messageIndex]}</p>
    </section>
  );
}
