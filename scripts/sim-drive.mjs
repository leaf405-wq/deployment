/**
 * Headless drive simulation — verifies accel + staying on track with held throttle.
 */
import { Track } from "../src/game/track.ts";
import { Car } from "../src/game/car.ts";

const track = Track.generate(42);
const car = new Car(track.start, track.startAngle);
const controls = { up: true, down: false, left: false, right: false, restart: false };

const dt = 1 / 60;
let maxKmh = 0;
let offFrames = 0;
let onFrames = 0;

for (let i = 0; i < 60 * 8; i++) {
  // Gentle auto-steer toward track tangent to mimic a careful driver
  const q = track.query({ x: car.x, y: car.y });
  const heading = Math.atan2(Math.sin(car.angle), Math.cos(car.angle));
  const want = Math.atan2(q.tangent.y, q.tangent.x);
  let err = want - heading;
  while (err > Math.PI) err -= Math.PI * 2;
  while (err < -Math.PI) err += Math.PI * 2;
  controls.left = err < -0.08;
  controls.right = err > 0.08;
  // Also steer toward center if drifting wide
  if (q.distanceToCenter > q.halfWidth * 0.55) {
    const toCenter = Math.atan2(q.closest.y - car.y, q.closest.x - car.x);
    let cerr = toCenter - heading;
    while (cerr > Math.PI) cerr -= Math.PI * 2;
    while (cerr < -Math.PI) cerr += Math.PI * 2;
    if (cerr < 0) controls.left = true;
    if (cerr > 0) controls.right = true;
  }

  car.update(dt, controls, track);
  maxKmh = Math.max(maxKmh, car.speedKmh);
  if (car.onTrack) onFrames++;
  else offFrames++;
}

console.log(
  JSON.stringify(
    {
      seed: track.seed,
      halfWidth: track.halfWidth,
      totalLength: Math.round(track.totalLength),
      maxKmh: Math.round(maxKmh),
      onFrames,
      offFrames,
      lap: car.lap,
      finished: car.finished,
      ok: maxKmh > 80 && onFrames > offFrames,
    },
    null,
    2,
  ),
);
