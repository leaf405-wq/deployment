export const AS_OF = "2026.11.07 18:30";
export const COMPARED_TO = "2026.10.07 18:30";

export const CATEGORIES = ["手袋", "高珠", "小皮具", "丝巾", "表带"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Tier = "旗舰" | "专卖" | "预约室";

export type Shot = {
  visitors: number;
  buyers: number;
  sales: number;
  churn: number;
  byCategory: Record<Category, number>;
};

export type StoreTwin = {
  id: string;
  name: string;
  city: string;
  region: string;
  lng: number;
  lat: number;
  tier: Tier;
  now: Shot;
  then: Shot;
};

type Place = [id: string, name: string, city: string, region: string, lng: number, lat: number, tier: Tier];

const PLACES: Place[] = [
  ["sh-huaihai", "淮海旗舰", "上海", "华东", 121.473, 31.22, "旗舰"],
  ["sh-ifc", "国金", "上海", "华东", 121.505, 31.236, "旗舰"],
  ["sh-kerry", "静安嘉里", "上海", "华东", 121.455, 31.228, "专卖"],
  ["sh-hkri", "兴业太古汇", "上海", "华东", 121.459, 31.209, "专卖"],
  ["sh-qiantan", "前滩太古里", "上海", "华东", 121.503, 31.153, "专卖"],
  ["sh-gh", "港汇恒隆", "上海", "华东", 121.437, 31.195, "专卖"],
  ["sh-iapm", "环贸", "上海", "华东", 121.458, 31.216, "专卖"],
  ["sh-lujiazui", "陆家嘴预约室", "上海", "华东", 121.512, 31.239, "预约室"],
  ["bj-guomao", "国贸预约室", "北京", "华北", 116.461, 39.909, "预约室"],
  ["bj-skp", "SKP", "北京", "华北", 116.482, 39.908, "旗舰"],
  ["bj-wf", "王府中環", "北京", "华北", 116.412, 39.915, "专卖"],
  ["bj-slt", "三里屯太古里", "北京", "华北", 116.454, 39.934, "专卖"],
  ["bj-jrj", "金融街", "北京", "华北", 116.366, 39.913, "专卖"],
  ["bj-ytg", "颐堤港", "北京", "华北", 116.488, 39.978, "专卖"],
  ["sz-mixc", "万象城", "深圳", "华南", 114.11, 22.54, "旗舰"],
  ["sz-coast", "海岸城", "深圳", "华南", 113.935, 22.517, "专卖"],
  ["sz-bay", "湾区万象", "深圳", "华南", 113.945, 22.503, "专卖"],
  ["sz-upper", "深业上城", "深圳", "华南", 114.06, 22.548, "专卖"],
  ["gz-taikoo", "太古汇", "广州", "华南", 113.332, 23.119, "旗舰"],
  ["gz-parklife", "天环广场", "广州", "华南", 113.265, 23.129, "专卖"],
  ["gz-tianhui", "天汇广场", "广州", "华南", 113.321, 23.132, "专卖"],
  ["gz-k11", "K11", "广州", "华南", 113.324, 23.12, "专卖"],
  ["cd-taikoo", "太古里", "成都", "西南", 104.083, 30.657, "旗舰"],
  ["cd-mixc", "万象城", "成都", "西南", 104.066, 30.602, "专卖"],
  ["cd-yanlord", "仁恒置地", "成都", "西南", 104.068, 30.665, "专卖"],
  ["hz-tower", "大厦", "杭州", "华东", 120.163, 30.252, "旗舰"],
  ["hz-mixc", "万象城", "杭州", "华东", 120.218, 30.253, "专卖"],
  ["hz-west", "城西银泰", "杭州", "华东", 120.1, 30.268, "专卖"],
  ["nj-deji", "德基", "南京", "华东", 118.789, 32.046, "旗舰"],
  ["nj-ist", "艾尚天地", "南京", "华东", 118.778, 32.062, "专卖"],
  ["wh-plaza", "国际广场", "武汉", "华中", 114.272, 30.593, "旗舰"],
  ["wh-plaza66", "恒隆", "武汉", "华中", 114.269, 30.578, "专卖"],
  ["xa-skp", "SKP", "西安", "西北", 108.948, 34.222, "专卖"],
  ["xa-joy", "大悦城", "西安", "西北", 108.947, 34.249, "专卖"],
  ["cq-ifc", "国金", "重庆", "西南", 106.578, 29.558, "专卖"],
  ["cq-mixc", "万象城", "重庆", "西南", 106.518, 29.58, "专卖"],
  ["su-jiuguang", "久光", "苏州", "华东", 120.62, 31.308, "专卖"],
  ["tj-plaza66", "恒隆", "天津", "华北", 117.201, 39.124, "专卖"],
  ["qd-mixc", "万象城", "青岛", "华东", 120.382, 36.067, "专卖"],
  ["xm-mixc", "万象城", "厦门", "华南", 118.089, 24.479, "专卖"],
  ["cs-ifc", "国金", "长沙", "华中", 112.982, 28.194, "专卖"],
  ["zz-david", "大卫城", "郑州", "华中", 113.665, 34.758, "专卖"],
  ["sy-mixc", "万象城", "沈阳", "东北", 123.431, 41.805, "专卖"],
  ["dl-plaza66", "恒隆", "大连", "东北", 121.614, 38.914, "专卖"],
  ["km-tongde", "同德", "昆明", "西南", 102.712, 25.038, "专卖"],
  ["nb-hey", "和义", "宁波", "华东", 121.55, 29.874, "专卖"],
  ["wx-plaza66", "恒隆", "无锡", "华东", 120.302, 31.574, "专卖"],
  ["hf-mixc", "万象城", "合肥", "华东", 117.227, 31.82, "专卖"],
  ["fz-dongbai", "东百", "福州", "华南", 119.296, 26.074, "专卖"],
  ["jn-plaza66", "恒隆", "济南", "华东", 117.021, 36.668, "专卖"],
];

const WEIGHTS: Record<Tier, number[]> = {
  旗舰: [0.34, 0.28, 0.16, 0.12, 0.1],
  专卖: [0.3, 0.18, 0.22, 0.18, 0.12],
  预约室: [0.16, 0.58, 0.08, 0.06, 0.12],
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

function splitSales(total: number, weights: number[], rand: () => number) {
  const jitter = weights.map((weight) => weight * (0.82 + rand() * 0.36));
  const sum = jitter.reduce((acc, weight) => acc + weight, 0);
  const amounts = jitter.map((weight) => Math.floor((total * weight) / sum));
  amounts[amounts.length - 1] = total - amounts.slice(0, -1).reduce((acc, amount) => acc + amount, 0);
  return amounts;
}

function shotFor(tier: Tier, rand: () => number, scale: number): Shot {
  const base = tier === "旗舰" ? 92 : tier === "预约室" ? 11 : 38;
  const visitors = Math.max(6, Math.round(base * scale * (0.75 + rand() * 0.5)));
  const rate = tier === "预约室" ? 0.42 + rand() * 0.22 : tier === "旗舰" ? 0.16 + rand() * 0.12 : 0.12 + rand() * 0.14;
  const buyers = Math.min(visitors, Math.max(1, Math.round(visitors * rate)));
  const ticket = tier === "预约室" ? 96000 : tier === "旗舰" ? 42000 : 22000;
  const sales = buyers * Math.round(ticket * (0.72 + rand() * 0.56));
  const amounts = splitSales(sales, WEIGHTS[tier], rand);
  const byCategory = Object.fromEntries(CATEGORIES.map((category, index) => [category, amounts[index]])) as Record<
    Category,
    number
  >;
  return {
    visitors,
    buyers,
    sales,
    churn: Math.round((0.045 + rand() * 0.14) * 1000) / 1000,
    byCategory,
  };
}

function buildStore(place: Place): StoreTwin {
  const [id, name, city, region, lng, lat, tier] = place;
  const rand = mulberry32(hash(id));
  return {
    id,
    name,
    city,
    region,
    lng,
    lat,
    tier,
    now: shotFor(tier, rand, 1),
    then: shotFor(tier, rand, 0.86 + rand() * 0.28),
  };
}

export const stores: StoreTwin[] = PLACES.map(buildStore);

export function conversion(shot: Shot) {
  return shot.visitors === 0 ? 0 : shot.buyers / shot.visitors;
}

export function aov(shot: Shot) {
  return shot.buyers === 0 ? 0 : shot.sales / shot.buyers;
}

export function pctDelta(now: number, then: number) {
  if (then === 0) return null;
  return (now - then) / then;
}

export function formatPct(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  const points = value * 100;
  const sign = points > 0 ? "+" : "";
  return `${sign}${points.toFixed(1)}%`;
}

export function formatRate(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export type Rollup = {
  visitors: number;
  buyers: number;
  sales: number;
  churn: number;
  byCategory: Record<Category, number>;
};

export function rollup(list: StoreTwin[], when: "now" | "then"): Rollup {
  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, 0])) as Record<Category, number>;
  let visitors = 0;
  let buyers = 0;
  let sales = 0;
  let churnWeighted = 0;
  for (const store of list) {
    const shot = store[when];
    visitors += shot.visitors;
    buyers += shot.buyers;
    sales += shot.sales;
    churnWeighted += shot.churn * shot.visitors;
    for (const category of CATEGORIES) byCategory[category] += shot.byCategory[category];
  }
  return {
    visitors,
    buyers,
    sales,
    churn: visitors === 0 ? 0 : churnWeighted / visitors,
    byCategory,
  };
}

