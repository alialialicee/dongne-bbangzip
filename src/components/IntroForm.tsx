import { FormEvent, useState } from 'react';
import type { Gender, UserInput } from '../types';

interface IntroFormProps {
  onSubmit: (input: UserInput) => void;
}

const warnings = {
  name: '이름 없는 자의 운명은 읽을 수 없습니다.',
  birthDate: '태어난 날이 비어 있습니다.',
  birthTime: '시간을 숨기면 기록은 열리지 않습니다.',
};

export function IntroForm({ onSubmit }: IntroFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState<Gender>('other');
  const [warning, setWarning] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return setWarning(warnings.name);
    if (!birthDate) return setWarning(warnings.birthDate);
    if (!birthTime) return setWarning(warnings.birthTime);
    setWarning('');
    onSubmit({ name: name.trim(), birthDate, birthTime, gender });
  }

  return (
    <section className="screen intro-screen" aria-labelledby="app-title">
      <div className="ritual-ring" aria-hidden="true" />
      <div className="paper-panel intro-panel">
        <span className="seal-mark">封</span>
        <p className="eyebrow">저주받은 기록 · 일곱 밤의 문서</p>
        <h1 id="app-title" className="glitch-title">칠일금기</h1>
        <p className="subtitle">당신의 이름으로 열린 일곱 개의 금기</p>

        <form className="taboo-form" onSubmit={handleSubmit} noValidate>
          <label>
            이름
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름을 적으십시오" autoComplete="name" />
          </label>
          <label>
            생년월일
            <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </label>
          <label>
            태어난 시간
            <input type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} />
          </label>
          <fieldset>
            <legend>성별</legend>
            {([
              ['male', '남성'],
              ['female', '여성'],
              ['other', '기타 / 선택 안 함'],
            ] as const).map(([value, label]) => (
              <label className="radio-card" key={value}>
                <input type="radio" name="gender" value={value} checked={gender === value} onChange={() => setGender(value)} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          {warning && <p className="form-warning" role="alert">{warning}</p>}
          <button className="primary-button" type="submit">기록을 연다</button>
        </form>
      </div>
      <div className="candle left" aria-hidden="true"><span /></div>
      <div className="candle right" aria-hidden="true"><span /></div>
    </section>
  );
}
