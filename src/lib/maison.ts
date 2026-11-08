export const TODAY = "2026-11-07";

export const productName = "之之风速";

export const maison = {
  latin: "Maison Solenne",
  name: "索伦邸",
  desk: "中国区客户台",
  season: "二六秋冬 · 静水",
  dateLabel: "2026.11.07",
  weekday: "星期六",
};

export type Tier = "密友" | "主顾" | "初识";

export type Product = {
  id: string;
  name: string;
  family: string;
  price: number;
  material: string;
  craft: string;
  story: string;
  publicLine: string;
  wear: string;
};

export type Client = {
  id: string;
  name: string;
  addressAs: string;
  city: string;
  store: string;
  tier: Tier;
  since: string;
  lifetime: number;
  lastVisit: string | null;
  lastTouch: string;
  preferences: string[];
  avoid: string[];
  notes: string;
  source: string;
  occasion?: {
    label: string;
    date: string;
    pieceId: string;
  };
};

export type SalonMode = "viewing" | "care" | "letter";

export type Salon = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  time: string;
  place: string;
  city: string;
  seats: number | null;
  held: number;
  mode: SalonMode;
  categories: string[];
  note: string;
};

export const products: Product[] = [
  {
    id: "quiet-water",
    name: "静水 No.07",
    family: "手袋",
    price: 86000,
    material: "盒型小牛皮，香槟金属",
    craft: "手柄由一名工匠缝十八个小时，边缘不涂厚漆",
    story: "名字取自工坊窗外那条不结冰的水沟，一九二四年的日志用它给深色皮具起过名",
    publicLine: "这一年只做十二只",
    wear: "可挽可肩。内里没有外露字母",
  },
  {
    id: "night-voyage",
    name: "夜航",
    family: "戒指",
    price: 268000,
    material: "椭圆蓝宝石，铂金爪镶",
    craft: "沿用工坊旧切工，不改成更亮的现代切割",
    story: "一九二六年一张夜航船的乘客名册被夹进图纸，戒指因此得名",
    publicLine: "这一颗的切工不再改亮",
    wear: "适合白天看，不适合在聚光灯下试戴",
  },
  {
    id: "old-letter",
    name: "旧信夹",
    family: "小皮具",
    price: 14800,
    material: "植鞣牛皮，边缘磨成旧信的颜色",
    craft: "字母若要烫，只烫在内里",
    story: "早期用来夹工坊与巴黎店之间的信件",
    publicLine: "外观不出现标记",
    wear: "礼赠时信单独手写，不附卡片",
  },
  {
    id: "holly",
    name: "冬青",
    family: "耳坠",
    price: 196000,
    material: "沙弗莱石榴石，旧式耳钩",
    craft: "石头按图纸逐颗挑选，不修成完全对称",
    story: "冬青是工坊园子里唯一被允许留下来的植物",
    publicLine: "一对不会被修成完全对称",
    wear: "不拍佩戴视频",
  },
  {
    id: "traveler",
    name: "旅人表带",
    family: "表带",
    price: 22000,
    material: "短吻鳄皮，缝线贴近表壳的颜色",
    craft: "不出售整枚表，只按客人已有的表壳取样",
    story: "给已经有表的人。很多表是上一辈留下的",
    publicLine: "不配新表，只按旧表取样",
    wear: "谈话从表现在的主人开始",
  },
  {
    id: "path-silk",
    name: "香径",
    family: "丝巾",
    price: 12800,
    material: "双面斜纹绸",
    craft: "纹样描自一九二四年日志页边的植物",
    story: "不是当季印花，是那本日志还在被使用的证据",
    publicLine: "正反纹样相差一度",
    wear: "适合第一次购买，不是通往珠宝的台阶",
  },
];

