import assert from "node:assert/strict";
import test from "node:test";
import { buildFloor, floorAnswer } from "./floor";
import { stores } from "./twin";

test("每家店的进店占比、路程和客单量都能对上", () => {
  for (const store of stores) {
    const floor = buildFloor(store, stores);
    assert.ok(floor.passers > store.now.visitors);
    assert.ok(floor.capture > 0 && floor.capture < 0.25);
    assert.ok(Math.abs(floor.paths.reduce((acc, path) => acc + path.share, 0) - 1) < 1e-9);
    assert.equal(
      floor.paths.reduce((acc, path) => acc + path.buyers, 0),
      store.now.buyers,
    );
    assert.equal(
      floor.pieces.reduce((acc, piece) => acc + piece.units, 0),
      floor.units,
    );
    assert.ok(floor.units >= store.now.buyers);
    assert.ok(floor.avgMeters > 6 && floor.avgMeters < 55);
    assert.equal(floor.heat.length, 32);
    assert.equal(Math.max(...floor.heat.flat()), 1);
    assert.ok(floor.heat.flat().every((value) => value >= 0 && value <= 1));
    if (store.tier === "旗舰") assert.ok(floor.capture > 0.06);
    if (store.tier === "预约室") assert.ok(floor.capture < 0.07);
  }
  const again = buildFloor(stores[0], stores);
  assert.equal(again.passers, buildFloor(stores[0], stores).passers);
});

test("一座城市里各店的到店占比加总为一", () => {
  const shanghai = stores.filter((store) => store.city === "上海");
  const sum = shanghai.reduce((acc, store) => acc + buildFloor(store, stores).cityShare, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
  const flagship = buildFloor(stores.find((store) => store.id === "sh-huaihai")!, stores);
  const salon = buildFloor(stores.find((store) => store.id === "sh-lujiazui")!, stores);
  assert.notEqual(flagship.passers, salon.passers);
  assert.match(flagship.reading.join(""), /进店占比/);
  assert.match(flagship.reading.join(""), /米/);
  assert.match(flagship.reading.join(""), /客单量/);
  assert.equal(flagship.reading.join("").includes("女士"), false);
});

test("问平面才回答店内，不问就不抢孪生席的话", () => {
  const answer = floorAnswer("淮海旗舰进店多少，店里怎么走") ?? "";
  assert.match(answer, /淮海旗舰/);
  assert.match(answer, /进店占比/);
  assert.match(answer, /客单量/);
  assert.equal(floorAnswer("随便聊聊天气"), null);
  assert.match(floorAnswer("上海的热力") ?? "", /上海/);
});
