import {
  CATEGORIES,
  aov,
  formatPct,
  formatRate,
  pctDelta,
  storeLabel,
  stores,
  twinYuan,
  type Category,
  type StoreTwin,
  type Tier,
} from "./twin";

export const SHOP_PLATE = { x: 6, y: 7, w: 88, h: 68 };

const HEAT_COLS = 40;
const HEAT_ROWS = 32;

const PIECE_PRICE: Record<Category, number> = {
  手袋: 32000,
  高珠: 96000,
  小皮具: 7800,
  丝巾: 4600,
  表带: 3600,
};

type ZoneDef = {
  id: string;
  label: string;
  category: Category | null;
  x: number;
  y: number;
  w: number;
  h: number;
  dwell: number;
};

type PathDef = {
  id: string;
  name: string;
  points: [number, number][];
  meters: number;
  pull: number;
  category: Category;
};

export type FloorZone = ZoneDef & { dwellShare: number };

export type FloorPath = {
  id: string;
  name: string;
  points: [number, number][];
  share: number;
  meters: number;
  buyers: number;
  category: Category;
};

export type FloorPiece = {
  category: Category;
  units: number;
  sales: number;
};

export type FloorTwin = {
  passers: number;
  capture: number;
  thenCapture: number;
  cityShare: number;
  thenCityShare: number;
  avgMeters: number;
  thenAvgMeters: number;
  units: number;
  thenUnits: number;
  zones: FloorZone[];
  paths: FloorPath[];
  pieces: FloorPiece[];
  heat: number[][];
  habit: string;
  reading: string[];
};

