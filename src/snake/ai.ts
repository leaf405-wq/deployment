import {
  DIRS,
  OPPOSITE,
  type Dir,
  type Food,
  type Point,
  type Snake,
  key,
  same,
} from "./types";

const ORDER: Dir[] = ["up", "right", "down", "left"];

export function occupiedSet(snakes: Snake[], ignoreTailOf?: Snake): Set<string> {
  const set = new Set<string>();
  for (const s of snakes) {
    if (!s.alive) continue;
    const body = s.body;
    const limit =
      ignoreTailOf && s.id === ignoreTailOf.id && ignoreTailOf.grow <= 0
        ? body.length - 1
        : body.length;
    for (let i = 0; i < limit; i++) set.add(key(body[i]));
  }
  return set;
}

export function chooseNpcDir(
  snake: Snake,
  snakes: Snake[],
  foods: Food[],
  size: number,
): Dir {
  const head = snake.body[0];
  const occupied = occupiedSet(snakes, snake);
  const prefs = rankedDirs(snake, foods, head);

  for (const dir of prefs) {
    if (dir === OPPOSITE[snake.dir] && snake.body.length > 1) continue;
    const next = step(head, dir);
    if (!inBounds(next, size)) continue;
    if (occupied.has(key(next))) continue;
    if (openNeighbors(next, occupied, size, dir) === 0 && snake.body.length > 4) {
      continue;
    }
    return dir;
  }

  for (const dir of ORDER) {
    if (dir === OPPOSITE[snake.dir] && snake.body.length > 1) continue;
    const next = step(head, dir);
    if (inBounds(next, size) && !occupied.has(key(next))) return dir;
  }

  return snake.dir;
}

function rankedDirs(snake: Snake, foods: Food[], head: Point): Dir[] {
  let target: Point | null = null;
  let best = Infinity;
  for (const f of foods) {
    const d = Math.abs(f.x - head.x) + Math.abs(f.y - head.y);
    if (d < best) {
      best = d;
      target = f;
    }
  }

  const scored = ORDER.map((dir) => {
    const n = step(head, dir);
    let score = Math.random() * 0.4;
    if (target) {
      const before = Math.abs(target.x - head.x) + Math.abs(target.y - head.y);
      const after = Math.abs(target.x - n.x) + Math.abs(target.y - n.y);
      score += (before - after) * 3;
    }
    if (dir === snake.dir) score += 0.6;
    return { dir, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.dir);
}

function openNeighbors(
  p: Point,
  occupied: Set<string>,
  size: number,
  from: Dir,
): number {
  let n = 0;
  for (const dir of ORDER) {
    if (dir === OPPOSITE[from]) continue;
    const q = step(p, dir);
    if (inBounds(q, size) && !occupied.has(key(q))) n++;
  }
  return n;
}

export function step(p: Point, dir: Dir): Point {
  const d = DIRS[dir];
  return { x: p.x + d.x, y: p.y + d.y };
}

export function inBounds(p: Point, size: number): boolean {
  return p.x >= 0 && p.y >= 0 && p.x < size && p.y < size;
}

export function spawnPoint(
  size: number,
  blocked: Set<string>,
  margin = 2,
): Point | null {
  for (let tries = 0; tries < 400; tries++) {
    const x = margin + Math.floor(Math.random() * Math.max(1, size - margin * 2));
    const y = margin + Math.floor(Math.random() * Math.max(1, size - margin * 2));
    if (!blocked.has(key({ x, y }))) return { x, y };
  }
  return null;
}

export function cellsHitSnake(p: Point, snakes: Snake[]): Snake | null {
  for (const s of snakes) {
    if (!s.alive) continue;
    for (const c of s.body) {
      if (same(c, p)) return s;
    }
  }
  return null;
}
