import {
  cellsHitSnake,
  chooseNpcDir,
  inBounds,
  occupiedSet,
  spawnPoint,
  step,
} from "./ai";
import { getLevel, type LevelConfig } from "./levels";
import {
  OPPOSITE,
  type Dir,
  type Food,
  type GamePhase,
  type Particle,
  type Point,
  type Snake,
  key,
  same,
} from "./types";

export class Engine {
  phase: GamePhase = "menu";
  levelCfg: LevelConfig = getLevel(1);
  snakes: Snake[] = [];
  foods: Food[] = [];
  particles: Particle[] = [];
  score = 0;
  highScore = Number(localStorage.getItem("neon-serpent-hi") || 0);
  tickAcc = 0;
  message = "";
  selectedLevel = 1;
  private playerQueued: Dir | null = null;

  get size() {
    return this.levelCfg.size;
  }

  get player(): Snake | undefined {
    return this.snakes.find((s) => s.isPlayer);
  }

  selectLevel(level: number) {
    this.selectedLevel = Math.max(1, Math.min(10, level));
  }

  start() {
    this.levelCfg = getLevel(this.selectedLevel);
    this.score = 0;
    this.message = "";
    this.tickAcc = 0;
    this.playerQueued = null;
    this.particles = [];
    this.snakes = [];
    this.foods = [];
    this.spawnAll();
    this.phase = "playing";
  }

  returnToMenu() {
    this.phase = "menu";
  }

  togglePause() {
    if (this.phase === "playing") this.phase = "paused";
    else if (this.phase === "paused") this.phase = "playing";
  }

  queuePlayerDir(dir: Dir) {
    const p = this.player;
    if (!p || !p.alive) return;
    const current = p.pending ?? p.dir;
    if (dir === OPPOSITE[current] && p.body.length > 1) return;
    this.playerQueued = dir;
    p.pending = dir;
  }

  update(dt: number) {
    this.updateParticles(dt);
    for (const f of this.foods) f.pulse += dt;
    if (this.phase !== "playing") return;

    for (const s of this.snakes) {
      if (!s.alive || s.isPlayer) continue;
      s.autoGrowAcc += dt;
      if (s.autoGrowAcc >= this.levelCfg.npcAutoGrowEvery) {
        s.autoGrowAcc = 0;
        s.grow += 1;
        this.burst(s.body[0], `hsl(${s.hue} 80% 60%)`, 6);
      }
    }

    this.tickAcc += dt;
    const interval = 1 / this.levelCfg.speed;
    while (this.tickAcc >= interval) {
      this.tickAcc -= interval;
      this.tick();
      if (this.phase !== "playing") break;
    }
  }

  private spawnAll() {
    const size = this.size;
    const blocked = new Set<string>();
    const playerStart = {
      x: Math.floor(size * 0.25),
      y: Math.floor(size / 2),
    };
    const player: Snake = {
      id: "player",
      body: [
        playerStart,
        { x: playerStart.x - 1, y: playerStart.y },
        { x: playerStart.x - 2, y: playerStart.y },
      ],
      dir: "right",
      pending: null,
      grow: 0,
      alive: true,
      isPlayer: true,
      hue: 160,
      autoGrowAcc: 0,
    };
    this.snakes.push(player);
    for (const c of player.body) blocked.add(key(c));

    const hues = [12, 280, 210, 45];
    for (let i = 0; i < this.levelCfg.npcCount; i++) {
      const head =
        spawnPoint(size, blocked, Math.max(2, Math.floor(size * 0.08))) ?? {
          x: size - 4 - i,
          y: 4 + i * 3,
        };
      const body = [
        head,
        { x: head.x + 1, y: head.y },
        { x: head.x + 2, y: head.y },
      ];
      for (const c of body) blocked.add(key(c));
      this.snakes.push({
        id: `npc-${i}`,
        body,
        dir: "left",
        pending: null,
        grow: 0,
        alive: true,
        isPlayer: false,
        hue: hues[i % hues.length],
        autoGrowAcc: Math.random() * this.levelCfg.npcAutoGrowEvery,
      });
    }
    for (let i = 0; i < this.levelCfg.foodCount; i++) this.spawnFood();
  }

  private spawnFood() {
    const blocked = occupiedSet(this.snakes);
    for (const f of this.foods) blocked.add(key(f));
    const p = spawnPoint(this.size, blocked, 1);
    if (p) this.foods.push({ ...p, pulse: Math.random() * Math.PI * 2 });
  }

  private tick() {
    for (const s of this.snakes) {
      if (!s.alive || s.isPlayer) continue;
      s.dir = chooseNpcDir(s, this.snakes, this.foods, this.size);
    }

    const player = this.player;
    if (player?.alive) {
      if (player.pending) {
        player.dir = player.pending;
        player.pending = null;
      } else if (this.playerQueued) {
        if (
          this.playerQueued !== OPPOSITE[player.dir] ||
          player.body.length <= 1
        ) {
          player.dir = this.playerQueued;
        }
        this.playerQueued = null;
      }
    }

    for (const s of this.snakes) {
      if (!s.alive) continue;
      const next = step(s.body[0], s.dir);

      if (!inBounds(next, this.size)) {
        this.kill(s, "撞墙了");
        continue;
      }
      if (s.body.slice(0, s.grow > 0 ? undefined : -1).some((c) => same(c, next))) {
        this.kill(s, s.isPlayer ? "撞到自己了" : "");
        continue;
      }

      const hit = cellsHitSnake(
        next,
        this.snakes.filter((o) => o.id !== s.id),
      );
      if (hit) {
        if (s.isPlayer) {
          this.kill(s, "撞到 NPC 了");
          continue;
        }
        if (hit.isPlayer) {
          this.kill(hit, "被 NPC 撞到了");
          s.dir = OPPOSITE[s.dir];
          continue;
        }
        this.kill(s, "");
        continue;
      }

      s.body.unshift(next);
      const foodIdx = this.foods.findIndex((f) => same(f, next));
      if (foodIdx >= 0) {
        this.foods.splice(foodIdx, 1);
        s.grow += 1;
        this.burst(next, s.isPlayer ? "#2ee6a6" : `hsl(${s.hue} 90% 60%)`, 14);
        if (s.isPlayer) {
          this.score += 1;
          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("neon-serpent-hi", String(this.highScore));
          }
          if (this.score >= this.levelCfg.targetScore) {
            this.phase = "win";
            this.message = `第 ${this.levelCfg.level} 关通关！`;
            this.burst(next, "#ffe566", 28);
          }
        }
        this.spawnFood();
      }
      if (s.grow > 0) s.grow -= 1;
      else s.body.pop();
    }
  }

  private kill(s: Snake, msg: string) {
    if (!s.alive) return;
    s.alive = false;
    this.burst(s.body[0], s.isPlayer ? "#ff6b6b" : `hsl(${s.hue} 80% 55%)`, 20);
    if (s.isPlayer) {
      this.phase = "gameover";
      this.message = msg || "游戏结束";
    }
  }

  private burst(p: Point, color: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 120;
      this.particles.push({
        x: p.x + 0.5,
        y: p.y + 0.5,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.35 + Math.random() * 0.45,
        maxLife: 0.8,
        color,
        size: 0.12 + Math.random() * 0.2,
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += (p.vx * dt) / Math.max(8, this.size);
      p.y += (p.vy * dt) / Math.max(8, this.size);
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }
}
