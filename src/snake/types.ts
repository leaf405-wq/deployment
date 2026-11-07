export type Dir = "up" | "down" | "left" | "right";

export type Point = { x: number; y: number };

export type Snake = {
  id: string;
  body: Point[];
  dir: Dir;
  pending: Dir | null;
  grow: number;
  alive: boolean;
  isPlayer: boolean;
  hue: number;
  autoGrowAcc: number;
};

export type Food = Point & { pulse: number };

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

export type GamePhase = "menu" | "playing" | "paused" | "gameover" | "win";

export const DIRS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function key(p: Point): string {
  return `${p.x},${p.y}`;
}

export function same(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}
