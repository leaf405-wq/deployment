import type { Controls } from "./input";
import { type Vec2, clamp, length, wrapAngle } from "./math";
import type { Track } from "./track";

export type SkidMark = { x: number; y: number; life: number; angle: number };

export class Car {
  x: number;
  y: number;
  angle: number;
  /** Forward speed along heading (can be slightly negative when braking reverse). */
  speed = 0;
  /** World-space velocity for sliding. */
  vx = 0;
  vy = 0;
  onTrack = true;
  /** Whether accelerate is held — used for exhaust / light FX. */
  throttleOn = false;
  braking = false;
  lap = 1;
  bestLapMs: number | null = null;
  currentLapMs = 0;
  totalMs = 0;
  finished = false;
  readonly maxLaps = 3;

  private prevProgress = 0;
  private crossedStart = false;
  private lapStartMs = 0;
  readonly skids: SkidMark[] = [];

  // Tuned arcade-realistic feel — responsive but stable
  private readonly maxSpeed = 480;
  private readonly accel = 420;
  private readonly brake = 620;
  private readonly coastDrag = 48;
  private readonly steerSpeed = 1.85;
  private readonly gripOn = 12.5;
  private readonly gripOff = 2.8;

  constructor(start: Vec2, angle: number) {
    this.x = start.x;
    this.y = start.y;
    this.angle = angle;
  }

  reset(start: Vec2, angle: number) {
    this.x = start.x;
    this.y = start.y;
    this.angle = angle;
    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.onTrack = true;
    this.throttleOn = false;
    this.braking = false;
    this.lap = 1;
    this.bestLapMs = null;
    this.currentLapMs = 0;
    this.totalMs = 0;
    this.finished = false;
    this.prevProgress = 0;
    this.crossedStart = false;
    this.lapStartMs = 0;
    this.skids.length = 0;
  }

  get speedKmh(): number {
    return Math.abs(this.speed) * 0.36;
  }

  update(dt: number, controls: Controls, track: Track) {
    if (this.finished) {
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.speed *= 0.96;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      return;
    }

    this.totalMs += dt * 1000;
    this.currentLapMs = this.totalMs - this.lapStartMs;

    const query = track.query({ x: this.x, y: this.y });
    this.onTrack = query.onTrack;

    const throttle = controls.up ? 1 : 0;
    const braking = controls.down ? 1 : 0;
    this.throttleOn = throttle > 0;
    this.braking = braking > 0;
    const steerInput = (controls.left ? -1 : 0) + (controls.right ? 1 : 0);

    // Speed-sensitive steering: tighter at low speed, calmer at high
    const speedRatio = clamp(Math.abs(this.speed) / this.maxSpeed, 0, 1);
    const steerScale = (0.55 + speedRatio * 0.7) * (1.05 - speedRatio * 0.55);
    if (Math.abs(this.speed) > 12) {
      this.angle +=
        steerInput * this.steerSpeed * steerScale * Math.sign(this.speed) * dt;
      this.angle = wrapAngle(this.angle);
    } else if (throttle && steerInput) {
      // Gentle crawl turn while launching
      this.angle += steerInput * this.steerSpeed * 0.35 * dt;
      this.angle = wrapAngle(this.angle);
    }

    if (throttle) {
      this.speed += this.accel * (this.onTrack ? 1 : 0.45) * dt;
    }
    if (braking) {
      if (this.speed > 0) {
        this.speed -= this.brake * dt;
      } else {
        this.speed -= this.accel * 0.35 * dt; // light reverse
      }
    }
    if (!throttle && !braking) {
      const drag = this.coastDrag + Math.abs(this.speed) * 0.08;
      if (this.speed > 0) this.speed = Math.max(0, this.speed - drag * dt);
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + drag * dt);
    }

    const softMax = this.onTrack ? this.maxSpeed : this.maxSpeed * 0.42;
    this.speed = clamp(this.speed, -softMax * 0.25, softMax);

    const forwardX = Math.cos(this.angle);
    const forwardY = Math.sin(this.angle);
    const desiredVx = forwardX * this.speed;
    const desiredVy = forwardY * this.speed;

    const grip = this.onTrack ? this.gripOn : this.gripOff;
    // Lateral slip: blend velocity toward facing direction
    this.vx += (desiredVx - this.vx) * Math.min(1, grip * dt);
    this.vy += (desiredVy - this.vy) * Math.min(1, grip * dt);

    // Extra off-track friction
    if (!this.onTrack) {
      this.vx *= 1 - 1.8 * dt;
      this.vy *= 1 - 1.8 * dt;
      this.speed *= 1 - 1.2 * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Sync scalar speed with projection of velocity
    this.speed = this.vx * forwardX + this.vy * forwardY;

    // Skid marks when sliding hard
    const lateral =
      -this.vx * forwardY + this.vy * forwardX;
    if (this.onTrack && Math.abs(lateral) > 90 && Math.abs(this.speed) > 120) {
      if (this.skids.length > 400) this.skids.shift();
      this.skids.push({
        x: this.x - forwardX * 16,
        y: this.y - forwardY * 16,
        life: 1,
        angle: this.angle,
      });
    }
    for (let i = this.skids.length - 1; i >= 0; i--) {
      this.skids[i].life -= dt * 0.35;
      if (this.skids[i].life <= 0) this.skids.splice(i, 1);
    }

    this.updateLap(query.progress);
  }

  private updateLap(progress: number) {
    // Detect crossing start/finish: progress wraps near 0 after being high
    if (!this.crossedStart && progress > 0.05 && progress < 0.5) {
      this.crossedStart = true;
    }
    if (this.crossedStart && this.prevProgress > 0.75 && progress < 0.2) {
      const lapTime = this.totalMs - this.lapStartMs;
      if (this.lap >= 1 && lapTime > 2000) {
        if (this.bestLapMs === null || lapTime < this.bestLapMs) {
          this.bestLapMs = lapTime;
        }
        if (this.lap >= this.maxLaps) {
          this.finished = true;
        } else {
          this.lap += 1;
          this.lapStartMs = this.totalMs;
        }
      }
    }
    this.prevProgress = progress;
  }

  heading(): Vec2 {
    return { x: Math.cos(this.angle), y: Math.sin(this.angle) };
  }

  velocityLen(): number {
    return length({ x: this.vx, y: this.vy });
  }
}
