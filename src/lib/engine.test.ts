import assert from "node:assert/strict";
import test from "node:test";
import { advise, composeCopy, containsPrice, findBanned, morningDecisions, planGuests } from "./engine";
import { clientById, products, type Product } from "./maison";
import type { Channel, Tone } from "./engine";

const channels: Channel[] = ["xiaohongshu", "wechat", "invitation", "voice"];
const tones: Tone[] = ["restrained", "heritage", "season"];

function allBodies(product: Product, occasion = "") {
  const bodies: string[] = [];
  for (const channel of channels) {
    for (const tone of tones) {
      for (const seed of [0, 1, 2]) {
        const result = composeCopy({ product, channel, tone, occasion, seed });
        for (const variant of result.variants) {
          bodies.push(`${variant.title ?? ""}\n${variant.body}`);
        }
      }
    }
  }
  return bodies;
}

test("公开与私域正文都不带价格和促销词", () => {
  for (const product of products) {
    for (const body of allBodies(product, "配偶生日，白天")) {
      assert.equal(findBanned(body).length, 0, body);
      assert.equal(containsPrice(body), false, body);
    }
  }
});

test("促销口吻会从补充里拿掉", () => {
  const result = composeCopy({
    product: products[0],
    channel: "wechat",
    tone: "restrained",
    occasion: "爆款必入，限时折扣，姐妹们冲",
    seed: 1,
  });
  const blob = result.variants.map((variant) => variant.body).join("\n");
  assert.equal(findBanned(blob).length, 0);
  assert.ok(result.removed.includes("爆款"));
  assert.ok(result.removed.includes("折扣"));
  assert.equal(blob.includes("爆款"), false);
});

test("私人场合不写进小红书", () => {
  const result = composeCopy({
    product: products[1],
    channel: "xiaohongshu",
    tone: "season",
    occasion: "配偶生日",
    seed: 0,
  });
  const blob = result.variants.map((variant) => `${variant.title}\n${variant.body}`).join("\n");
  assert.equal(blob.includes("配偶生日"), false);
  assert.ok(result.notes.some((note) => note.includes("公开内容")));
});

test("同一条件重写结果稳定，两版并不相同", () => {
  const input = {
    product: products[0],
    channel: "xiaohongshu" as const,
    tone: "heritage" as const,
    occasion: "",
    seed: 2,
  };
  const first = composeCopy(input);
  const second = composeCopy(input);
  assert.deepEqual(first.variants, second.variants);
  assert.notEqual(first.variants[0].body, first.variants[1].body);
  assert.match(first.variants[0].body, /十八个小时/);
});

test("沉默的主顾不会被建议新品", () => {
  const su = advise(clientById("su-man"));
  assert.equal(su.kind, "silence");
  assert.equal(su.scripts.short.includes("静水"), false);
  assert.equal(su.scripts.short.includes("夜航"), false);
  assert.match(su.scripts.short, /旧信夹/);
  assert.equal(advise(clientById("lin-wanning")).kind, "salon");
});

test("初识只得到故事，生日得到白天的看货", () => {
  const chen = advise(clientById("chen-shuyi"));
  assert.equal(chen.kind, "nurture");
  assert.match(chen.scripts.short, /不必来店/);
  const zhou = advise(clientById("zhou-yuan"));
  assert.equal(zhou.kind, "occasion");
  assert.match(zhou.scripts.short, /夜航/);
  assert.match(zhou.scripts.short, /白天/);
});

test("静水私享不跨城、不叫初识", () => {
  const plan = planGuests("quiet");
  const byId = Object.fromEntries(plan.map((row) => [row.clientId, row.stance]));
  assert.equal(byId["lin-wanning"], "invite");
  assert.equal(byId["jiang-wanlai"], "invite");
  assert.equal(byId["chen-shuyi"], "hold");
  assert.equal(byId["he-qinghe"], "hold");
  assert.equal(byId["zhao-qiming"], "hold");
});

test("晨会把不做也当成一件决定", () => {
  const decisions = morningDecisions({});
  assert.equal(decisions.length, 4);
  assert.equal(decisions.filter((item) => item.tone === "dont").length, 1);
  assert.match(decisions[2].title, /空 3 席/);
  const full = morningDecisions({ quiet: ["lin-wanning", "jiang-wanlai", "extra"] });
  assert.match(full[2].title, /补满/);
});
