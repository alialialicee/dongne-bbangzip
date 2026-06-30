import {
  absoluteTaboos,
  avoidActions,
  avoidColors,
  avoidObjects,
  avoidPeople,
  avoidPlaces,
  avoidTimes,
  dailyWarningTemplates,
  finalWarnings,
  weeklySummaries,
} from '../data/fortunes';
import type { DailyTaboo, FortuneResult, UserInput } from '../types';

const dayLabels = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const tabooNumbers = ['금기 一', '금기 二', '금기 三', '금기 四', '금기 五', '금기 六', '금기 七'];

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function seededPick<T>(items: readonly T[], seed: number): T {
  return items[Math.floor(seededRandom(seed) * items.length) % items.length];
}

function pickVaried<T>(items: readonly T[], seed: number, used: Set<T>, preferredUniqueCount: number): T {
  const offset = Math.floor(seededRandom(seed) * items.length);
  for (let attempt = 0; attempt < items.length; attempt += 1) {
    const candidate = items[(offset + attempt) % items.length];
    if (used.size < preferredUniqueCount && used.has(candidate)) continue;
    used.add(candidate);
    return candidate;
  }
  const fallback = items[offset % items.length];
  used.add(fallback);
  return fallback;
}

function formatTemplate(template: string, taboo: Omit<DailyTaboo, 'dayLabel' | 'tabooNumber' | 'message'>): string {
  return template
    .replaceAll('{time}', taboo.time)
    .replaceAll('{place}', taboo.place)
    .replaceAll('{person}', taboo.person)
    .replaceAll('{object}', taboo.object)
    .replaceAll('{action}', taboo.action);
}

export function generateFortune(input: UserInput, today = new Date()): FortuneResult {
  const weekKey = today.toISOString().slice(0, 10);
  const baseSeed = hashString(`${input.name}|${input.birthDate}|${input.birthTime}|${input.gender}|${weekKey}`);
  const commonSeed = baseSeed + 1009;

  const usedTimes = new Set<string>();
  const usedPlaces = new Set<string>();
  const usedCombinations = new Set<string>();
  const usedTemplates = new Set<string>();

  const dailyTaboos = dayLabels.map((dayLabel, dayIndex) => {
    let dailySeed = baseSeed + dayIndex * 97;
    let taboo: Omit<DailyTaboo, 'dayLabel' | 'tabooNumber' | 'message'>;
    let template: string;
    let combination: string;

    do {
      taboo = {
        time: pickVaried(avoidTimes, dailySeed + 11, usedTimes, 5),
        place: pickVaried(avoidPlaces, dailySeed + 23, usedPlaces, 5),
        person: seededPick(avoidPeople, dailySeed + 37),
        object: seededPick(avoidObjects, dailySeed + 41),
        action: seededPick(avoidActions, dailySeed + 53),
      };
      template = pickVaried(dailyWarningTemplates, dailySeed + 67, usedTemplates, 7);
      combination = `${taboo.person}|${taboo.object}|${taboo.action}`;
      dailySeed += 131;
    } while (usedCombinations.has(combination));

    usedCombinations.add(combination);

    return {
      dayLabel,
      tabooNumber: tabooNumbers[dayIndex],
      ...taboo,
      message: formatTemplate(template, taboo),
    };
  });

  return {
    title: `${input.name.trim()}님의 이름으로 열린 칠일금기`,
    summary: seededPick(weeklySummaries, commonSeed + 3),
    avoidColor: seededPick(avoidColors, commonSeed + 5),
    avoidPlace: seededPick(avoidPlaces, commonSeed + 7),
    avoidTime: seededPick(avoidTimes, commonSeed + 13),
    dailyTaboos,
    absoluteTaboo: seededPick(absoluteTaboos, commonSeed + 17),
    finalWarning: seededPick(finalWarnings, commonSeed + 19),
  };
}
