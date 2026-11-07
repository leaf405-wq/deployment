# Neon Serpent

专业贪吃蛇：精美光影、方向键操控、NPC 自动变长，撞到 NPC 即失败。10 关地图从 `20×20` 到 `100×100`。

## Play

### 点这里直接玩（公网可点）

# [▶ Neon Serpent — Play](https://leaf405-wq.github.io/deployment/)

备用同址：https://leaf405-wq.github.io/deployment/index.html

> 不要用 `127.0.0.1` / 本机预览链接——那只在开发机内部有效。请用上面的 GitHub Pages 地址。

打开后：选关 → 点页面上的 **Play** → 方向键 / WASD 游玩。

## 操作

| 按键 | 作用 |
|------|------|
| **Play** | 开始当前选中关卡 |
| `↑↓←→` / `WASD` | 移动 |
| `空格` / `P` | 暂停 |

## 本地运行

```bash
npm install
npm run dev
```

构建静态站（输出到 `docs/`，已用于 GitHub Pages）：

```bash
npm run build
```