export const clients: Client[] = [
  {
    id: "lin-wanning",
    name: "林晚宁",
    addressAs: "晚宁",
    city: "上海",
    store: "淮海旗舰",
    tier: "密友",
    since: "2019",
    lifetime: 1280000,
    lastVisit: "2026-10-18",
    lastTouch: "2026-10-20",
    preferences: ["手袋"],
    avoid: ["表情符号", "群发", "折扣字样"],
    notes: "静水候补第三。在意缝线会不会勾到羊绒大衣。",
    source: "主顾介绍",
  },
  {
    id: "zhou-yuan",
    name: "周予安",
    addressAs: "予安",
    city: "上海",
    store: "国金",
    tier: "密友",
    since: "2016",
    lifetime: 2460000,
    lastVisit: "2026-10-02",
    lastTouch: "2026-10-28",
    preferences: ["高珠"],
    avoid: ["把家属写进群", "晚宴试戴"],
    notes: "配偶生日要白天看货，不要办成晚宴。",
    source: "国金预约室",
    occasion: {
      label: "配偶生日",
      date: "2026-11-16",
      pieceId: "night-voyage",
    },
  },
  {
    id: "gu-xingzhou",
    name: "顾行舟",
    addressAs: "行舟",
    city: "上海",
    store: "国金",
    tier: "主顾",
    since: "2018",
    lifetime: 1150000,
    lastVisit: "2026-10-25",
    lastTouch: "2026-10-26",
    preferences: ["礼赠", "小皮具"],
    avoid: ["外露字母", "印金卡片", "企业标志"],
    notes: "四件旧信夹要分开包装，信必须手写。",
    source: "国金",
    occasion: {
      label: "四件董事会谢礼",
      date: "2026-11-20",
      pieceId: "old-letter",
    },
  },
  {
    id: "su-man",
    name: "苏曼",
    addressAs: "苏曼",
    city: "北京",
    store: "国贸预约室",
    tier: "主顾",
    since: "2021",
    lifetime: 640000,
    lastVisit: "2025-06-20",
    lastTouch: "2025-06-21",
    preferences: ["小皮具"],
    avoid: ["新品", "节日信"],
    notes: "去年说过今年不想增加物件。沉默是她的节奏，不是待转化。",
    source: "北京",
  },
  {
    id: "ye-chong",
    name: "叶崇",
    addressAs: "叶崇",
    city: "北京",
    store: "国贸预约室",
    tier: "主顾",
    since: "2017",
    lifetime: 1760000,
    lastVisit: "2026-07-12",
    lastTouch: "2026-07-12",
    preferences: ["高珠"],
    avoid: ["视频", "直播", "种草口吻"],
    notes: "讨厌被种草。只接受预约室里的白天。耳钩的旧尺寸还留着。",
    source: "国贸",
  },
  {
    id: "zhao-qiming",
    name: "赵启明",
    addressAs: "启明",
    city: "上海",
    store: "淮海旗舰",
    tier: "主顾",
    since: "2022",
    lifetime: 890000,
    lastVisit: "2026-08-01",
    lastTouch: "2026-08-02",
    preferences: ["表带"],
    avoid: ["建议换表"],
    notes: "表是父亲的。只处理表带，不谈换表。",
    source: "淮海旗舰",
  },
  {
    id: "jiang-wanlai",
    name: "江晚来",
    addressAs: "晚来",
    city: "上海",
    store: "淮海旗舰",
    tier: "主顾",
    since: "2024",
    lifetime: 186000,
    lastVisit: "2026-10-05",
    lastTouch: "2026-10-06",
    preferences: ["手袋"],
    avoid: ["当场逼定"],
    notes: "看过一次静水，卡在尺寸，还不是候补。",
    source: "淮海旗舰",
  },
  {
    id: "liang-qiubai",
    name: "梁秋白",
    addressAs: "秋白",
    city: "上海",
    store: "淮海旗舰",
    tier: "密友",
    since: "2014",
    lifetime: 3200000,
    lastVisit: "2026-10-30",
    lastTouch: "2026-11-02",
    preferences: ["高珠"],
    avoid: ["让她带新客", "把她当成销售"],
    notes: "可以请她看夜航。请柬里不要写带朋友。她自己提，再留席。",
    source: "淮海旗舰",
  },
  {
    id: "he-qinghe",
    name: "何清和",
    addressAs: "清和",
    city: "成都",
    store: "太古里",
    tier: "主顾",
    since: "2020",
    lifetime: 510000,
    lastVisit: "2026-09-30",
    lastTouch: "2026-10-08",
    preferences: ["护理"],
    avoid: ["晚间"],
    notes: "会把自己的旧包带来。约早晨或午后早段。",
    source: "太古里",
  },
  {
    id: "xu-nanxing",
    name: "许南星",
    addressAs: "南星",
    city: "成都",
    store: "太古里",
    tier: "主顾",
    since: "2023",
    lifetime: 220000,
    lastVisit: "2026-10-11",
    lastTouch: "2026-10-12",
    preferences: ["护理"],
    avoid: ["傍晚以后"],
    notes: "包的边需要补。不要排到六点以后。",
    source: "太古里",
  },
  {
    id: "chen-shuyi",
    name: "陈书意",
    addressAs: "书意",
    city: "成都",
    store: "太古里",
    tier: "初识",
    since: "2026.09",
    lifetime: 0,
    lastVisit: null,
    lastTouch: "2026-10-28",
    preferences: ["丝巾"],
    avoid: ["立刻邀约", "问预算"],
    notes: "在小红书问了香径纹样的出处，还没有留电话。",
    source: "小红书",
  },
  {
    id: "shen-zhixia",
    name: "沈知夏",
    addressAs: "知夏",
    city: "上海",
    store: "淮海旗舰",
    tier: "初识",
    since: "2026.11",
    lifetime: 12800,
    lastVisit: "2026-11-01",
    lastTouch: "2026-11-01",
    preferences: ["丝巾"],
    avoid: ["升级到珠宝"],
    notes: "第一件是香径。这周不要带她看高珠。",
    source: "淮海旗舰路过",
  },
];

