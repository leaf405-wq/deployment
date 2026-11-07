import type { Engine } from "./engine";
import type { Point, Snake } from "./types";

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context unavailable");
    this.ctx = ctx;
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  draw(engine: Engine) {
    const ctx = this.ctx;
    const { w, h } = this;
    const bg = ctx.createRadialGradient(
      w * 0.5,
      h * 0.35,
      40,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.75,
    );
    bg.addColorStop(0, "#10283a");
    bg.addColorStop(0.45, "#0a1622");
    bg.addColorStop(1, "#050b12");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(46, 230, 166, 0.04)";
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h * 0.8, w * 0.25, h * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(120, 90, 255, 0.05)";
    ctx.beginPath();
    ctx.ellipse(w * 0.85, h * 0.2, w * 0.2, h * 0.16, 0.4, 0, Math.PI * 2);
    ctx.fill();

    if (engine.phase === "menu") return;

    const board = this.boardRect(engine.size);
    this.drawBoard(engine.size, board);
    this.drawFoods(engine, board);
    for (const s of engine.snakes) {
      if (s.alive || s.body.length) this.drawSnake(s, board);
    }
    this.drawParticles(engine, board);
  }

  boardRect(size: number) {
    const padX = Math.min(72, this.w * 0.08);
    const padTop = 100;
    const padBottom = 88;
    const availW = this.w - padX * 2;
    const availH = this.h - padTop - padBottom;
    const cell = Math.floor(Math.min(availW / size, availH / size));
    const bw = cell * size;
    const bh = cell * size;
    return {
      x: Math.floor((this.w - bw) / 2),
      y: Math.floor(padTop + (availH - bh) / 2),
      cell,
      size,
    };
  }

  private drawBoard(size: number, board: { x: number; y: number; cell: number }) {
    const ctx = this.ctx;
    const { x, y, cell } = board;
    const w = cell * size;
    const h = cell * size;

    ctx.save();
    ctx.shadowColor = "rgba(46, 230, 166, 0.35)";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#0c1824";
    roundRect(ctx, x - 6, y - 6, w + 12, h + 12, 14);
    ctx.fill();
    ctx.restore();

    const panel = ctx.createLinearGradient(x, y, x, y + h);
    panel.addColorStop(0, "#122334");
    panel.addColorStop(1, "#0d1a28");
    ctx.fillStyle = panel;
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();

    ctx.strokeStyle = "rgba(150, 200, 220, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 1; i < size; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * cell + 0.5, y);
      ctx.lineTo(x + i * cell + 0.5, y + h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + i * cell + 0.5);
      ctx.lineTo(x + w, y + i * cell + 0.5);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(46, 230, 166, 0.45)";
    ctx.lineWidth = 2;
    roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 10);
    ctx.stroke();
  }

  private drawFoods(
    engine: Engine,
    board: { x: number; y: number; cell: number },
  ) {
    const ctx = this.ctx;
    const { x, y, cell } = board;
    for (const f of engine.foods) {
      const cx = x + f.x * cell + cell / 2;
      const cy = y + f.y * cell + cell / 2;
      const pulse = 0.75 + Math.sin(f.pulse * 4) * 0.15;
      const r = cell * 0.28 * pulse;
      ctx.save();
      ctx.shadowColor = "#ff5d8f";
      ctx.shadowBlur = 16;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
      g.addColorStop(0, "#ffe0ea");
      g.addColorStop(0.35, "#ff5d8f");
      g.addColorStop(1, "rgba(255, 60, 100, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff7aa8";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawSnake(snake: Snake, board: { x: number; y: number; cell: number }) {
    const ctx = this.ctx;
    const { x, y, cell } = board;
    const body = snake.body;
    if (!body.length) return;
    ctx.save();
    ctx.globalAlpha = snake.alive ? 1 : 0.35;

    for (let i = body.length - 1; i >= 0; i--) {
      const p = body[i];
      const t = body.length === 1 ? 1 : 1 - i / (body.length - 1);
      const radius = cell * (0.28 + t * 0.14);
      const cx = x + p.x * cell + cell / 2;
      const cy = y + p.y * cell + cell / 2;
      const light = snake.isPlayer ? 58 + t * 12 : 48 + t * 10;
      ctx.save();
      if (i === 0) {
        ctx.shadowColor = `hsla(${snake.hue}, 90%, 55%, 0.65)`;
        ctx.shadowBlur = 18;
      }
      const grad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        0,
        cx,
        cy,
        radius,
      );
      grad.addColorStop(0, `hsla(${snake.hue}, 85%, ${light + 18}%, 1)`);
      grad.addColorStop(0.55, `hsla(${snake.hue}, 80%, ${light}%, 1)`);
      grad.addColorStop(1, `hsla(${snake.hue}, 75%, ${light - 18}%, 1)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const head = body[0];
    const hx = x + head.x * cell + cell / 2;
    const hy = y + head.y * cell + cell / 2;
    const eye = cell * 0.09;
    const offsets = eyeOffsets(snake.dir, cell);
    ctx.fillStyle = "#071018";
    ctx.beginPath();
    ctx.arc(hx + offsets[0].x, hy + offsets[0].y, eye, 0, Math.PI * 2);
    ctx.arc(hx + offsets[1].x, hy + offsets[1].y, eye, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(
      hx + offsets[0].x + eye * 0.25,
      hy + offsets[0].y - eye * 0.2,
      eye * 0.35,
      0,
      Math.PI * 2,
    );
    ctx.arc(
      hx + offsets[1].x + eye * 0.25,
      hy + offsets[1].y - eye * 0.2,
      eye * 0.35,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    if (snake.isPlayer) {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(hx, hy - cell * 0.12, cell * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawParticles(
    engine: Engine,
    board: { x: number; y: number; cell: number },
  ) {
    const ctx = this.ctx;
    for (const p of engine.particles) {
      const cx = board.x + p.x * board.cell;
      const cy = board.y + p.y * board.cell;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(cx, cy, p.size * board.cell, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function eyeOffsets(dir: Snake["dir"], cell: number): Point[] {
  const o = cell * 0.12;
  const f = cell * 0.1;
  switch (dir) {
    case "up":
      return [
        { x: -o, y: -f },
        { x: o, y: -f },
      ];
    case "down":
      return [
        { x: -o, y: f },
        { x: o, y: f },
      ];
    case "left":
      return [
        { x: -f, y: -o },
        { x: -f, y: o },
      ];
    case "right":
      return [
        { x: f, y: -o },
        { x: f, y: o },
      ];
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
