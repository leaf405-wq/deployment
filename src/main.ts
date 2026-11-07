import "./style.css";
import { Engine } from "./snake/engine";
import { Input } from "./snake/input";
import { LEVELS } from "./snake/levels";
import { Renderer } from "./snake/render";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <div class="shell">
    <canvas id="stage" aria-label="贪吃蛇游戏画面"></canvas>

    <div class="ui" id="ui">
      <header class="topbar" data-hud hidden>
        <div class="brand-mini">NEON SERPENT</div>
        <div class="hud-stats">
          <div class="stat"><span>关卡</span><strong data-level>1</strong></div>
          <div class="stat"><span>地图</span><strong data-map>20×20</strong></div>
          <div class="stat"><span>得分</span><strong data-score>0</strong></div>
          <div class="stat"><span>目标</span><strong data-target>8</strong></div>
          <div class="stat"><span>最高</span><strong data-hi>0</strong></div>
        </div>
      </header>

      <section class="menu" data-menu>
        <div class="hero">
          <p class="eyebrow">PROFESSIONAL ARCADE</p>
          <h1>NEON<br/>SERPENT</h1>
          <p class="lede">精致光影 · NPC 自动变长 · 十级地图挑战。撞到 NPC 即失败。</p>
        </div>

        <div class="levels" role="listbox" aria-label="选择关卡">
          ${LEVELS.map(
            (lv) => `
            <button type="button" class="level-card" data-pick="${lv.level}" role="option">
              <span class="lv-num">L${lv.level}</span>
              <span class="lv-size">${lv.label}</span>
              <span class="lv-meta">${lv.npcCount} NPC · 目标 ${lv.targetScore}</span>
            </button>`,
          ).join("")}
        </div>

        <p class="level-blurb" data-blurb>${LEVELS[0].blurb}</p>

        <div class="menu-actions">
          <a class="play-btn" href="#play" data-play role="button">Play</a>
          <p class="hint">方向键 / WASD 移动 · 空格暂停 · 吃到目标分数通关</p>
        </div>
      </section>

      <div class="banner" data-banner hidden>
        <div class="banner-card">
          <h2 data-banner-title>暂停</h2>
          <p data-banner-text></p>
          <div class="banner-actions">
            <button type="button" class="play-btn compact" data-resume>继续</button>
            <button type="button" class="ghost-btn" data-restart>重开本关</button>
            <button type="button" class="ghost-btn" data-menu-btn>返回选关</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const canvas = app.querySelector<HTMLCanvasElement>("#stage")!;
const ui = app.querySelector<HTMLElement>("#ui")!;
const engine = new Engine();
const input = new Input();
const renderer = new Renderer(canvas);

const elMenu = ui.querySelector<HTMLElement>("[data-menu]")!;
const elHud = ui.querySelector<HTMLElement>("[data-hud]")!;
const elBanner = ui.querySelector<HTMLElement>("[data-banner]")!;
const elBlurb = ui.querySelector<HTMLElement>("[data-blurb]")!;
const elBannerTitle = ui.querySelector<HTMLElement>("[data-banner-title]")!;
const elBannerText = ui.querySelector<HTMLElement>("[data-banner-text]")!;

function syncLevelCards() {
  ui.querySelectorAll<HTMLButtonElement>("[data-pick]").forEach((btn) => {
    const n = Number(btn.dataset.pick);
    btn.classList.toggle("is-active", n === engine.selectedLevel);
  });
  const cfg = LEVELS[engine.selectedLevel - 1];
  elBlurb.textContent = `${cfg.label} · ${cfg.blurb}`;
}

function syncHud() {
  ui.querySelector("[data-level]")!.textContent = String(engine.levelCfg.level);
  ui.querySelector("[data-map]")!.textContent = engine.levelCfg.label;
  ui.querySelector("[data-score]")!.textContent = String(engine.score);
  ui.querySelector("[data-target]")!.textContent = String(
    engine.levelCfg.targetScore,
  );
  ui.querySelector("[data-hi]")!.textContent = String(engine.highScore);
}

function syncPhase() {
  const playing = engine.phase === "playing" || engine.phase === "paused";
  elMenu.hidden = engine.phase !== "menu";
  elHud.hidden =
    !playing && engine.phase !== "gameover" && engine.phase !== "win";
  const showBanner =
    engine.phase === "paused" ||
    engine.phase === "gameover" ||
    engine.phase === "win";
  elBanner.hidden = !showBanner;

  if (engine.phase === "paused") {
    elBannerTitle.textContent = "暂停";
    elBannerText.textContent = "呼吸一下，准备好再继续。";
    ui.querySelector<HTMLElement>("[data-resume]")!.hidden = false;
  } else if (engine.phase === "gameover") {
    elBannerTitle.textContent = "失败";
    elBannerText.textContent = `${engine.message} · 得分 ${engine.score}`;
    ui.querySelector<HTMLElement>("[data-resume]")!.hidden = true;
  } else if (engine.phase === "win") {
    elBannerTitle.textContent = "通关";
    elBannerText.textContent = `${engine.message} · 得分 ${engine.score}`;
    ui.querySelector<HTMLElement>("[data-resume]")!.hidden = true;
  }

  if (playing || engine.phase === "gameover" || engine.phase === "win") {
    syncHud();
  }
}

ui.querySelectorAll<HTMLButtonElement>("[data-pick]").forEach((btn) => {
  btn.addEventListener("click", () => {
    engine.selectLevel(Number(btn.dataset.pick));
    syncLevelCards();
  });
});

ui.querySelector("[data-play]")!.addEventListener("click", (e) => {
  e.preventDefault();
  engine.start();
  syncPhase();
});

ui.querySelector("[data-resume]")!.addEventListener("click", () => {
  if (engine.phase === "paused") engine.togglePause();
  syncPhase();
});

ui.querySelector("[data-restart]")!.addEventListener("click", () => {
  engine.start();
  syncPhase();
});

ui.querySelector("[data-menu-btn]")!.addEventListener("click", () => {
  engine.returnToMenu();
  syncPhase();
});

syncLevelCards();
syncPhase();
renderer.resize();
window.addEventListener("resize", () => renderer.resize());

let last = performance.now();
function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  for (const dir of input.consumeDirs()) {
    if (engine.phase === "playing") engine.queuePlayerDir(dir);
  }
  if (
    input.consumePause() &&
    (engine.phase === "playing" || engine.phase === "paused")
  ) {
    engine.togglePause();
    syncPhase();
  }
  if (input.consumeConfirm() && engine.phase === "menu") {
    engine.start();
    syncPhase();
  }

  const prev = engine.phase;
  engine.update(dt);
  if (engine.phase !== prev) syncPhase();
  if (engine.phase === "playing") syncHud();

  renderer.draw(engine);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
