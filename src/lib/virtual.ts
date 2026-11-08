import { clients, products, type Product } from "./maison";
import { buildFloor } from "./floor";
import { aov, storeLabel, type Category, type StoreTwin, type Tier } from "./twin";

export type RoomId = "experience" | "operations" | "merch" | "brand";

export type SeatGuest = {
  id: string;
  name: string;
  addressAs: string;
  tier: string;
  avoid: string[];
  notes: string;
  preferences: string[];
  sameHouse: boolean;
  remote: "可接通" | "只看实物";
};

export type GuideTurn = {
  speaker: "顾问" | "客人";
  text: string;
};

export type Station = {
  id: string;
  label: string;
  category: Category | null;
  x: number;
  y: number;
  w: number;
  h: number;
  people: number;
  piece: string | null;
  line: string;
};

export type Advisor = {
  id: string;
  name: string;
  status: "接待中" | "空闲" | "送客" | "远程";
  withGuest: string | null;
  minutes: number;
  served: number;
  converted: number;
  focus: Category;
};

export type QueueTicket = {
  id: string;
  label: string;
  kind: "预约" | "路过";
  wait: number;
  advisor: string;
};

export type DeviceState = "正常" | "留意" | "离线";

export type Device = {
  id: string;
  name: string;
  zone: string;
  state: DeviceState;
  detail: string;
};

export type FixtureSku = {
  name: string;
  qty: number;
};

export type Fixture = {
  id: string;
  label: string;
  category: Category;
  capacity: number;
  onHand: number;
  facings: number;
  required: number;
  issues: string[];
  skus: FixtureSku[];
};

export type DisplayPlan = {
  id: "A" | "B";
  name: string;
  move: string;
  capture: number;
  aov: number;
  units: number;
  dwell: number;
  note: string;
};

export type TourStop = {
  city: string;
  storeName: string;
  title: string;
  status: "在展" | "下一站" | "线路上";
  chapter: string;
};

export type EditionPiece = {
  serial: string;
  state: "在柜" | "已配" | "巡展";
  place: string;
  storeId: string | null;
};

export type Exhibit = {
  id: string;
  title: string;
  kicker: string;
  body: string;
};

export type VirtualScene = {
  occupants: number;
  stations: Station[];
  guests: SeatGuest[];
  featuredId: string;
  advisors: Advisor[];
  paths: {
    id: string;
    name: string;
    meters: number;
    share: number;
    buyers: number;
    category: Category;
    points: [number, number][];
  }[];
  pathNote: string;
  queue: QueueTicket[];
  queueNote: string;
  devices: Device[];
  fixtures: Fixture[];
  plans: [DisplayPlan, DisplayPlan];
  tour: TourStop[];
  editions: EditionPiece[];
  heldHere: number;
  exhibits: Exhibit[];
  exhibitNow: string;
  launch: { name: string; line: string; story: string; craft: string; heldHere: number; total: number };
  reading: string[];
};

const NAMES = ["沈照", "顾晚", "宋迟", "裴宁", "江澄", "陆衡", "许安", "程叙"];

const SKUS: Record<Category, string[]> = {
  手袋: ["静水 No.07", "静水浅棕", "日常提"],
  高珠: ["夜航", "冬青"],
  小皮具: ["旧信夹", "名片匣"],
  丝巾: ["香径", "页边"],
  表带: ["旅人表带", "短吻深棕"],
};

const DEVICES: { id: string; name: string; zone: string }[] = [
  { id: "lock", name: "高珠柜锁", zone: "高珠" },
  { id: "cam-door", name: "入口摄像", zone: "入口" },
  { id: "cam-floor", name: "客席摄像", zone: "中岛" },
  { id: "climate", name: "恒温", zone: "全店" },
  { id: "light", name: "橱窗射灯", zone: "橱窗" },
  { id: "door", name: "门磁", zone: "入口" },
];