export function storeLabel(store: StoreTwin) {
  return `${store.city}${store.name}`;
}

function worstConversion(list: StoreTwin[]) {
  return [...list].sort(
    (a, b) =>
      (pctDelta(conversion(a.now), conversion(a.then)) ?? 0) -
      (pctDelta(conversion(b.now), conversion(b.then)) ?? 0),
  )[0];
}

function steepestChurn(list: StoreTwin[]) {
  return [...list].sort((a, b) => (pctDelta(b.now.churn, b.then.churn) ?? 0) - (pctDelta(a.now.churn, a.then.churn) ?? 0))[0];
}

export type CategoryRow = {
  category: Category;
  sales: number;
  then: number;
  delta: number | null;
};

export function categoryRows(list: StoreTwin[]): CategoryRow[] {
  const now = rollup(list, "now");
  const then = rollup(list, "then");
  return CATEGORIES.map((category) => ({
    category,
    sales: now.byCategory[category],
    then: then.byCategory[category],
    delta: pctDelta(now.byCategory[category], then.byCategory[category]),
  }));
}

export function twinReading(list: StoreTwin[]) {
  const now = rollup(list, "now");
  const then = rollup(list, "then");
  const rows = categoryRows(list);
  const leading = [...rows].sort((a, b) => b.sales - a.sales)[0];
  const slipping = [...rows].sort((a, b) => (a.delta ?? 0) - (b.delta ?? 0))[0];
  const crowded = list.filter((store) => store.now.visitors >= 24);
  const weak = worstConversion(crowded.length > 0 ? crowded : list);
  const churn = steepestChurn(list);
  return [
    `截至 ${AS_OF}，五十家店的转化是 ${formatRate(conversion({ ...now, byCategory: now.byCategory }))}，环比上月同刻 ${formatPct(pctDelta(conversion(asShot(now)), conversion(asShot(then))))}。人流 ${formatPct(pctDelta(now.visitors, then.visitors))}，成交额 ${formatPct(pctDelta(now.sales, then.sales))}。`,
    `${storeLabel(weak)}人来了，转化掉得最多，环比 ${formatPct(pctDelta(conversion(weak.now), conversion(weak.then)))}。先看顾问在不在，而不是再加人流。`,
    `${leading.category}是此刻成交额最大的类别。${slipping.category}环比 ${formatPct(slipping.delta)}。客单价要跟类别一起看：高珠会把它抬高，丝巾会把它拉低。`,
    `${storeLabel(churn)}的流失率从 ${formatRate(churn.then.churn)} 到 ${formatRate(churn.now.churn)}，环比 ${formatPct(pctDelta(churn.now.churn, churn.then.churn))}。这是名册的事，不是橱窗的事。`,
  ];
}

