# Neon Serpent

专业贪吃蛇：精美光影、方向键操控、NPC 自动变长，撞到 NPC 即失败。10 关地图从 `20×20` 到 `100×100`（大地图自动镜头跟随）。

## ▶ 点这里玩（公网入口）

# [Neon Serpent — Play](https://leaf405-wq.github.io/deployment/)

打开后：**选关 → 点「Play 开始游戏」**（也可双击关卡）。请用这个 GitHub Pages 链接，不要用 `127.0.0.1`。

## 操作

| 操作 | 作用 |
|------|------|
| **Play 开始游戏** | 进入当前关卡 |
| 双击关卡卡片 | 直接开打该关 |
| `↑↓←→` / `WASD` | 移动 |
| `空格` / `P` | 暂停 |

## 本地运行

```bash
npm install
npm run dev
```

构建（输出到 `docs/`，供 GitHub Pages）：

```bash
npm run build
```
