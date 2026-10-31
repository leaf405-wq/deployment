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
    const speedZoom = 1 - Math.min(0.18, Math.abs(car.speed) / 3200);
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
      ctx.fillRect(-6, -1.5, 12, 3);
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

    // Kerbs near start
    for (let i = 0; i < 8; i++) {
      const s = samples[i];
      const n = s.normal;
      ctx.fillStyle = i % 2 === 0 ? "#e11d48" : "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(s.left.x, s.left.y);
      ctx.lineTo(s.left.x + n.x * 10, s.left.y + n.y * 10);
      const s2 = samples[(i + 1) % samples.length];
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

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(2, 4, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    const body = ctx.createLinearGradient(-14, 0, 18, 0);
    body.addColorStop(0, "#c4f042");
    body.addColorStop(0.5, "#e8ff47");
    body.addColorStop(1, "#9bc91f");
    ctx.fillStyle = body;
    roundRect(ctx, -14, -9, 30, 18, 4);
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#0f1a16";
    roundRect(ctx, -2, -6, 12, 12, 3);
    ctx.fill();

    // Nose stripe
    ctx.fillStyle = "#0f1a16";
    ctx.fillRect(10, -2.5, 8, 5);

    // Wheels
    ctx.fillStyle = "#111";
    ctx.fillRect(-10, -11, 8, 3.5);
    ctx.fillRect(-10, 7.5, 8, 3.5);
    ctx.fillRect(6, -11, 8, 3.5);
    ctx.fillRect(6, 7.5, 8, 3.5);

    // Headlights
    ctx.fillStyle = "rgba(255,250,220,0.9)";
    ctx.fillRect(15, -6, 3, 3);
    ctx.fillRect(15, 3, 3, 3);

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
