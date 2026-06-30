import { useMemo, useState } from 'react';
import { IntroForm } from './components/IntroForm';
import { JumpScare } from './components/JumpScare';
import { LoadingRitual } from './components/LoadingRitual';
import { ResultScreen } from './components/ResultScreen';
import { generateFortune } from './utils/generateFortune';
import type { UserInput } from './types';

type Screen = 'intro' | 'loading' | 'jump' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [input, setInput] = useState<UserInput | null>(null);

  const result = useMemo(() => (input ? generateFortune(input) : null), [input]);

  function startRitual(nextInput: UserInput) {
    setInput(nextInput);
    setScreen('loading');
  }

  function reset() {
    setInput(null);
    setScreen('intro');
  }

  return (
    <main className="app-shell">
      <div className="texture-layer" aria-hidden="true" />
      {screen === 'intro' && <IntroForm onSubmit={startRitual} />}
      {screen === 'loading' && <LoadingRitual onComplete={() => setScreen('jump')} />}
      {screen === 'jump' && <JumpScare seed={input?.name ?? '칠일금기'} onComplete={() => setScreen('result')} />}
      {screen === 'result' && result && <ResultScreen result={result} onReset={reset} />}
    </main>
  );
}

export default App;
