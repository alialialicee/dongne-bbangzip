export type Gender = 'male' | 'female' | 'other';

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: Gender;
}

export interface DailyTaboo {
  dayLabel: string;
  tabooNumber: string;
  time: string;
  place: string;
  person: string;
  object: string;
  action: string;
  message: string;
}

export interface FortuneResult {
  title: string;
  summary: string;
  avoidColor: string;
  avoidPlace: string;
  avoidTime: string;
  dailyTaboos: DailyTaboo[];
  absoluteTaboo: string;
  finalWarning: string;
}