const LAYOUTS: Record<Tier, { zones: ZoneDef[]; paths: PathDef[] }> = {
  旗舰: {
    zones: [
      { id: "window", label: "橱窗", category: null, x: 10, y: 10, w: 80, h: 9, dwell: 0.07 },
      { id: "door", label: "入口", category: null, x: 38, y: 21, w: 24, h: 7, dwell: 0.09 },
      { id: "silk", label: "丝巾", category: "丝巾", x: 10, y: 32, w: 22, h: 14, dwell: 0.11 },
      { id: "bags", label: "手袋", category: "手袋", x: 36, y: 31, w: 28, h: 16, dwell: 0.22 },
      { id: "small", label: "小皮具", category: "小皮具", x: 68, y: 32, w: 22, h: 14, dwell: 0.11 },
      { id: "jewelry", label: "高珠", category: "高珠", x: 10, y: 52, w: 30, h: 16, dwell: 0.16 },
      { id: "try", label: "试戴", category: "高珠", x: 44, y: 52, w: 18, h: 14, dwell: 0.08 },
      { id: "strap", label: "表带", category: "表带", x: 66, y: 50, w: 12, h: 12, dwell: 0.06 },
      { id: "sofa", label: "沙发", category: null, x: 66, y: 64, w: 24, h: 8, dwell: 0.1 },
    ],
    paths: [
      {
        id: "short",
        name: "直取手袋",
        points: [
          [50, 8],
          [50, 24],
          [50, 39],
          [78, 24],
        ],
        meters: 18,
        pull: 1.15,
        category: "手袋",
      },
      {
        id: "loop",
        name: "沿墙走一圈",
        points: [
          [50, 8],
          [50, 24],
          [20, 39],
          [78, 39],
          [72, 56],
          [24, 60],
          [52, 59],
          [76, 68],
        ],
        meters: 42,
        pull: 1.35,
        category: "丝巾",
      },
      {
        id: "jewel",
        name: "直奔高珠",
        points: [
          [50, 8],
          [50, 24],
          [24, 60],
          [52, 59],
        ],
        meters: 26,
        pull: 0.9,
        category: "高珠",
      },
    ],
  },
  专卖: {
    zones: [
      { id: "window", label: "橱窗", category: null, x: 12, y: 10, w: 76, h: 9, dwell: 0.08 },
      { id: "door", label: "入口", category: null, x: 40, y: 21, w: 20, h: 7, dwell: 0.1 },
      { id: "bags", label: "手袋", category: "手袋", x: 12, y: 32, w: 34, h: 16, dwell: 0.24 },
      { id: "silk", label: "丝巾", category: "丝巾", x: 52, y: 32, w: 36, h: 12, dwell: 0.14 },
      { id: "small", label: "小皮具", category: "小皮具", x: 52, y: 46, w: 16, h: 14, dwell: 0.12 },
      { id: "strap", label: "表带", category: "表带", x: 70, y: 46, w: 18, h: 14, dwell: 0.08 },
      { id: "jewelry", label: "高珠", category: "高珠", x: 12, y: 54, w: 34, h: 16, dwell: 0.16 },
      { id: "till", label: "收银", category: null, x: 70, y: 21, w: 16, h: 7, dwell: 0.08 },
    ],
    paths: [
      {
        id: "short",
        name: "进门看包",
        points: [
          [50, 8],
          [50, 24],
          [28, 40],
          [78, 24],
        ],
        meters: 13,
        pull: 1.35,
        category: "手袋",
      },
      {
        id: "loop",
        name: "把边柜走完",
        points: [
          [50, 8],
          [50, 24],
          [28, 40],
          [68, 38],
          [60, 53],
          [78, 53],
          [28, 62],
        ],
        meters: 29,
        pull: 1.1,
        category: "小皮具",
      },
      {
        id: "jewel",
        name: "只看高珠",
        points: [
          [50, 8],
          [50, 24],
          [28, 62],
        ],
        meters: 17,
        pull: 0.75,
        category: "高珠",
      },
    ],
  },
  预约室: {
    zones: [
      { id: "hall", label: "门厅", category: null, x: 28, y: 10, w: 44, h: 12, dwell: 0.14 },
      { id: "table", label: "看货", category: "手袋", x: 12, y: 28, w: 34, h: 24, dwell: 0.22 },
      { id: "jewelry", label: "高珠", category: "高珠", x: 52, y: 28, w: 34, h: 24, dwell: 0.34 },
      { id: "silk", label: "丝巾", category: "丝巾", x: 14, y: 56, w: 30, h: 12, dwell: 0.1 },
      { id: "strap", label: "表带", category: "表带", x: 52, y: 56, w: 14, h: 12, dwell: 0.06 },
      { id: "sofa", label: "沙发", category: null, x: 68, y: 56, w: 18, h: 12, dwell: 0.14 },
    ],
    paths: [
      {
        id: "short",
        name: "入座看货",
        points: [
          [50, 8],
          [50, 16],
          [28, 40],
          [28, 62],
        ],
        meters: 9,
        pull: 0.8,
        category: "手袋",
      },
      {
        id: "jewel",
        name: "高珠试戴",
        points: [
          [50, 8],
          [50, 16],
          [68, 40],
          [58, 62],
        ],
        meters: 14,
        pull: 1.6,
        category: "高珠",
      },
      {
        id: "loop",
        name: "坐一会儿",
        points: [
          [50, 8],
          [50, 16],
          [28, 40],
          [68, 40],
          [76, 62],
        ],
        meters: 16,
        pull: 0.7,
        category: "丝巾",
      },
    ],
  },
};

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

function passersFor(visitors: number, tier: Tier, rand: () => number) {
  const [low, high] = tier === "旗舰" ? [0.07, 0.16] : tier === "预约室" ? [0.018, 0.045] : [0.04, 0.11];
  const rate = low + rand() * (high - low);
  const passers = Math.max(visitors + 3, Math.round(visitors / rate));
  return { passers, capture: visitors / passers };
}

function unitCount(buyers: number, tier: Tier, rand: () => number) {
  const base = tier === "预约室" ? 1.08 : tier === "旗舰" ? 1.45 : 1.25;
  const spread = tier === "预约室" ? 0.22 : 0.5;
  return Math.max(buyers, Math.round(buyers * (base + rand() * spread)));
}

