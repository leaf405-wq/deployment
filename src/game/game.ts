import { Car } from "./car";
import { type Difficulty, DIFFICULTIES, parseDifficulty } from "./difficulty";
import { Input } from "./input";
import { Renderer } from "./renderer";
import { Track } from "./track";

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms));
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const cs = Math.floor((total % 1000) / 10);
  return `${m}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}

export class Game {
  private track: Track;
  private car: Car;
  private input: Input;
  private renderer: Renderer;
  private hud: HTMLElement;
  private raf = 0;
  private last = 0;
  private running = false;
  private readonly demoAssist: boolean;
  private difficulty: Difficulty;

  private elSpeed!: HTMLElement;
  private elLap!: HTMLElement;
  private elTime!: HTMLElement;
  private elBest!: HTMLElement;
  private elSeed!: HTMLElement;
  private elDiff!: HTMLElement;
  private elStatus!: HTMLElement;
  private elOff!: HTMLElement;
  private overlay!: HTMLElement;

  constructor(canvas: HTMLCanvasElement, hud: HTMLElement) {
    this.hud = hud;
    this.demoAssist = new URLSearchParams(location.search).has("demo");
    const saved = localStorage.getItem("apex-difficulty");
    this.difficulty = parseDifficulty(saved);
    this.track = Track.generate(Date.now(), this.difficulty);
    this.car = new Car(this.track.start, this.track.startAngle);
    this.input = new Input();
    this.renderer = new Renderer(canvas);
    this.bindHud();
    this.syncDifficultyButtons();
    this.renderer.cameraX = this.car.x;
    this.renderer.cameraY = this.car.y;
    this.updateHud(true);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.renderer.resize();
    window.addEventListener("resize", this.onResize);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    this.input.dispose();
  }

  private onResize = () => this.renderer.resize();

  private bindHud() {
    this.elSpeed = this.hud.querySelector("[data-speed]")!;
    this.elLap = this.hud.querySelector("[data-lap]")!;
    this.elTime = this.hud.querySelector("[data-time]")!;
    this.elBest = this.hud.querySelector("[data-best]")!;
    this.elSeed = this.hud.querySelector("[data-seed]")!;
    this.elDiff = this.hud.querySelector("[data-diff]")!;
    this.elStatus = this.hud.querySelector("[data-status]")!;
    this.elOff = this.hud.querySelector("[data-off]")!;
    this.overlay = this.hud.querySelector("[data-overlay]")!;

    this.hud.querySelectorAll("[data-new-track]").forEach((el) => {
      el.addEventListener("click", () => this.newTrack());
    });
    this.hud.querySelectorAll("[data-retry]").forEach((el) => {
      el.addEventListener("click", () => this.retry());
    });
    this.hud.querySelectorAll<HTMLButtonElement>("[data-difficulty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = parseDifficulty(btn.dataset.difficulty);
        this.setDifficulty(next);
      });
    });
  }

  private setDifficulty(difficulty: Difficulty) {
    if (this.difficulty === difficulty) {
      // Same difficulty → still roll a fresh layout
      this.newTrack();
      return;
    }
    this.difficulty = difficulty;
    localStorage.setItem("apex-difficulty", difficulty);
    this.syncDifficultyButtons();
    this.newTrack();
  }

  private syncDifficultyButtons() {
    this.hud.querySelectorAll<HTMLButtonElement>("[data-difficulty]").forEach((btn) => {
      const active = btn.dataset.difficulty === this.difficulty;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const preset = DIFFICULTIES[this.difficulty];
    const hint = this.hud.querySelector("[data-diff-hint]");
    if (hint) hint.textContent = preset.blurb;
  }

  private newTrack() {
    this.track = Track.generate(Date.now(), this.difficulty);
    this.car.reset(this.track.start, this.track.startAngle);
    this.renderer.cameraX = this.car.x;
    this.renderer.cameraY = this.car.y;
    this.hideOverlay();
    this.updateHud(true);
  }

  private retry() {
    this.car.reset(this.track.start, this.track.startAngle);
    this.renderer.cameraX = this.car.x;
    this.renderer.cameraY = this.car.y;
    this.hideOverlay();
    this.updateHud(true);
  }

  private loop = (now: number) => {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.05);

    if (this.input.consumeRestart()) {
      this.newTrack();
    }

    if (this.demoAssist) {
      this.runDemoAssist();
    }

    this.car.update(dt, this.input.state, this.track);
    this.renderer.follow(this.car, dt);
    this.renderer.draw(this.track, this.car);
    this.updateHud(false);

    if (this.car.finished) {
      this.showFinish();
    }

    this.raf = requestAnimationFrame(this.loop);
  };

  private updateHud(force: boolean) {
    const kmh = Math.round(this.car.speedKmh);
    this.elSpeed.textContent = `${kmh}`;
    this.elLap.textContent = `${this.car.lap}/${this.car.maxLaps}`;
    this.elTime.textContent = formatTime(this.car.currentLapMs);
    this.elBest.textContent =
      this.car.bestLapMs === null ? "--:--.--" : formatTime(this.car.bestLapMs);
    if (force) {
      this.elSeed.textContent = `#${this.track.seed.toString(36).toUpperCase().slice(-5)}`;
      this.elDiff.textContent = this.track.difficultyLabel;
    }
    this.elOff.hidden = this.car.onTrack || this.car.finished;
    this.elStatus.textContent = this.car.finished
      ? "完赛"
      : this.car.onTrack
        ? "赛道中"
        : "冲出赛道";
  }

  private showFinish() {
    this.overlay.hidden = false;
    const title = this.overlay.querySelector("[data-finish-title]")!;
    const detail = this.overlay.querySelector("[data-finish-detail]")!;
    title.textContent = "完赛！";
    const best =
      this.car.bestLapMs === null ? "--" : formatTime(this.car.bestLapMs);
    detail.textContent = `${this.track.difficultyLabel} · 总时间 ${formatTime(this.car.totalMs)} · 最快圈 ${best}`;
  }

  private hideOverlay() {
    this.overlay.hidden = true;
  }

  private runDemoAssist() {
    const q = this.track.query({ x: this.car.x, y: this.car.y });
    const state = this.input.state;
    state.up = true;
    state.down = false;
    const heading = this.car.angle;
    const want = Math.atan2(q.tangent.y, q.tangent.x);
    let err = want - heading;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    state.left = err < -0.05;
    state.right = err > 0.05;
    if (q.distanceToCenter > q.halfWidth * 0.45) {
      const toCenter = Math.atan2(
        q.closest.y - this.car.y,
        q.closest.x - this.car.x,
      );
      let cerr = toCenter - heading;
      while (cerr > Math.PI) cerr -= Math.PI * 2;
      while (cerr < -Math.PI) cerr += Math.PI * 2;
      if (cerr < 0) state.left = true;
      if (cerr > 0) state.right = true;
    }
  }
}