const EXHIBITS: Exhibit[] = [
  {
    id: "log",
    title: "一九二四年日志",
    kicker: "工坊",
    body: "手袋的名字取自工坊窗外那条不结冰的水沟。日志页边的植物后来被描成香径，正反纹样相差一度。",
  },
  {
    id: "night",
    title: "夜航名册",
    kicker: "一九二六年",
    body: "一张夜航船的乘客名册夹在图纸里。戒指沿用旧切工，不改成更亮的现代切割，也不在聚光灯下试戴。",
  },
  {
    id: "holly",
    title: "冬青园",
    kicker: "园子",
    body: "冬青是工坊园子里唯一被留下的植物。石榴石按图纸逐颗挑，不修成完全对称。这一间不拍佩戴。",
  },
  {
    id: "letter",
    title: "旧信",
    kicker: "巴黎与工坊",
    body: "小皮具最早用来夹工坊与巴黎店之间的信。字母若要烫，只烫在内里。礼赠的信单独手写。",
  },
];

const TOUR: { city: string; id: string; title: string; chapter: string }[] = [
  { city: "上海", id: "sh-huaihai", title: "日志页", chapter: "工坊窗外的水，被写成手袋的名字。展柜里只放静水，不放价格牌。" },
  { city: "北京", id: "bj-skp", title: "夜航名册", chapter: "切工不改亮。预约在白天，名册翻开到那一页就停。" },
  { city: "成都", id: "cd-taikoo", title: "冬青园", chapter: "石头不修成完全对称。展厅用园子的绿，不用节日红。" },
  { city: "杭州", id: "hz-tower", title: "香径", chapter: "纹样描自日志页边。正反可以都看，不解释成当季印花。" },
  { city: "深圳", id: "sz-mixc", title: "旧信", chapter: "外观不出现标记。想看字母的人，把夹子打开。" },
  { city: "西安", id: "xa-skp", title: "旅人", chapter: "不配新表。墙上是旧表壳的取样图，不是新品海报。" },
];

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function apportion(weights: number[], total: number) {
  if (total <= 0) return weights.map(() => 0);
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  if (sum <= 0) return weights.map((_, index) => (index === 0 ? total : 0));
  const raw = weights.map((weight) => (total * weight) / sum);
  const base = raw.map((value) => Math.floor(value));
  let left = total - base.reduce((acc, value) => acc + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - base[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  while (left > 0) {
    for (const item of order) {
      if (left === 0) break;
      base[item.index] += 1;
      left -= 1;
    }
  }
  return base;
}

function sameHouse(clientStore: string, storeName: string) {
  return clientStore === storeName || storeName.includes(clientStore) || clientStore.includes(storeName);
}

function wantsStill(avoid: string[]) {
  return avoid.some((item) => /视频|直播|镜头|佩戴/.test(item));
}

export function guestsFor(store: StoreTwin): SeatGuest[] {
  const city = clients.filter((client) => client.city === store.city);
  const home = city.filter((client) => sameHouse(client.store, store.name));
  const list = home.length > 0 ? home : city;
  if (list.length === 0) {
    return [
      {
        id: `${store.id}-walkin`,
        name: "到店访客",
        addressAs: "客人",
        tier: "初识",
        avoid: [],
        notes: "名册上没有这位。先问称呼，再决定取出哪一只。",
        preferences: [],
        sameHouse: true,
        remote: "可接通",
      },
    ];
  }
  return list
    .map((client) => ({
      id: client.id,
      name: client.name,
      addressAs: client.addressAs,
      tier: client.tier,
      avoid: client.avoid,
      notes: client.notes,
      preferences: client.preferences,
      sameHouse: sameHouse(client.store, store.name),
      remote: wantsStill(client.avoid) ? ("只看实物" as const) : ("可接通" as const),
    }))
    .sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || a.name.localeCompare(b.name, "zh"));
}

function tierRank(tier: string) {
  if (tier === "密友") return 0;
  if (tier === "主顾") return 1;
  return 2;
}

export function guideLines(guest: SeatGuest, product: Product): GuideTurn[] {
  const turns: GuideTurn[] = [
    { speaker: "顾问", text: `${guest.addressAs}，这一只是${product.name}。${product.publicLine}` },
    { speaker: "顾问", text: `${product.material}。${product.craft}` },
  ];
  if (guest.remote === "只看实物") {
    turns.push({ speaker: "客人", text: "不要开镜头。" });
    turns.push({ speaker: "顾问", text: "镜头保持关闭。只把实物转到灯下，不录试戴。" });
    return turns;
  }
  if (guest.avoid.length > 0) {
    turns.push({ speaker: "顾问", text: `这次不提${guest.avoid[0]}。` });
  }
  turns.push({ speaker: "客人", text: product.wear });
  if (guest.avoid.length === 0) turns.push({ speaker: "顾问", text: product.story });
  return turns;
}

export function editionScript(piece: EditionPiece): { title: string; text: string }[] {
  const quiet = products.find((item) => item.id === "quiet-water");
  const craft = quiet?.craft ?? "手柄由一名工匠缝十八个小时。";
  const where =
    piece.state === "在柜"
      ? `它现在在${piece.place}。`
      : piece.state === "已配"
        ? "这一只已经有主人，柜上留着编号。"
        : "这一只跟着巡展走，不在固定的柜子里。";
  return [
    { title: "入席", text: `${piece.serial} 放在房间中央。${where}` },
    { title: "灯", text: "只有一只灯，打在手柄上。边缘不涂厚漆。" },
    { title: "上手", text: piece.state === "已配" ? "不再从柜里取出。工艺留在故事里。" : craft },
    { title: "离开", text: "这一年只做十二只。看完不必留下名字。" },
  ];
}

function rosterSize(tier: Tier) {
  if (tier === "旗舰") return 5;
  if (tier === "预约室") return 2;
  return 3;
}

function capacityFor(tier: Tier, category: Category) {
  if (tier === "预约室") return category === "高珠" ? 4 : 3;
  if (tier === "旗舰") return category === "手袋" || category === "高珠" ? 8 : 5;
  return category === "手袋" ? 6 : 4;
}

function clampCapture(value: number) {
  return Math.round(Math.min(0.24, Math.max(0.012, value)) * 1000) / 1000;
}

export function buildVirtual(store: StoreTwin, list: StoreTwin[], minuteKey = "base"): VirtualScene {
  const floor = buildFloor(store, list, minuteKey);
  const wave = mulberry32(hash(`${store.id}:virtual:${minuteKey}`));
  const stable = mulberry32(hash(`${store.id}:virtual-stable`));
  const guests = guestsFor(store);
  const people = apportion(
    floor.zones.map((zone) => zone.dwellShare),
    store.now.visitors,
  );

  const fixtureSeed = new Map<string, { onHand: number; skus: FixtureSku[]; piece: string | null }>();
  const fixtures: Fixture[] = [];
  for (const zone of floor.zones) {
    if (!zone.category) continue;
    const capacity = capacityFor(store.tier, zone.category);
    const roll = mulberry32(hash(`${store.id}:${zone.id}:${minuteKey}`));
    const onHand = capacity - Math.floor(roll() * (capacity + 1));
    const names = SKUS[zone.category];
    const qty = apportion(
      names.map(() => 1),
      onHand,
    );
    const skus = names.map((name, index) => ({ name, qty: qty[index] }));
    const piece = skus.find((sku) => sku.qty > 0)?.name ?? null;
    fixtureSeed.set(zone.id, { onHand, skus, piece });
    const required = Math.max(2, Math.round(capacity / 2));
    const facings = Math.min(required, onHand);
    const issues: string[] = [];
    if (onHand === 0) issues.push("柜面空了，需要从库房补。");
    else if (onHand < Math.ceil(capacity * 0.25)) issues.push("只剩零星，远看像空柜。");
    if (facings < required) issues.push(`陈列面 ${facings}，图纸要求 ${required}。`);
    if (roll() < 0.28) {
      issues.push(zone.category === "高珠" ? "射灯没有打在台面中心。" : "叠放层次和图纸不一致。");
    }
    fixtures.push({
      id: zone.id,
      label: zone.label,
      category: zone.category,
      capacity,
      onHand,
      facings,
      required,
      issues,
      skus,
    });
  }

  const stations: Station[] = floor.zones.map((zone, index) => {
    const stock = fixtureSeed.get(zone.id);
    const piece = stock?.piece ?? null;
    const count = people[index];
    const line = !zone.category
      ? count > 0
        ? `${zone.label}这一分钟有 ${count} 人停留。这里不放货。`
        : `${zone.label}这一分钟是空的。`
      : piece
        ? `${zone.label}柜上是${piece}。这一分钟 ${count} 人停在这里。`
        : `${zone.label}这一分钟没有货。`;
    return {
      id: zone.id,
      label: zone.label,
      category: zone.category,
      x: zone.x,
      y: zone.y,
      w: zone.w,
      h: zone.h,
      people: count,
      piece,
      line,
    };
  });

  const names = Array.from({ length: rosterSize(store.tier) }, (_, index) => NAMES[(hash(store.id) + index) % NAMES.length]);
  const statuses: Advisor["status"][] = ["接待中", "远程", "空闲", "送客", "接待中"];
  const focuses: Category[] = ["手袋", "高珠", "丝巾", "小皮具", "表带"];
  const advisors: Advisor[] = names.map((name, index) => {
    const status = statuses[(index + Math.floor(wave() * 3)) % statuses.length];
    const served = 3 + Math.floor(stable() * 6) + Math.floor(wave() * 2);
    const converted = Math.min(served, Math.max(0, Math.round(served * (0.18 + wave() * 0.45))));
    const guest = guests[index % guests.length];
    return {
      id: `${store.id}-ba-${index}`,
      name,
      status,
      withGuest: status === "空闲" ? null : guest.name,
      minutes: status === "空闲" ? 0 : 4 + Math.floor(wave() * 22),
      served,
      converted,
      focus: focuses[index % focuses.length],
    };
  });

  const queueCount =
    store.tier === "预约室" ? (wave() < 0.45 ? 0 : 1) : Math.min(6, Math.max(0, Math.round(store.now.visitors / (store.tier === "旗舰" ? 16 : 14))));
  const queue: QueueTicket[] = Array.from({ length: queueCount }, (_, index) => {
    const booked = store.tier === "预约室" || wave() > 0.42;
    const guest = guests[index % guests.length];
    const kind: QueueTicket["kind"] = booked ? "预约" : "路过";
    return {
      id: `${store.id}-q-${index}`,
      label: booked ? guest.name : "路过的人",
      kind,
      wait: (booked ? 4 : 8) + Math.floor(wave() * (booked ? 8 : 14)),
      advisor: names[index % names.length],
    };
  }).sort((a, b) => Number(a.kind === "路过") - Number(b.kind === "路过") || a.wait - b.wait);

  const queueNote =
    store.tier === "预约室"
      ? queue.length
        ? "预约室不叫号。门厅有一位在等顾问从里面出来。"
        : "预约室不叫号。这一分钟门厅是空的。"
      : queue.length
        ? `${queue.length} 位在等，最长 ${Math.max(...queue.map((item) => item.wait))} 分钟。预约排在路过前面。`
        : "门口没有人在等。";

  const devices: Device[] = DEVICES.map((device) => {
    const roll = wave();
    const state: DeviceState = roll < 0.06 ? "离线" : roll < 0.22 ? "留意" : "正常";
    const detail =
      state === "离线"
        ? "这一分钟没有回传。"
        : state === "留意"
          ? device.id === "climate"
            ? "偏暖一度。"
            : device.id === "light"
              ? "射灯偏左，高珠台面发暗。"
              : device.id === "lock"
                ? "门缝没有复位。"
                : device.id === "door"
                  ? "人流挡住门磁。"
                  : "画面有反光。"
          : device.id === "climate"
            ? "二十二度。"
            : device.id === "lock"
              ? "锁舌到位。"
              : "回传正常。";
    return { ...device, state, detail };
  });

  const paths = floor.paths.map((path) => ({
    id: path.id,
    name: path.name,
    meters: path.meters,
    share: path.share,
    buyers: path.buyers,
    category: path.category,
    points: path.points,
  }));
  const busiest = stations.reduce((best, station) => (station.people > best.people ? station : best));
  const farthest = paths.reduce((best, path) => (path.meters > best.meters ? path : best));
  const richest = paths.reduce((best, path) => (path.buyers > best.buyers ? path : best));
  const pathNote =
    farthest.id === richest.id
      ? `人最多的是${busiest.label}，${busiest.people} 人。「${farthest.name}」又远又出货，${farthest.meters.toFixed(1)} 米，${farthest.buyers} 笔。`
      : `人最多的是${busiest.label}，${busiest.people} 人。走得最远的是「${farthest.name}」，${farthest.meters.toFixed(1)} 米；出货最多的是「${richest.name}」，${richest.buyers} 笔。`;

  const ticket = aov(store.now);
  const units = store.now.buyers === 0 ? 0 : floor.units / store.now.buyers;
  const dwellShare = (category: Category) => {
    const station = stations.find((item) => item.category === category);
    return !station || store.now.visitors === 0 ? 0 : station.people / store.now.visitors;
  };
  const favorSilk = hash(store.id) % 2 === 0;
  const plans: [DisplayPlan, DisplayPlan] = [
    {
      id: "A",
      name: "沿用图纸",
      move: "高珠留在深处，手袋守在中岛。",
      capture: floor.capture,
      aov: ticket,
      units,
      dwell: dwellShare("手袋") || dwellShare("高珠"),
      note: "这一套就是现在柜上的样子。",
    },
    favorSilk
      ? {
          id: "B",
          name: "丝巾上橱窗",
          move: "把香径放到橱窗第一眼，高珠不动。",
          capture: clampCapture(floor.capture * 1.14),
          aov: ticket * 0.92,
          units: units * 1.08,
          dwell: Math.min(0.62, dwellShare("丝巾") * 1.4 + 0.06),
          note: "进店会多一些，客单价通常被丝巾拉低。",
        }
      : {
          id: "B",
          name: "高珠前移",
          move: "高珠柜挪到进门右手，手袋退半步。",
          capture: clampCapture(floor.capture * 0.88),
          aov: ticket * 1.09,
          units: units * 0.94,
          dwell: Math.min(0.62, dwellShare("高珠") * 1.3 + 0.05),
          note: "路过的人更少走进来，进来的人看得更贵。",
        },
  ];

  const here = TOUR.findIndex((stop) => stop.city === store.city);
  const tour: TourStop[] = TOUR.map((stop, index) => {
    const found = list.find((item) => item.id === stop.id);
    const status: TourStop["status"] =
      here < 0 ? "线路上" : index === here ? "在展" : index === (here + 1) % TOUR.length ? "下一站" : "线路上";
    return {
      city: stop.city,
      storeName: found ? storeLabel(found) : `${stop.city}`,
      title: stop.title,
      status,
      chapter: stop.chapter,
    };
  });

  const editions: EditionPiece[] = Array.from({ length: 12 }, (_, index) => {
    const serial = `No.${String(index + 1).padStart(2, "0")}`;
    const rand = mulberry32(hash(`quiet-water:${serial}`));
    const host = list[Math.floor(rand() * list.length)] ?? store;
    const roll = rand();
    const state: EditionPiece["state"] = roll < 0.42 ? "在柜" : roll < 0.74 ? "已配" : "巡展";
    return {
      serial,
      state,
      place: state === "巡展" ? "随巡展" : storeLabel(host),
      storeId: state === "巡展" ? null : host.id,
    };
  });
  const heldHere = editions.filter((piece) => piece.storeId === store.id && piece.state === "在柜").length;
  const quiet = products.find((item) => item.id === "quiet-water") ?? products[0];
  const featuredId = products[hash(`${store.id}:${minuteKey}`) % products.length].id;
  const stockouts = fixtures.filter((fixture) => fixture.onHand === 0);
  const warns = devices.filter((device) => device.state !== "正常");

  return {
    occupants: store.now.visitors,
    stations,
    guests,
    featuredId,
    advisors,
    paths,
    pathNote,
    queue,
    queueNote,
    devices,
    fixtures,
    plans,
    tour,
    editions,
    heldHere,
    exhibits: EXHIBITS,
    exhibitNow: EXHIBITS[hash(minuteKey) % EXHIBITS.length].id,
    launch: {
      name: quiet.name,
      line: quiet.publicLine,
      story: quiet.story,
      craft: quiet.craft,
      heldHere,
      total: 12,
    },
    reading: [
      `${storeLabel(store)}的虚拟门店这一分钟有 ${store.now.visitors} 人。`,
      queueNote,
      stockouts.length ? `空柜：${stockouts.map((fixture) => fixture.label).join("、")}。` : "柜上没有空位。",
      warns.length ? `设备有 ${warns.length} 项要看：${warns.map((device) => device.name).join("、")}。` : "锁、摄像、恒温都在正常回传。",
      here < 0 ? `${store.city}不设巡展。静水十二只，这一家在柜 ${heldHere} 只。` : `巡展正在${store.city}。静水十二只，这一家在柜 ${heldHere} 只。`,
    ],
  };
}
