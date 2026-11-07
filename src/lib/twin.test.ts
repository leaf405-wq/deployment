import assert from "node:assert/strict";
import test from "node:test";
import {
  CATEGORIES,
  aov,
  askTwin,
  categoryRows,
  conversion,
  pctDelta,
  rollup,
  stores,
  twinReading,
} from "./twin";

test("五十家店的类别金额加总等于成交额", () => {
  assert.equal(stores.length, 50);
  assert.equal(new Set(stores.map((store) => store.id)).size, 50);
  for (const store of stores) {
    for (const shot of [store.now, store.then]) {
      const sum = CATEGORIES.reduce((acc, category) => acc + shot.byCategory[category], 0);
      assert.equal(sum, shot.sales);
      assert.ok(shot.buyers <= shot.visitors);
      assert.ok(shot.buyers >= 1);
      assert.ok(conversion(shot) > 0 && conversion(shot) <= 1);
    }
  }
});

test("环比用上月同刻做分母", () => {
  assert.equal(pctDelta(110, 100), 0.1);
  assert.equal(pctDelta(90, 100), -0.1);
  assert.equal(pctDelta(1, 0), null);
  const now = rollup(stores, "now");
  const then = rollup(stores, "then");
  assert.equal(
    now.sales,
    stores.reduce((acc, store) => acc + store.now.sales, 0),
  );
  assert.ok(categoryRows(stores).every((row) => row.then === then.byCategory[row.category]));
  assert.ok(aov({ visitors: 10, buyers: 2, sales: 100, churn: 0.1, byCategory: then.byCategory }) === 50);
});

test("孪生席按汇总回答，不编个人", () => {
  const reading = twinReading(stores).join("");
  assert.match(reading, /环比/);
  assert.match(reading, /流失/);
  assert.match(askTwin("上海高珠怎么样"), /上海高珠/);
  assert.match(askTwin("哪家流失最快"), /流失/);
  assert.match(askTwin("客单价"), /客单价/);
  assert.match(askTwin("随便聊聊天气"), /只按门店汇总/);
  assert.equal(askTwin("流失").includes("女士"), false);
});