export const salons: Salon[] = [
  {
    id: "quiet",
    title: "静水私享",
    date: "2026-11-12",
    dateLabel: "11月12日",
    time: "15:00",
    place: "淮海旗舰三楼",
    city: "上海",
    seats: 8,
    held: 5,
    mode: "viewing",
    categories: ["手袋"],
    note: "不是到货会。灯放低，一次只看一只。",
  },
  {
    id: "night",
    title: "夜航预约日",
    date: "2026-11-18",
    dateLabel: "11月18日",
    time: "10:00–16:00",
    place: "国金预约室",
    city: "上海",
    seats: 6,
    held: 2,
    mode: "viewing",
    categories: ["高珠"],
    note: "只排白天。不设晚宴，不拍照。",
  },
  {
    id: "care",
    title: "皮具护理午后",
    date: "2026-11-22",
    dateLabel: "11月22日",
    time: "13:30",
    place: "成都太古里",
    city: "成都",
    seats: 10,
    held: 4,
    mode: "care",
    categories: ["护理"],
    note: "客人带旧物来。这一场不陈列新品。",
  },
  {
    id: "letter",
    title: "岁末主顾信",
    date: "2026-12-03",
    dateLabel: "12月3日",
    time: "上午发出",
    place: "由顾问署名",
    city: "全国",
    seats: null,
    held: 0,
    mode: "letter",
    categories: [],
    note: "一封信，不是清单。沉默的主顾不收这一封。",
  },
];

export const stores = [
  {
    name: "淮海旗舰",
    line: "昨日预约六组，到店五组，全价成交两件。有人问年末能不能再看价格，已拒绝。",
  },
  {
    name: "国金",
    line: "高珠预约满到周四。夜航剩余可看的数量只在预约室里说，不写进任何群。",
  },
  {
    name: "成都太古里",
    line: "护理预约多于购买。这是对的。不要为了平衡数字去加一场新品局。",
  },
  {
    name: "国贸预约室",
    line: "本周只开三组。叶崇的白天还空着，不要用视频把她叫回来。",
  },
];

export const brandCode = [
  "工艺、材质、出处只引用单品档案，不新编",
  "价格不出现在小红书、请柬和口播里",
  "场合若是某一个人的事，只留在私域，不写进公开内容",
  "用预约代替链接",
  "不写爆款、必入、限时、折扣、秒杀、优惠、姐妹、绝绝子",
  "不称呼「亲」，不用表情符号",
  "模型只起草。发出去的句子必须由顾问署名",
];

export function productById(id: string) {
  const product = products.find((item) => item.id === id);
  if (!product) throw new Error(`未知单品 ${id}`);
  return product;
}

export function clientById(id: string) {
  const client = clients.find((item) => item.id === id);
  if (!client) throw new Error(`未知客户 ${id}`);
  return client;
}

export function salonById(id: string) {
  const salon = salons.find((item) => item.id === id);
  if (!salon) throw new Error(`未知场次 ${id}`);
  return salon;
}

export function yuan(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(amount);
}

function utc(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function daysUntil(iso: string) {
  return Math.round((utc(iso) - utc(TODAY)) / 86_400_000);
}

export function daysSince(iso: string) {
  return -daysUntil(iso);
}
