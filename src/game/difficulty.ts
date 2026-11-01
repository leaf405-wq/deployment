export type Difficulty = "easy" | "medium" | "hard";

export type DifficultyPreset = {
  id: Difficulty;
  label: string;
  blurb: string;
  halfWidth: [number, number];
  pointCount: [number, number];
  baseRadius: [number, number];
  /** Extra radial variation away from start. */
  radiusJitter: [number, number];
  bulge: number;
  /** Second-harmonic chicane amplitude. */
  chicaneAmp: number;
  /** Third-harmonic kink amplitude (harder maps). */
  kinkAmp: number;
  smoothPasses: number;
  stretchX: [number, number];
  stretchY: [number, number];
};

export const DIFFICULTIES: Record<Difficulty, DifficultyPreset> = {
  easy: {
    id: "easy",
    label: "简单",
    blurb: "宽阔流畅 · 适合熟悉手感",
    halfWidth: [68, 78],
    pointCount: [10, 13],
    baseRadius: [500, 620],
    radiusJitter: [0.88, 1.06],
    bulge: 36,
    chicaneAmp: 18,
    kinkAmp: 0,
    smoothPasses: 3,
    stretchX: [1.15, 1.25],
    stretchY: [0.9, 1.0],
  },
  medium: {
    id: "medium",
    label: "普通",
    blurb: "弯道更多 · 有轻微连续弯",
    halfWidth: [54, 64],
    pointCount: [14, 18],
    baseRadius: [560, 720],
    radiusJitter: [0.72, 1.12],
    bulge: 78,
    chicaneAmp: 70,
    kinkAmp: 28,
    smoothPasses: 2,
    stretchX: [1.18, 1.35],
    stretchY: [0.82, 0.98],
  },
  hard: {
    id: "hard",
    label: "困难",
    blurb: "窄道发夹弯 · 复杂连续组合",
    halfWidth: [44, 54],
    pointCount: [17, 23],
    baseRadius: [600, 820],
    radiusJitter: [0.62, 1.18],
    bulge: 105,
    chicaneAmp: 95,
    kinkAmp: 55,
    smoothPasses: 1,
    stretchX: [1.2, 1.4],
    stretchY: [0.78, 0.96],
  },
};

export function parseDifficulty(value: string | null | undefined): Difficulty {
  if (value === "easy" || value === "medium" || value === "hard") return value;
  return "medium";
}
