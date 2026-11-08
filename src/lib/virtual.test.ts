import assert from "node:assert/strict";
import test from "node:test";
import { products } from "./maison";
import { stores } from "./twin";
import { buildVirtual, editionScript, guideLines, guestsFor } from "./virtual";

test("同一分钟的虚拟层不变，顾问名册不跟着分钟换", () => {
  const store = stores.find((item) => item.id === "sh-huaihai");
  assert.ok(store);
  const once = buildVirtual(store, stores, "202611081208");
  const twice = buildVirtual(store, stores, "202611081208");
  assert.deepEqual(once.fixtures.map((fixture) => fixture.onHand), twice.fixtures.map((fixture) => fixture.onHand));
  assert.deepEqual(once.advisors.map((advisor) => advisor.name), twice.advisors.map((advisor) => advisor.name));
  assert.deepEqual(once.editions, buildVirtual(store, stores, "other-minute").editions);
  assert.deepEqual(
    once.advisors.map((advisor) => advisor.name),
    buildVirtual(store, stores, "other-minute").advisors.map((advisor) => advisor.name),
  );
  const base = once.fixtures.map((fixture) => fixture.onHand).join(",");
  const changed = ["a", "b", "c", "d", "e"].some(
    (key) => buildVirtual(store, stores, key).fixtures.map((fixture) => fixture.onHand).join(",") !== base,
  );
  assert.equal(changed, true);
});

test("四间样本守住柜位、排队、十二只和方案", () => {
  for (const store of stores) {
    const scene = buildVirtual(store, stores, "202611081208");
    const size = store.tier === "旗舰" ? 5 : store.tier === "预约室" ? 2 : 3;
    assert.equal(scene.advisors.length, size);
    assert.equal(new Set(scene.advisors.map((advisor) => advisor.name)).size, size);
    for (const advisor of scene.advisors) {
      assert.ok(advisor.converted <= advisor.served);
      assert.ok(advisor.minutes >= 0);
    }
    for (const fixture of scene.fixtures) {
      assert.ok(fixture.onHand >= 0 && fixture.onHand <= fixture.capacity);
      assert.equal(
        fixture.skus.reduce((acc, sku) => acc + sku.qty, 0),
        fixture.onHand,
      );
      if (fixture.onHand === 0) assert.match(fixture.issues.join(""), /柜面空了/);
    }
    assert.equal(scene.editions.length, 12);
    assert.equal(new Set(scene.editions.map((piece) => piece.serial)).size, 12);
    assert.equal(
      scene.heldHere,
      scene.editions.filter((piece) => piece.storeId === store.id && piece.state === "在柜").length,
    );
    assert.equal(scene.plans[0].id, "A");
    assert.equal(scene.plans[1].id, "B");
    assert.ok(scene.plans[0].capture > 0 && scene.plans[0].capture < 0.25);
    assert.ok(scene.plans[1].capture > 0 && scene.plans[1].capture < 0.25);
    assert.equal(scene.devices.length, 6);
    for (const ticket of scene.queue) assert.ok(ticket.wait >= 0);
    assert.equal(scene.stations.reduce((acc, station) => acc + station.people, 0), store.now.visitors);
    assert.equal(scene.reading.join("").includes("女士"), false);
  }
});

test("淮海的远程席认得名册，不给拒绝镜头的人开视频", () => {
  const huaihai = stores.find((item) => item.id === "sh-huaihai");
  const guomao = stores.find((item) => item.id === "bj-guomao");
  assert.ok(huaihai && guomao);
  const home = guestsFor(huaihai);
  assert.ok(home.some((guest) => guest.name === "林晚宁" && guest.sameHouse));
  assert.equal(home[0].tier, "密友");
  const ye = guestsFor(guomao).find((guest) => guest.name === "叶崇");
  assert.ok(ye);
  assert.equal(ye.remote, "只看实物");
  const night = products.find((item) => item.id === "night-voyage");
  assert.ok(night);
  const lines = guideLines(ye, night).map((turn) => turn.text).join("");
  assert.match(lines, /不要开镜头/);
  assert.match(lines, /镜头保持关闭/);
  const piece = buildVirtual(huaihai, stores, "t").editions[0];
  const beats = editionScript(piece);
  assert.equal(beats.length, 4);
  assert.match(beats[0].text, new RegExp(piece.serial));
});