function asShot(roll: Rollup): Shot {
  return {
    visitors: roll.visitors,
    buyers: roll.buyers,
    sales: roll.sales,
    churn: roll.churn,
    byCategory: roll.byCategory,
  };
}

export function askTwin(question: string, list: StoreTwin[] = stores) {
  const text = question.trim();
  if (!text) return "问一家店、一个城市，或问流失、转化、客单价、人流。";
  const city = [...new Set(list.map((store) => store.city))].find((name) => text.includes(name));
  const scope = city ? list.filter((store) => store.city === city) : list;
  const category = CATEGORIES.find((name) => text.includes(name));
  if (category) {
    const row = categoryRows(scope).find((item) => item.category === category);
    if (!row) return "这一类今天没有成交。";
    const top = [...scope].sort((a, b) => b.now.byCategory[category] - a.now.byCategory[category])[0];
    return `${city ?? "全网"}${category}成交额 ${yuan(row.sales)}，环比上月同刻 ${formatPct(row.delta)}。最多的是${storeLabel(top)}。`;
  }
  if (text.includes("流失")) {
    const ranked = [...scope].sort(
      (a, b) => (pctDelta(b.now.churn, b.then.churn) ?? 0) - (pctDelta(a.now.churn, a.then.churn) ?? 0),
    );
    const lines = ranked.slice(0, 3).map((store) => {
      return `${storeLabel(store)} ${formatRate(store.now.churn)}，环比 ${formatPct(pctDelta(store.now.churn, store.then.churn))}`;
    });
    return `${city ?? "全网"}流失升得最快的三家：${lines.join("；")}。`;
  }
  if (text.includes("转化")) {
    const weak = worstConversion(scope);
    const strong = [...scope].sort(
      (a, b) =>
        (pctDelta(conversion(b.now), conversion(b.then)) ?? 0) -
        (pctDelta(conversion(a.now), conversion(a.then)) ?? 0),
    )[0];
    return `${storeLabel(weak)}转化 ${formatRate(conversion(weak.now))}，环比 ${formatPct(pctDelta(conversion(weak.now), conversion(weak.then)))}。升得最多的是${storeLabel(strong)}，环比 ${formatPct(pctDelta(conversion(strong.now), conversion(strong.then)))}。`;
  }
  if (text.includes("客单")) {
    const now = rollup(scope, "now");
    const then = rollup(scope, "then");
    const drop = [...scope].sort((a, b) => (pctDelta(aov(a.now), aov(a.then)) ?? 0) - (pctDelta(aov(b.now), aov(b.then)) ?? 0))[0];
    return `${city ?? "全网"}客单价 ${yuan(aov(asShot(now)))}，环比 ${formatPct(pctDelta(aov(asShot(now)), aov(asShot(then))))}。掉得最多的是${storeLabel(drop)}，现在 ${yuan(aov(drop.now))}。`;
  }
  if (text.includes("人流") || text.includes("到店")) {
    const now = rollup(scope, "now");
    const then = rollup(scope, "then");
    const busiest = [...scope].sort((a, b) => b.now.visitors - a.now.visitors)[0];
    return `${city ?? "全网"}到店 ${now.visitors.toLocaleString("zh-CN")} 人，环比 ${formatPct(pctDelta(now.visitors, then.visitors))}。最多的是${storeLabel(busiest)}，${busiest.now.visitors} 人。`;
  }
  if (text.includes("成交") || text.includes("购物") || text.includes("销售")) {
    const now = rollup(scope, "now");
    const then = rollup(scope, "then");
    return `${city ?? "全网"}成交额 ${yuan(now.sales)}，环比上月同刻 ${formatPct(pctDelta(now.sales, then.sales))}。成交 ${now.buyers.toLocaleString("zh-CN")} 人。`;
  }
  if (city) {
    const now = rollup(scope, "now");
    const then = rollup(scope, "then");
    return `${city} ${scope.length} 家。人流环比 ${formatPct(pctDelta(now.visitors, then.visitors))}，成交额环比 ${formatPct(pctDelta(now.sales, then.sales))}，转化 ${formatRate(conversion(asShot(now)))}，客单价 ${yuan(aov(asShot(now)))}，流失率 ${formatRate(now.churn)}。`;
  }
  return "孪生席只按门店汇总回答。可以问流失、转化、客单价、人流，或加上一个城市、一个类别。";
}

function yuan(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export { yuan as twinYuan };
