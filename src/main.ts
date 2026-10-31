import "./style.css";
import { Game } from "./game/game";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="shell">
    <canvas id="race" aria-label="赛车游戏画面"></canvas>
    <div class="hud" id="hud">
      <header class="top">
        <div class="brand">
          <span class="brand-mark">APEX</span>
          <span class="brand-sub">CIRCUIT</span>
        </div>
        <div class="meta">
          <span class="pill">赛道 <strong data-seed>—</strong></span>
          <button type="button" class="btn ghost" data-new-track>随机新赛道 (R)</button>
        </div>
      </header>

      <div class="telemetry">
        <div class="gauge">
          <span class="label">速度</span>
          <span class="value"><span data-speed>0</span><small>km/h</small></span>
        </div>
        <div class="gauge">
          <span class="label">圈数</span>
          <span class="value" data-lap>1/3</span>
        </div>
        <div class="gauge">
          <span class="label">本圈</span>
          <span class="value mono" data-time>0:00.00</span>
        </div>
        <div class="gauge">
          <span class="label">最快</span>
          <span class="value mono" data-best>--:--.--</span>
        </div>
      </div>

      <div class="status-row">
        <span class="status" data-status>赛道中</span>
        <span class="off" data-off hidden>减速回赛道</span>
      </div>

      <footer class="help">
        <kbd>↑</kbd> 加速
        <kbd>↓</kbd> 刹车 / 倒车
        <kbd>←</kbd><kbd>→</kbd> 转向
        <span class="sep">·</span>
        <span>三圈完赛 · 冲出赛道会大幅失速</span>
      </footer>

      <div class="overlay" data-overlay hidden>
        <div class="panel">
          <h2 data-finish-title>完赛！</h2>
          <p data-finish-detail></p>
          <div class="actions">
            <button type="button" class="btn primary" data-retry>再跑本赛道</button>
            <button type="button" class="btn" data-new-track>随机新赛道</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const canvas = app.querySelector<HTMLCanvasElement>("#race")!;
const hud = app.querySelector<HTMLElement>("#hud")!;
const game = new Game(canvas, hud);
game.start();
