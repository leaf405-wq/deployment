import type { Car } from "./car";
import type { Track } from "./track";

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private grassPattern: CanvasPattern | null = null;
  private asphaltPattern: CanvasPattern | null = null;

  cameraX = 0;
  cameraY = 0;
  zoom = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.grassPattern = this.makeGrassPattern();
    this.asphaltPattern = this.makeAsphaltPattern();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  follow(car: Car, dt: number) {
    const lead = 90;
    const tx = car.x + Math.cos(car.angle) * lead;
    const ty = car.y + Math.sin(car.angle) * lead;
    const smooth = 1 - Math.exp(-6 * dt);
    this.cameraX += (tx - this.cameraX) * smooth;
    this.cameraY += (ty - this.cameraY) * smooth;
    // Slightly pulled back so the larger car and complex tracks read clearly
    const speedZoom = 0.92 - Math.min(0.2, Math.abs(car.speed) / 3000);
    this.zoom += (speedZoom - this.zoom) * smooth;
  }

  draw(track: Track, car: Car) {
    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Atmosphere gradient sky-ish fill behind world
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1a2f28");
    sky.addColorStop(1, "#0d1814");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.translate(w / 2, h / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.cameraX, -this.cameraY);

    this.drawWorld(track, car);

    ctx.restore();
  }

  private drawWorld(track: Track, car: Car) {
    const ctx = this.ctx;
    const b = track.bounds(320);

    // Grass field
    ctx.fillStyle = this.grassPattern ?? "#1f4a34";
    ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);

    // Soft vignette patches
    ctx.fillStyle = "rgba(8, 20, 14, 0.18)";
    for (let i = 0; i < 12; i++) {
      const sx = b.minX + ((i * 137) % (b.maxX - b.minX));
      const sy = b.minY + ((i * 97) % (b.maxY - b.minY));
      ctx.beginPath();
      ctx.ellipse(sx, sy, 180, 120, i, 0, Math.PI * 2);
      ctx.fill();
    }

    // Track asphalt ribbon
    this.drawTrackSurface(track);

    // Center dashed line
    this.drawCenterLine(track);

    // Start/finish
    this.drawStartFinish(track);

    // Skid marks
    for (const s of car.skids) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.globalAlpha = s.life * 0.35;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(-10, -2, 20, 4);
      ctx.restore();
    }

    // Car
    this.drawCar(car);

    // Off-track dust
    if (!car.onTrack && Math.abs(car.speed) > 40) {
      ctx.fillStyle = "rgba(120, 90, 50, 0.25)";
      ctx.beginPath();
      ctx.arc(car.x - Math.cos(car.angle) * 18, car.y - Math.sin(car.angle) * 18, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawTrackSurface(track: Track) {
    const ctx = this.ctx;
    const samples = track.samples;

    // Outer runoff
    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i].left;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    for (let i = samples.length - 1; i >= 0; i--) {
      const p = {
        x: samples[i].center.x + samples[i].normal.x * (track.halfWidth + 18),
        y: samples[i].center.y + samples[i].normal.y * (track.halfWidth + 18),
      };
      if (i === samples.length - 1) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    // simpler: fill thick stroke along path
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Redraw as thick stroke on centerline for clean look
    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i].center;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#3a3a3a";
    ctx.lineWidth = track.halfWidth * 2 + 22;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i].center;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = this.asphaltPattern ?? "#2a2a2a";
    ctx.lineWidth = track.halfWidth * 2;
    ctx.stroke();

    // White edge lines
    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i].left;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(245,245,240,0.9)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const p = samples[i].right;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();

    // Kerbs near start + on sharper corners (reads better on complex maps)
    const kerbIndices = new Set<number>();
    for (let i = 0; i < 10; i++) kerbIndices.add(i);
    for (let i = 0; i < samples.length; i++) {
      const prev = samples[(i - 1 + samples.length) % samples.length];
      const curr = samples[i];
      const cross =
        prev.tangent.x * curr.tangent.y - prev.tangent.y * curr.tangent.x;
      if (Math.abs(cross) > 0.08) {
        for (let k = -1; k <= 2; k++) {
          kerbIndices.add((i + k + samples.length) % samples.length);
        }
      }
    }
    const ordered = [...kerbIndices].sort((a, b) => a - b);
    for (const i of ordered) {
      const s = samples[i];
      const s2 = samples[(i + 1) % samples.length];
      const n = s.normal;
      ctx.fillStyle = i % 2 === 0 ? "#e11d48" : "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(s.left.x, s.left.y);
      ctx.lineTo(s.left.x + n.x * 10, s.left.y + n.y * 10);
      ctx.lineTo(s2.left.x + s2.normal.x * 10, s2.left.y + s2.normal.y * 10);
      ctx.lineTo(s2.left.x, s2.left.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawCenterLine(track: Track) {
    const ctx = this.ctx;
    ctx.save();
    ctx.setLineDash([18, 16]);
    ctx.beginPath();
    for (let i = 0; i < track.samples.length; i++) {
      const p = track.samples[i].center;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private drawStartFinish(track: Track) {
    const ctx = this.ctx;
    const s = track.samples[0];
    const n = s.normal;
    const half = track.halfWidth;
    const a = {
      x: s.center.x + n.x * half,
      y: s.center.y + n.y * half,
    };
    const b = {
      x: s.center.x - n.x * half,
      y: s.center.y - n.y * half,
    };
    const checks = 10;
    for (let i = 0; i < checks; i++) {
      const t0 = i / checks;
      const t1 = (i + 1) / checks;
      ctx.fillStyle = i % 2 === 0 ? "#111" : "#f5f5f0";
      ctx.beginPath();
      ctx.moveTo(a.x + (b.x - a.x) * t0, a.y + (b.y - a.y) * t0);
      ctx.lineTo(a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1);
      ctx.lineTo(
        a.x + (b.x - a.x) * t1 + s.tangent.x * 12,
        a.y + (b.y - a.y) * t1 + s.tangent.y * 12,
      );
      ctx.lineTo(
        a.x + (b.x - a.x) * t0 + s.tangent.x * 12,
        a.y + (b.y - a.y) * t0 + s.tangent.y * 12,
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawCar(car: Car) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);

    // Soft ground shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(4, 7, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Exhaust glow when accelerating
    if (car.throttleOn && Math.abs(car.speed) > 20) {
      const glow = ctx.createRadialGradient(-30, 0, 0, -30, 0, 18);
      glow.addColorStop(0, "rgba(255, 140, 40, 0.55)");
      glow.addColorStop(1, "rgba(255, 80, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(-30, -4, 10, 0, Math.PI * 2);
      ctx.arc(-30, 4, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wheels (under body)
    const paintWheel = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      roundRect(ctx, x, y, w, h, 2);
      ctx.fill();
    };
    paintWheel(-18, -20, 14, 7, "#121212");
    paintWheel(-18, 13, 14, 7, "#121212");
    paintWheel(10, -20, 14, 7, "#121212");
    paintWheel(10, 13, 14, 7, "#121212");
    paintWheel(-15, -18.5, 8, 4, "#333");
    paintWheel(-15, 14.5, 8, 4, "#333");
    paintWheel(13, -18.5, 8, 4, "#333");
    paintWheel(13, 14.5, 8, 4, "#333");

    // Main body shell
    const body = ctx.createLinearGradient(-26, -16, 30, 16);
    body.addColorStop(0, "#b6e02e");
    body.addColorStop(0.35, "#e8ff47");
    body.addColorStop(0.7, "#d4f23a");
    body.addColorStop(1, "#8fb81a");
    ctx.fillStyle = body;
    // Sculpted GT silhouette
    ctx.beginPath();
    ctx.moveTo(28, 0);
    ctx.quadraticCurveTo(26, -8, 16, -13);
    ctx.lineTo(-8, -15);
    ctx.quadraticCurveTo(-22, -14, -26, -8);
    ctx.lineTo(-28, -4);
    ctx.lineTo(-28, 4);
    ctx.lineTo(-26, 8);
    ctx.quadraticCurveTo(-22, 14, -8, 15);
    ctx.lineTo(16, 13);
    ctx.quadraticCurveTo(26, 8, 28, 0);
    ctx.closePath();
    ctx.fill();

    // Dark side skirts
    ctx.fillStyle = "rgba(15, 26, 22, 0.55)";
    ctx.beginPath();
    ctx.moveTo(-20, -15);
    ctx.lineTo(14, -13);
    ctx.lineTo(12, -10);
    ctx.lineTo(-18, -11);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-20, 15);
    ctx.lineTo(14, 13);
    ctx.lineTo(12, 10);
    ctx.lineTo(-18, 11);
    ctx.closePath();
    ctx.fill();

    // Hood highlight stripe
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.moveTo(8, -3);
    ctx.lineTo(24, -2);
    ctx.lineTo(24, 2);
    ctx.lineTo(8, 3);
    ctx.closePath();
    ctx.fill();

    // Racing number plate
    ctx.fillStyle = "#0f1a16";
    roundRect(ctx, -6, -7, 14, 14, 3);
    ctx.fill();
    ctx.fillStyle = "#e8ff47";
    ctx.font = "bold 11px Bebas Neue, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("07", 1, 1);

    // Cockpit glass
    const glass = ctx.createLinearGradient(6, -8, 20, 8);
    glass.addColorStop(0, "#1c3d4f");
    glass.addColorStop(0.5, "#3d7a96");
    glass.addColorStop(1, "#0e2430");
    ctx.fillStyle = glass;
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(18, -7);
    ctx.quadraticCurveTo(22, 0, 18, 7);
    ctx.lineTo(8, 8);
    ctx.quadraticCurveTo(11, 0, 8, -8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rear wing
    ctx.fillStyle = "#0f1a16";
    roundRect(ctx, -30, -12, 6, 24, 1.5);
    ctx.fill();
    ctx.fillStyle = "#1a2e24";
    roundRect(ctx, -32, -14, 10, 3, 1);
    ctx.fill();
    roundRect(ctx, -32, 11, 10, 3, 1);
    ctx.fill();

    // Side mirrors
    ctx.fillStyle = "#0f1a16";
    roundRect(ctx, 2, -18, 7, 3, 1);
    ctx.fill();
    roundRect(ctx, 2, 15, 7, 3, 1);
    ctx.fill();

    // Headlights
    ctx.fillStyle = "rgba(255,248,210,0.95)";
    roundRect(ctx, 24, -9, 5, 5, 1.5);
    ctx.fill();
    roundRect(ctx, 24, 4, 5, 5, 1.5);
    ctx.fill();
    // Tail lights (brighten when braking)
    ctx.fillStyle = car.braking ? "rgba(255,70,50,0.95)" : "rgba(220,40,40,0.75)";
    roundRect(ctx, -29, -7, 3, 5, 1);
    ctx.fill();
    roundRect(ctx, -29, 2, 3, 5, 1);
    ctx.fill();

    // Front splitter accent
    ctx.fillStyle = "#0f1a16";
    ctx.fillRect(26, -5, 4, 10);

    ctx.restore();
  }

  private makeGrassPattern(): CanvasPattern | null {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#1b4d35";
    g.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = i % 2 === 0 ? "#226344" : "#174530";
      g.fillRect((i * 17) % 64, (i * 29) % 64, 3, 8);
    }
    return this.ctx.createPattern(c, "repeat");
  }

  private makeAsphaltPattern(): CanvasPattern | null {
    const c = document.createElement("canvas");
    c.width = 48;
    c.height = 48;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#2c2c2c";
    g.fillRect(0, 0, 48, 48);
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + (i % 5) * 0.01})`;
      g.fillRect((i * 13) % 48, (i * 21) % 48, 1, 1);
    }
    return this.ctx.createPattern(c, "repeat");
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