function distanceToPath(px: number, py: number, points: [number, number][]) {
  let best = Number.POSITIVE_INFINITY;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [ax, ay] = points[index];
    const [bx, by] = points[index + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const len = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
}

function heatGrid(zones: FloorZone[], paths: FloorPath[]) {
  const grid = Array.from({ length: HEAT_ROWS }, () => Array.from({ length: HEAT_COLS }, () => 0));
  for (let row = 0; row < HEAT_ROWS; row += 1) {
    for (let col = 0; col < HEAT_COLS; col += 1) {
      const px = ((col + 0.5) / HEAT_COLS) * 100;
      const py = ((row + 0.5) / HEAT_ROWS) * 80;
      let value = 0;
      for (const zone of zones) {
        const cx = zone.x + zone.w / 2;
        const cy = zone.y + zone.h / 2;
        const sigma = Math.max(zone.w, zone.h) * 0.42;
        const inside = px >= zone.x && px <= zone.x + zone.w && py >= zone.y && py <= zone.y + zone.h;
        const dist = (px - cx) ** 2 + (py - cy) ** 2;
        value += zone.dwellShare * Math.exp(-dist / (2 * sigma * sigma)) * (inside ? 1.4 : 1);
      }
      for (const path of paths) {
        const dist = distanceToPath(px, py, path.points);
        value += path.share * 0.45 * Math.exp(-(dist * dist) / (2 * 2.8 * 2.8));
      }
      const inShop = px >= SHOP_PLATE.x && px <= SHOP_PLATE.x + SHOP_PLATE.w && py >= SHOP_PLATE.y && py <= SHOP_PLATE.y + SHOP_PLATE.h;
      const inDoor = px >= 36 && px <= 64 && py >= 3 && py <= 22;
      grid[row][col] = inShop || inDoor ? value : value * 0.12;
    }
  }
  const max = Math.max(...grid.flat(), 0.0001);
  return grid.map((row) => row.map((value) => value / max));
}

function pieceCounts(sales: number[], units: number) {
  const weights = sales.map((amount, index) => amount / PIECE_PRICE[CATEGORIES[index]]);
  const active = sales.map((amount) => amount > 0);
  const activeCount = active.filter(Boolean).length;
  if (units <= activeCount) return apportion(weights, units);
  const base = active.map((on) => (on ? 1 : 0));
  const extra = apportion(weights, units - activeCount);
  return base.map((count, index) => count + extra[index]);
}

function cityShare(store: StoreTwin, list: StoreTwin[], when: "now" | "then") {
  const peers = list.filter((item) => item.city === store.city);
  const total = peers.reduce((acc, item) => acc + item[when].visitors, 0);
  return total === 0 ? 0 : store[when].visitors / total;
}

export function buildFloor(store: StoreTwin, list: StoreTwin[] = stores, minuteKey = "base"): FloorTwin {
  const rand = mulberry32(hash(`${store.id}:floor`));
  const nowDoor = passersFor(store.now.visitors, store.tier, rand);
  const thenDoor = passersFor(store.then.visitors, store.tier, rand);
  const layout = LAYOUTS[store.tier];
  let dwellWeights = layout.zones.map((zone) => {
    const tierBias = store.tier === "预约室" && zone.category === "高珠" ? 1.8 : store.tier === "旗舰" && zone.category === "手袋" ? 1.25 : 1;
    return zone.dwell * tierBias * (0.72 + rand() * 0.56);
  });
  let pathWeights = layout.paths.map((path) => path.pull * (0.78 + rand() * 0.44));
  if (minuteKey !== "base") {
    const wave = mulberry32(hash(`${store.id}:wave:${minuteKey}`));
    dwellWeights = dwellWeights.map((weight) => weight * (0.84 + wave() * 0.32));
    pathWeights = pathWeights.map((weight) => weight * (0.86 + wave() * 0.28));
  }
  const dwellSum = dwellWeights.reduce((acc, weight) => acc + weight, 0);
  const zones: FloorZone[] = layout.zones.map((zone, index) => ({
    ...zone,
    dwellShare: dwellWeights[index] / dwellSum,
  }));
  const pathSum = pathWeights.reduce((acc, weight) => acc + weight, 0);
  const shares = pathWeights.map((weight) => weight / pathSum);
  const buyers = apportion(
    pathWeights.map((weight, index) => weight * layout.paths[index].pull),
    store.now.buyers,
  );
  const paths: FloorPath[] = layout.paths.map((path, index) => ({
    id: path.id,
    name: path.name,
    points: path.points,
    share: shares[index],
    meters: Math.round(path.meters * (0.88 + rand() * 0.24) * 10) / 10,
    buyers: buyers[index],
    category: path.category,
  }));
  const thenMeters = layout.paths.map((path) => path.meters * (0.88 + rand() * 0.24));
  const units = unitCount(store.now.buyers, store.tier, rand);
  const thenUnits = unitCount(store.then.buyers, store.tier, rand);
  const pieceUnits = pieceCounts(
    CATEGORIES.map((category) => store.now.byCategory[category]),
    units,
  );
  const pieces: FloorPiece[] = CATEGORIES.map((category, index) => ({
    category,
    units: pieceUnits[index],
    sales: store.now.byCategory[category],
  })).sort((a, b) => b.sales - a.sales);
  const avgMeters = paths.reduce((acc, path) => acc + path.share * path.meters, 0);
  const thenAvgMeters = shares.reduce((acc, share, index) => acc + share * thenMeters[index], 0);
  const stayed = [...zones].sort((a, b) => b.dwellShare - a.dwellShare)[0];
  const bySales = pieces[0];
  const byPieces = [...pieces].sort((a, b) => b.units - a.units)[0];
  const busiest = [...paths].sort((a, b) => b.share - a.share)[0];
  const stay = stayed.category
    ? `停留最久的是${stayed.label}，对着${stayed.category}`
    : `停留最久的是${stayed.label}，人还堆在动线口上`;
  const mix =
    byPieces.category === bySales.category
      ? `件数和金额都落在${bySales.category}`
      : `件数最多的是${byPieces.category}（${byPieces.units} 件），金额最大的是${bySales.category}`;
  const habit = `${stay}。${mix}。走得最多的是「${busiest.name}」，占进店 ${formatRate(busiest.share)}，这条路 ${busiest.meters.toFixed(1)} 米，主成交在${busiest.category}。`;
  const upt = units / store.now.buyers;
  const thenUpt = thenUnits / store.then.buyers;
  const capture = nowDoor.capture;
  const thenCapture = thenDoor.capture;
  const share = cityShare(store, list, "now");
  const thenShare = cityShare(store, list, "then");
  const reading = [
    `${storeLabel(store)}廊前经过 ${nowDoor.passers.toLocaleString("zh-CN")} 人，走进这一家 ${store.now.visitors.toLocaleString("zh-CN")} 人，进店占比从 ${formatRate(thenCapture)} 到 ${formatRate(capture)}，环比上月同刻 ${formatPct(pctDelta(capture, thenCapture))}。占${store.city}到店的 ${formatRate(share)}。`,
    `进店的人平均走 ${avgMeters.toFixed(1)} 米，环比 ${formatPct(pctDelta(avgMeters, thenAvgMeters))}。成交 ${store.now.buyers.toLocaleString("zh-CN")} 笔，客单量 ${upt.toFixed(2)} 件，环比 ${formatPct(pctDelta(upt, thenUpt))}；客单价 ${twinYuan(aov(store.now))}，环比 ${formatPct(pctDelta(aov(store.now), aov(store.then)))}。`,
    habit,
  ];
  return {
    passers: nowDoor.passers,
    capture,
    thenCapture,
    cityShare: share,
    thenCityShare: thenShare,
    avgMeters,
    thenAvgMeters,
    units,
    thenUnits,
    zones,
    paths,
    pieces,
    heat: heatGrid(zones, paths),
    habit,
    reading,
  };
}

export function floorAnswer(question: string, list: StoreTwin[] = stores) {
  const text = question.trim();
  const about = ["进店", "占比", "热力", "路程", "走动", "客单量", "习惯", "平面", "廊前"].some((word) => text.includes(word));
  if (!about) return null;
  const cities = [...new Set(list.map((store) => store.city))];
  const city = cities.find((name) => text.includes(name));
  const pool = city ? list.filter((store) => store.city === city) : list;
  const named = pool.filter((store) => text.includes(store.name));
  const anywhere = list.filter((store) => text.includes(store.name));
  const store =
    named[0] ??
    (!city && anywhere.length === 1 ? anywhere[0] : undefined) ??
    (city ? [...pool].sort((a, b) => b.now.visitors - a.now.visitors)[0] : undefined) ??
    list.find((item) => item.id === "sh-huaihai") ??
    list[0];
  return buildFloor(store, list).reading.join("");
}
