import {
  type Vec2,
  add,
  closestOnSegment,
  dist,
  normalize,
  scale,
  sub,
  v,
} from "./math";

export type TrackSample = {
  center: Vec2;
  left: Vec2;
  right: Vec2;
  tangent: Vec2;
  normal: Vec2;
  cumulative: number;
};

export type TrackQuery = {
  onTrack: boolean;
  distanceToCenter: number;
  halfWidth: number;
  progress: number; // 0..1 along lap
  segmentIndex: number;
  closest: Vec2;
  tangent: Vec2;
  normal: Vec2;
};

export class Track {
  readonly samples: TrackSample[];
  readonly totalLength: number;
  readonly halfWidth: number;
  readonly start: Vec2;
  readonly startAngle: number;
  readonly seed: number;

  private constructor(
    samples: TrackSample[],
    totalLength: number,
    halfWidth: number,
    start: Vec2,
    startAngle: number,
    seed: number,
  ) {
    this.samples = samples;
    this.totalLength = totalLength;
    this.halfWidth = halfWidth;
    this.start = start;
    this.startAngle = startAngle;
    this.seed = seed;
  }

  static generate(seed = Date.now()): Track {
    const rng = mulberry32(seed >>> 0);
    const halfWidth = 52 + rng() * 12;
    const pointCount = 12 + Math.floor(rng() * 5);
    const baseRadius = 520 + rng() * 180;
    const control: Vec2[] = [];

    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      // Keep start/finish relatively calm (first two control points near base radius)
      const nearStart = i === 0 || i === 1 || i === pointCount - 1;
      const radiusJitter = nearStart ? 0.92 + rng() * 0.1 : 0.68 + rng() * 0.4;
      const radial = baseRadius * radiusJitter;
      const bulge = nearStart ? (rng() - 0.5) * 30 : (rng() - 0.5) * 90;
      const stretchX = 1.2 + rng() * 0.12;
      const stretchY = 0.88 + rng() * 0.1;
      const cx = Math.cos(angle) * (radial + bulge) * stretchX;
      const cy = Math.sin(angle) * (radial + bulge * 0.8) * stretchY;
      control.push({ x: cx, y: cy });
    }

    // Smooth control polygon once so corners are less needle-sharp
    for (let pass = 0; pass < 2; pass++) {
      const smoothed: Vec2[] = [];
      for (let i = 0; i < control.length; i++) {
        const prev = control[(i - 1 + control.length) % control.length];
        const curr = control[i];
        const next = control[(i + 1) % control.length];
        smoothed.push({
          x: curr.x * 0.5 + prev.x * 0.25 + next.x * 0.25,
          y: curr.y * 0.5 + prev.y * 0.25 + next.y * 0.25,
        });
      }
      control.splice(0, control.length, ...smoothed);
    }

    // Smooth closed path via Catmull-Rom subdivision
    const dense = resampleClosedCatmull(control, 18);
    const samples: TrackSample[] = [];
    let cumulative = 0;

    for (let i = 0; i < dense.length; i++) {
      const prev = dense[(i - 1 + dense.length) % dense.length];
      const curr = dense[i];
      const next = dense[(i + 1) % dense.length];
      const tangent = normalize(sub(next, prev));
      const normal = { x: -tangent.y, y: tangent.x };
      if (i > 0) cumulative += dist(dense[i - 1], curr);
      samples.push({
        center: curr,
        left: add(curr, scale(normal, halfWidth)),
        right: add(curr, scale(normal, -halfWidth)),
        tangent,
        normal,
        cumulative,
      });
    }
    const total = cumulative + dist(dense[dense.length - 1], dense[0]);

    const start = samples[0].center;
    const startAngle = Math.atan2(samples[0].tangent.y, samples[0].tangent.x);

    return new Track(samples, total, halfWidth, start, startAngle, seed);
  }

  query(pos: Vec2): TrackQuery {
    let best = {
      dist: Infinity,
      index: 0,
      closest: this.samples[0].center,
      t: 0,
    };

    for (let i = 0; i < this.samples.length; i++) {
      const a = this.samples[i].center;
      const b = this.samples[(i + 1) % this.samples.length].center;
      const c = closestOnSegment(pos, a, b);
      if (c.dist < best.dist) {
        best = { dist: c.dist, index: i, closest: c.point, t: c.t };
      }
    }

    const a = this.samples[best.index];
    const b = this.samples[(best.index + 1) % this.samples.length];
    const tangent = normalize({
      x: lerp2(a.tangent.x, b.tangent.x, best.t),
      y: lerp2(a.tangent.y, b.tangent.y, best.t),
    });
    const normal = { x: -tangent.y, y: tangent.x };
    const along =
      a.cumulative +
      best.t *
        (b.cumulative >= a.cumulative
          ? b.cumulative - a.cumulative
          : this.totalLength - a.cumulative + b.cumulative);

    return {
      onTrack: best.dist <= this.halfWidth + 6,
      distanceToCenter: best.dist,
      halfWidth: this.halfWidth,
      progress: (along % this.totalLength) / this.totalLength,
      segmentIndex: best.index,
      closest: best.closest,
      tangent,
      normal,
    };
  }

  /** World bounds for camera / grass fill. */
  bounds(pad = 200): { minX: number; minY: number; maxX: number; maxY: number } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const s of this.samples) {
      for (const p of [s.left, s.right, s.center]) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    }
    return {
      minX: minX - pad,
      minY: minY - pad,
      maxX: maxX + pad,
      maxY: maxY + pad,
    };
  }
}

function lerp2(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function catmullRom(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function resampleClosedCatmull(control: Vec2[], stepsPerSeg: number): Vec2[] {
  const n = control.length;
  const out: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = control[(i - 1 + n) % n];
    const p1 = control[i];
    const p2 = control[(i + 1) % n];
    const p3 = control[(i + 2) % n];
    for (let s = 0; s < stepsPerSeg; s++) {
      out.push(catmullRom(p0, p1, p2, p3, s / stepsPerSeg));
    }
  }
  // Ensure roughly even spacing
  return evenSpacing(out, Math.max(80, Math.floor(out.length * 0.55)));
}

function evenSpacing(pts: Vec2[], count: number): Vec2[] {
  if (pts.length < 2) return pts;
  const lengths: number[] = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += dist(pts[i - 1], pts[i]);
    lengths.push(total);
  }
  total += dist(pts[pts.length - 1], pts[0]);

  const result: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    const target = (i / count) * total;
    if (target <= lengths[lengths.length - 1]) {
      let j = 1;
      while (j < lengths.length && lengths[j] < target) j++;
      const a = pts[j - 1];
      const b = pts[j % pts.length];
      const segStart = lengths[j - 1];
      const segLen = lengths[j] - segStart || 1;
      const t = (target - segStart) / segLen;
      result.push(v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
    } else {
      const a = pts[pts.length - 1];
      const b = pts[0];
      const segStart = lengths[lengths.length - 1];
      const segLen = total - segStart || 1;
      const t = (target - segStart) / segLen;
      result.push(v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
    }
  }
  return result;
}
