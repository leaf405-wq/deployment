export type LevelConfig = {
  level: number;
  size: number;
  label: string;
  blurb: string;
  speed: number;
  npcCount: number;
  npcAutoGrowEvery: number;
  foodCount: number;
  targetScore: number;
};

/** 10 levels: 20×20 … 100×100（第 10 关同为 100×100 极限强度） */
const SIZES = [20, 30, 40, 50, 60, 70, 80, 90, 100, 100] as const;

export const LEVELS: LevelConfig[] = SIZES.map((size, i) => {
  const level = i + 1;
  const speed = 7 + i * 0.55 + (level === 10 ? 0.8 : 0);
  const npcCount = Math.min(1 + Math.floor(i / 2) + (level === 10 ? 1 : 0), 5);
  return {
    level,
    size,
    label: `${size}×${size}`,
    blurb:
      level === 10
        ? "极限 100×100 · 最多 NPC · 最快节奏"
        : level <= 3
          ? "开阔场地 · 熟悉节奏"
          : level <= 6
            ? "NPC 更积极 · 注意包抄"
            : "大地图混战 · 生存为王",
    speed,
    npcCount,
    npcAutoGrowEvery: Math.max(1.35, 4.2 - i * 0.28),
    foodCount: 2 + Math.floor(i / 2),
    targetScore: 8 + i * 4 + (level === 10 ? 6 : 0),
  };
});

export function getLevel(n: number): LevelConfig {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, n - 1))];
}
