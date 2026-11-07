import assert from "node:assert/strict";
import test from "node:test";
import { minuteClock } from "./clock";
import { buildFloor } from "./floor";
import { projectNetwork } from "./live";
import { CATEGORIES, stores } from "./twin";

test("上海时刻对齐到分钟，上月同日同时作为对照", () => {
  const clock = minuteClock(new Date("2026-11-07T13:41:22Z"));
  assert.equal(clock.label, "2026.11.07 21:41");
  assert.equal(clock.compared, "2026.10.07 21:41");
  assert.equal(clock.key, "202611072141");
  assert.equal(clock.thenKey, "202610072141");
  assert.equal(clock.elapsed, 22);
  const monthEnd = minuteClock(new Date("2026-03-31T02:05:00Z"));
  assert.equal(monthEnd.label, "2026.03.31 10:05");
  assert.equal(monthEnd.compared, "2026.02.28 10:05");
});

test("每一分钟的投影都对得上账，而且会变", () => {
  const now = { key: "202611072141", thenKey: "202610072141" };
  const next = { key: "202611072142", thenKey: "202610072142" };
  const first = projectNetwork(stores, now);
  const second = projectNetwork(stores, next);
  assert.deepEqual(projectNetwork(stores, now), first);
  assert.ok(first.some((store, index) => store.now.visitors !== second[index].now.visitors || store.now.sales !== second[index].now.sales));
  for (const store of first) {
    for (const shot of [store.now, store.then]) {
      assert.ok(shot.buyers >= 1 && shot.buyers <= shot.visitors);
      assert.equal(
        CATEGORIES.reduce((acc, category) => acc + shot.byCategory[category], 0),
        shot.sales,
      );
    }
  }
  const floorA = buildFloor(first[0], first, now.key);
  const floorB = buildFloor(first[0], first, next.key);
  assert.ok(floorA.zones.some((zone, index) => zone.dwellShare !== floorB.zones[index].dwellShare));
  assert.equal(buildFloor(stores[0], stores).passers, buildFloor(stores[0], stores, "base").passers);
});
