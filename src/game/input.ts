export type Controls = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  restart: boolean;
};

export class Input {
  readonly state: Controls = {
    up: false,
    down: false,
    left: false,
    right: false,
    restart: false,
  };

  private restartPressed = false;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  /** True once per R press. */
  consumeRestart(): boolean {
    if (this.restartPressed) {
      this.restartPressed = false;
      return true;
    }
    return false;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        e.preventDefault();
        this.state.up = true;
        break;
      case "ArrowDown":
      case "KeyS":
        e.preventDefault();
        this.state.down = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        e.preventDefault();
        this.state.left = true;
        break;
      case "ArrowRight":
      case "KeyD":
        e.preventDefault();
        this.state.right = true;
        break;
      case "KeyR":
        e.preventDefault();
        this.restartPressed = true;
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.state.up = false;
        break;
      case "ArrowDown":
      case "KeyS":
        this.state.down = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.state.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.state.right = false;
        break;
    }
  };
}
