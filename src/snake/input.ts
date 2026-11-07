import type { Dir } from "./types";

export class Input {
  private queue: Dir[] = [];
  private pausedPressed = false;
  private confirmPressed = false;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  consumeDirs(): Dir[] {
    const q = this.queue;
    this.queue = [];
    return q;
  }

  consumePause(): boolean {
    if (!this.pausedPressed) return false;
    this.pausedPressed = false;
    return true;
  }

  consumeConfirm(): boolean {
    if (!this.confirmPressed) return false;
    this.confirmPressed = false;
    return true;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",
    };
    const dir = map[e.code];
    if (dir) {
      e.preventDefault();
      if (this.queue.length < 3) this.queue.push(dir);
      return;
    }
    if (e.code === "Space" || e.code === "KeyP") {
      e.preventDefault();
      this.pausedPressed = true;
    }
    if (e.code === "Enter") {
      e.preventDefault();
      this.confirmPressed = true;
    }
  };
}
