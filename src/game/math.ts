export type Vec2 = { x: number; y: number };

export function v(x = 0, y = 0): Vec2 {
  return { x, y };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(a: Vec2, s: number): Vec2 {
  return { x: a.x * s, y: a.y * s };
}

export function length(a: Vec2): number {
  return Math.hypot(a.x, a.y);
}

export function normalize(a: Vec2): Vec2 {
  const len = length(a);
  if (len < 1e-8) return { x: 0, y: 0 };
  return { x: a.x / len, y: a.y / len };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Closest point on segment AB to point P, plus t in [0,1]. */
export function closestOnSegment(
  p: Vec2,
  a: Vec2,
  b: Vec2,
): { point: Vec2; t: number; dist: number } {
  const ab = sub(b, a);
  const abLen2 = ab.x * ab.x + ab.y * ab.y;
  if (abLen2 < 1e-8) {
    const d = dist(p, a);
    return { point: { ...a }, t: 0, dist: d };
  }
  const t = clamp(dot(sub(p, a), ab) / abLen2, 0, 1);
  const point = { x: a.x + ab.x * t, y: a.y + ab.y * t };
  return { point, t, dist: dist(p, point) };
}
