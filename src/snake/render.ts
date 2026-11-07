import type { Engine } from "./engine";
import type { Point, Snake } from "./types";

type Board = {
  x: number;
  y: number;
  cell: number;
  size: number;
  /** World origin offset in cells (camera). */
  camX: number;
  camY: number;
  viewCols: number;
  viewRows: number;
};

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private camX = 0;
  private camY = 0;

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

    if (engine.phase === "menu") return;

    const focus = engine.player?.body[0] ?? { x: engine.size / 2, y: engine.size / 2 };
    const board = this.boardRect(engine.size, focus);
    this.drawBoard(engine.size, board);
    this.drawFoods(engine, board);
    for (const s of engine.snakes) {
      if (s.alive || s.body.length) this.drawSnake(s, board);
    }
    this.drawParticles(engine, board);

    // Mini overview for zoomed large maps
    if (board.viewCols < engine.size || board.viewRows < engine.size) {
      this.drawMinimap(engine, board, focus);
    }
  }

  boardRect(size: number, focus: Point): Board {
    const padX = Math.min(72, this.w * 0.06);
    const padTop = 96;
    const padBottom = 80;
    const availW = Math.max(160, this.w - padX * 2);
    const availH = Math.max(160, this.h - padTop - padBottom);

    // Prefer fitting whole board; never allow cell < 6 — switch to camera viewport
    const fitCell = Math.min(availW / size, availH / size);
    const minCell = 8;
    let cell: number;
    let viewCols: number;
    let viewRows: number;
    let camX = 0;
    let camY = 0;

    if (fitCell >= minCell) {
      cell = fitCell;
      viewCols = size;
      viewRows = size;
      this.camX = 0;
      this.camY = 0;
    } else {
      cell = Math.min(18, Math.max(minCell, Math.min(availW / 24, availH / 24)));
      viewCols = Math.max(12, Math.floor(availW / cell));
      viewRows = Math.max(12, Math.floor(availH / cell));
      viewCols = Math.min(size, viewCols);
      viewRows = Math.min(size, viewRows);
      const targetX = focus.x - viewCols / 2;
      const targetY = focus.y - viewRows / 2;
      camX = clamp(targetX, 0, Math.max(0, size - viewCols));
      camY = clamp(targetY, 0, Math.max(0, size - viewRows));
      // Smooth camera
      this.camX += (camX - this.camX) * 0.18;
      this.camY += (camY - this.camY) * 0.18;
      camX = this.camX;
      camY = this.camY;
    }

    const bw = cell * viewCols;
    const bh = cell * viewRows;
    return {
      x: Math.floor((this.w - bw) / 2),
      y: Math.floor(padTop + (availH - bh) / 2),
      cell,
      size,
      camX,
      camY,
      viewCols,
      viewRows,
    };
  }

  private worldToScreen(board: Board, wx: number, wy: number): Point {
    return {
      x: board.x + (wx - board.camX) * board.cell,
      y: board.y + (wy - board.camY) * board.cell,
    };
  }

  private inView(board: Board, wx: number, wy: number, margin = 1): boolean {
    return (
      wx >= board.camX - margin &&
      wy >= board.camY - margin &&
      wx <= board.camX + board.viewCols + margin &&
      wy <= board.camY + board.viewRows + margin
    );
  }

  private drawBoard(size: number, board: Board) {
    const ctx = this.ctx;
    const { x, y, cell, viewCols, viewRows } = board;
    const w = cell * viewCols;
    const h = cell * viewRows;

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

    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, w, h, 10);
    ctx.clip();

    ctx.strokeStyle = "rgba(150, 200, 220, 0.06)";
    ctx.lineWidth = 1;
    const startCol = Math.floor(board.camX);
    const startRow = Math.floor(board.camY);
    for (let i = 0; i <= viewCols; i++) {
      const gx = x + (startCol + i - board.camX) * cell;
      ctx.beginPath();
      ctx.moveTo(gx + 0.5, y);
      ctx.lineTo(gx + 0.5, y + h);
      ctx.stroke();
    }
    for (let j = 0; j <= viewRows; j++) {
      const gy = y + (startRow + j - board.camY) * cell;
      ctx.beginPath();
      ctx.moveTo(x, gy + 0.5);
      ctx.lineTo(x + w, gy + 0.5);
      ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(46, 230, 166, 0.45)";
    ctx.lineWidth = 2;
    roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 10);
    ctx.stroke();

    if (viewCols < size || viewRows < size) {
      ctx.fillStyle = "rgba(232, 255, 246, 0.55)";
      ctx.font = "12px Sora, sans-serif";
      ctx.fillText(`${size}×${size} · 镜头跟随`, x, y - 10);
    }
  }

  private drawFoods(engine: Engine, board: Board) {
    const ctx = this.ctx;
    for (const f of engine.foods) {
      if (!this.inView(board, f.x, f.y)) continue;
      const c = this.worldToScreen(board, f.x + 0.5, f.y + 0.5);
      const pulse = 0.75 + Math.sin(f.pulse * 4) * 0.15;
      const r = board.cell * 0.28 * pulse;
      ctx.save();
      ctx.shadowColor = "#ff5d8f";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ff7aa8";
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(c.x - r * 0.25, c.y - r * 0.25, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawSnake(snake: Snake, board: Board) {
    const ctx = this.ctx;
    const body = snake.body;
    if (!body.length) return;
    ctx.save();
    ctx.globalAlpha = snake.alive ? 1 : 0.35;

    for (let i = body.length - 1; i >= 0; i--) {
      const p = body[i];
      if (!this.inView(board, p.x, p.y)) continue;
      const t = body.length === 1 ? 1 : 1 - i / (body.length - 1);
      const radius = board.cell * (0.28 + t * 0.14);
      const c = this.worldToScreen(board, p.x + 0.5, p.y + 0.5);
      const light = snake.isPlayer ? 58 + t * 12 : 48 + t * 10;
      ctx.save();
      if (i === 0) {
        ctx.shadowColor = `hsla(${snake.hue}, 90%, 55%, 0.65)`;
        ctx.shadowBlur = 16;
      }
      const grad = ctx.createRadialGradient(
        c.x - radius * 0.25,
        c.y - radius * 0.25,
        0,
        c.x,
        c.y,
        radius,
      );
      grad.addColorStop(0, `hsla(${snake.hue}, 85%, ${light + 18}%, 1)`);
      grad.addColorStop(0.55, `hsla(${snake.hue}, 80%, ${light}%, 1)`);
      grad.addColorStop(1, `hsla(${snake.hue}, 75%, ${light - 18}%, 1)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const head = body[0];
    if (this.inView(board, head.x, head.y)) {
      const c = this.worldToScreen(board, head.x + 0.5, head.y + 0.5);
      const eye = board.cell * 0.09;
      const offsets = eyeOffsets(snake.dir, board.cell);
      ctx.fillStyle = "#071018";
      ctx.beginPath();
      ctx.arc(c.x + offsets[0].x, c.y + offsets[0].y, eye, 0, Math.PI * 2);
      ctx.arc(c.x + offsets[1].x, c.y + offsets[1].y, eye, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(
        c.x + offsets[0].x + eye * 0.25,
        c.y + offsets[0].y - eye * 0.2,
        eye * 0.35,
        0,
        Math.PI * 2,
      );
      ctx.arc(
        c.x + offsets[1].x + eye * 0.25,
        c.y + offsets[1].y - eye * 0.2,
        eye * 0.35,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  private drawParticles(engine: Engine, board: Board) {
    const ctx = this.ctx;
    for (const p of engine.particles) {
      if (!this.inView(board, p.x, p.y, 2)) continue;
      const c = this.worldToScreen(board, p.x, p.y);
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, p.size * board.cell, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawMinimap(engine: Engine, board: Board, focus: Point) {
    const ctx = this.ctx;
    const mapSize = 88;
    const x = this.w - mapSize - 20;
    const y = 96;
    const scale = mapSize / engine.size;
    ctx.fillStyle = "rgba(8, 18, 28, 0.85)";
    ctx.strokeStyle = "rgba(46, 230, 166, 0.4)";
    ctx.lineWidth = 1;
    ctx.fillRect(x, y, mapSize, mapSize);
    ctx.strokeRect(x, y, mapSize, mapSize);

    for (const s of engine.snakes) {
      if (!s.alive) continue;
      ctx.fillStyle = s.isPlayer ? "#2ee6a6" : `hsl(${s.hue} 80% 55%)`;
      for (const p of s.body) {
        ctx.fillRect(x + p.x * scale, y + p.y * scale, Math.max(1, scale), Math.max(1, scale));
      }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.strokeRect(
      x + board.camX * scale,
      y + board.camY * scale,
      board.viewCols * scale,
      board.viewRows * scale,
    );
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x + (focus.x + 0.5) * scale, y + (focus.y + 0.5) * scale, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
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
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
