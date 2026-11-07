import type { Category, Shot, StoreTwin } from "./twin";
import { CATEGORIES } from "./twin";
import type { MinuteClock } from "./clock";

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function apportion(weights: number[], total: number) {
  if (total <= 0) return weights.map(() => 0);
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  if (sum <= 0) return weights.map((_, index) => (index === 0 ? total : 0));
  const raw = weights.map((weight) => (total * weight) / sum);
  const base = raw.map((value) => Math.floor(value));
  let left = total - base.reduce((acc, value) => acc + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - base[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  while (left > 0) {
    for (const item of order) {
      if (left === 0) break;
      base[item.index] += 1;
      left -= 1;
    }
  }
  return base;
}

export function projectShot(shot: Shot, seed: string): Shot {
  const rand = mulberry32(hash(seed));
  const visitors = Math.max(1, Math.round(shot.visitors * (0.9 + rand() * 0.2)));
  const rate = shot.visitors === 0 ? 0.2 : shot.buyers / shot.visitors;
  const shifted = Math.min(0.92, Math.max(0.04, rate + (rand() - 0.5) * 0.06));
  const buyers = Math.min(visitors, Math.max(1, Math.round(visitors * shifted)));
  const sales = Math.max(buyers, Math.round(shot.sales * (buyers / Math.max(1, shot.buyers)) * (0.94 + rand() * 0.12)));
  const amounts = apportion(
    CATEGORIES.map((category) => shot.byCategory[category]),
    sales,
  );
  const byCategory = Object.fromEntries(CATEGORIES.map((category, index) => [category, amounts[index]])) as Record<Category, number>;
  const churn = Math.round(Math.min(0.4, Math.max(0.02, shot.churn * (0.9 + rand() * 0.2))) * 1000) / 1000;
  return { visitors, buyers, sales, churn, byCategory };
}

export function projectNetwork(list: StoreTwin[], clock: Pick<MinuteClock, "key" | "thenKey">) {
  return list.map((store) => ({
    ...store,
    now: projectShot(store.now, `${store.id}:now:${clock.key}`),
    then: projectShot(store.then, `${store.id}:then:${clock.thenKey}`),
  }));
}
