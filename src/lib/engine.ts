import {
  type Client,
  type Product,
  type Salon,
  clients,
  daysSince,
  daysUntil,
  productById,
  products,
  salonById,
  salons,
} from "./maison";

export type Channel = "xiaohongshu" | "wechat" | "invitation" | "voice";
export type Tone = "restrained" | "heritage" | "season";

export type Variant = {
  label: string;
  title?: string;
  body: string;
};

const BANNED: { source: string; flags: string; label: string }[] = [
  { source: "爆款", flags: "g", label: "爆款" },
  { source: "必入", flags: "g", label: "必入" },
  { source: "折扣", flags: "g", label: "折扣" },
  { source: "限时", flags: "g", label: "限时" },
  { source: "秒杀", flags: "g", label: "秒杀" },
  { source: "优惠", flags: "g", label: "优惠" },
  { source: "白菜", flags: "g", label: "白菜" },
  { source: "姐妹", flags: "g", label: "姐妹" },
  { source: "绝绝子", flags: "g", label: "绝绝子" },
  { source: "yyds", flags: "gi", label: "yyds" },
  { source: "闭眼入", flags: "g", label: "闭眼入" },
  { source: "亲", flags: "g", label: "亲" },
];

const PRICE_DIGITS = products.map((product) => String(product.price));

export function findBanned(text: string) {
  return BANNED.filter((item) => new RegExp(item.source, item.flags).test(text)).map(
    (item) => item.label,
  );
}

export function containsPrice(text: string) {
  return PRICE_DIGITS.some((digits) => text.includes(digits)) || /[¥￥]/.test(text);
}

function scrub(raw: string) {
  let clean = raw.trim();
  const hits = findBanned(clean);
  for (const item of BANNED) {
    clean = clean.replace(new RegExp(item.source, item.flags), "");
  }
  clean = clean
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return { clean, hits };
}

const CLOSES = [
  "若要看见，预约一个工作日的上午。",
  "看它需要一段不被打断的时间。",
  "把上午留下来即可，不必先说想买。",
];

function closeLine(seed: number, index: number) {
  return CLOSES[(seed + index) % CLOSES.length];
}

function occasionSentence(occasion: string) {
  return occasion ? `这件事只记在这里：${occasion}。` : "";
}

function publicBody(product: Product, tone: Tone, index: number, seed: number) {
  const open =
    tone === "heritage"
      ? index === 0
        ? "一九二四年的工坊日志还在被拿来核对，不是被拿来做背景。"
        : product.story + "。"
      : tone === "season"
        ? index === 0
          ? "十一月的房间把恒湿柜打开时，人会不自觉放轻声音。"
          : `${product.name}放在这个月份，是因为它不需要额外的灯光。`
        : index === 0
          ? `${product.name}不放在橱窗正中。`
          : `${product.family}这一只，只说它是怎么做的。`;

  const middle =
    index === 0
      ? [`${product.material}。${product.craft}。`, `${product.publicLine}。`]
      : [`${product.story}。`, `${product.material}。${product.craft}。`];

  return [open, ...middle, closeLine(seed, index)].join("\n\n");
}

function titles(product: Product, tone: Tone, index: number) {
  if (tone === "heritage") {
    return index === 0 ? `${product.name}的出处` : `日志里的${product.name}`;
  }
  if (tone === "season") {
    return index === 0 ? `十一月的${product.name}` : `${product.name}，这个月份`;
  }
  return index === 0 ? product.name : `关于${product.name}`;
}

export function composeCopy(input: {
  product: Product;
  channel: Channel;
  tone: Tone;
  occasion: string;
  seed: number;
}) {
  const { product, channel, tone, seed } = input;
  const scrubbed = scrub(input.occasion);
  const notes = [
    "工艺与出处只来自这件单品的档案",
    "价格没有写进正文",
    "正文里没有促销词",
  ];
  if (scrubbed.hits.length) {
    notes.unshift(`补充里拿掉了：${scrubbed.hits.join("、")}`);
  }

  const occasion = scrubbed.clean;
  if ((channel === "xiaohongshu" || channel === "voice") && occasion) {
    notes.push("场合属于某一个人，没有写进公开内容");
  }
  const variants: Variant[] = [0, 1].map((index) => {
    if (channel === "xiaohongshu") {
      return {
        label: index === 0 ? "甲" : "乙",
        title: titles(product, tone, index),
        body: publicBody(product, tone, index, seed),
      };
    }
    if (channel === "voice") {
      const lines =
        index === 0
          ? [
              `我手里这件是${product.name}。`,
              `${product.material}。`,
              `${product.craft}。`,
              product.story + "。",
              closeLine(seed, index),
            ]
          : [
              product.story + "。",
              `${product.publicLine}。`,
              `${product.craft}。`,
              "不想另找形容词。",
              closeLine(seed, index),
            ];
      return { label: index === 0 ? "甲" : "乙", body: lines.join("\n") };
    }
    if (channel === "wechat") {
      const lines =
        index === 0
          ? [
              `${product.name}。${product.craft}。`,
              occasionSentence(occasion),
              "若方便，把一个上午留给我。不必先回一个字。",
            ]
          : [
              product.publicLine + "。",
              occasionSentence(occasion),
              closeLine(seed, index),
            ];
      return {
        label: index === 0 ? "甲" : "乙",
        body: lines.filter(Boolean).join("\n"),
      };
    }
    const lines =
      index === 0
        ? [
            "敬启",
            "",
            `索伦邸安排一次小型观看：${product.name}。`,
            `${product.craft}。`,
            occasionSentence(occasion),
            "席位很少，灯和谈话都会放慢。",
            "地点由顾问单独确认。",
            "",
            "此函不必转发。",
          ]
        : [
            product.name,
            "",
            product.story + "。",
            product.publicLine + "。",
            occasionSentence(occasion),
            "观看安排在白天。",
            closeLine(seed, index),
          ];
    return {
      label: index === 0 ? "甲" : "乙",
      body: lines.filter((line) => line !== "").join("\n"),
    };
  });

  const uniqueNotes = [...new Set(notes)];
  return { variants, notes: uniqueNotes, removed: scrubbed.hits };
}

export type AdviceKind = "occasion" | "salon" | "silence" | "nurture" | "steady";

export type Advice = {
  clientId: string;
  kind: AdviceKind;
  priority: number;
  title: string;
  reasons: string[];
  dont: string;
  scripts: { short: string; formal: string };
  salonId?: string;
};

const SCRIPTS: Record<string, Pick<Advice, "title" | "reasons" | "dont" | "scripts">> = {
  "zhou-yuan": {
    title: "生日前给周予安留一个白天",
    reasons: [
      "配偶生日在 11 月 16 日，还有九天",
      "他要看的是夜航，而且明确不要晚宴",
      "家属的名字不能出现在任何群里",
    ],
    dont: "不要发图册，不要把看货写成派对。",
    scripts: {
      short: "予安，十六日之前可以看夜航。国金留白天，不排晚宴，也不把名字写进任何群。你定一个上午。",
      formal:
        "予安，夜航可以在十六日之前安排一次白天的观看。地点在国金预约室，不设晚宴，亦不在其他场合提及。请直接指定一个上午。",
    },
  },
  "gu-xingzhou": {
    title: "为顾行舟准备四件旧信夹",
    reasons: [
      "11 月 20 日前要四件，是谢礼不是零售",
      "字母只能在内里，外观必须干净",
      "信要手写，卡片会破坏这件事",
    ],
    dont: "不要配印金感谢卡，不要打企业标志。",
    scripts: {
      short: "行舟，四件旧信夹可以在二十日前分开包装。字母只在内里，信我手写，不放卡片。",
      formal:
        "行舟，四件旧信夹可于二十日前分别包装。标记只做在内里，附信由我手写，不另附卡片，外观亦不出现其他标志。",
    },
  },
  "su-man": {
    title: "今天不向苏曼介绍任何新品",
    reasons: [
      "上次往来是去年六月，已经超过九十天",
      "她说过今年不想增加物件",
      "终身往来不低，所以更不能用新品去敲她",
    ],
    dont: "不要提静水、夜航，也不要发岁末信。",
    scripts: {
      short: "苏曼，旧信夹的边缘如果要重新压过，国贸可以留一个早晨。这封不谈别的。",
      formal:
        "苏曼，若旧信夹的边缘需要重新压过，国贸预约室可在早晨留出时间。此信只为这件旧物，不介绍其他。",
    },
  },
  "ye-chong": {
    title: "给叶崇留国贸的白天，不发图片",
    reasons: [
      "七月之后没有往来",
      "她明确讨厌种草、视频和直播",
      "耳钩的旧尺寸还在，这是护理不是新品通知",
    ],
    dont: "不要把冬青拍给她，不要叫她来上海的局。",
    scripts: {
      short: "叶崇，国贸还有白天的空档。你若只想坐一会儿，不必看新的东西。上次留下的耳钩尺寸我还留着。",
      formal:
        "叶崇，国贸预约室这周仍有白天的空档。若你只想坐下来，不必观看新的物件。你留下的耳钩尺寸仍在我处。",
    },
  },
  "zhao-qiming": {
    title: "只跟赵启明谈父亲的表",
    reasons: [
      "八月之后没有进店",
      "表是父亲的，关系在这枚表上",
      "他拒绝过换表的建议",
    ],
    dont: "不要推荐新手袋，不要建议换表。",
    scripts: {
      short: "启明，父亲那枚表的表带尺寸还在。若要重做，按旧尺寸，不谈换表。",
      formal: "启明，令尊那枚表的表带尺寸仍保存在店里。若需要重做，按原尺寸取样，不涉及更换表款。",
    },
  },
  "lin-wanning": {
    title: "把静水的一席留给林晚宁",
    reasons: [
      "她是候补第三，不是新客",
      "12 日的私享还有空席",
      "她不看图册，只看实物和缝线",
    ],
    dont: "不要群发图片，不要在席上催她决定。",
    scripts: {
      short: "晚宁，十二日下午静水有一次小型观看，还不是到货。席位可以留给你。不发图册。",
      formal:
        "晚宁，十二日下午有一次静水的小型观看，并非到货通知。席位可为你保留。不另附图册，缝线可在席间看。",
    },
  },
  "jiang-wanlai": {
    title: "让江晚来再看一次尺寸",
    reasons: ["她看过静水，卡在尺寸", "还不是候补，不必当成即将成交", "私享可以比较，不能逼定"],
    dont: "不要在席上问她今天定不定。",
    scripts: {
      short: "晚来，十二日下午可以再看一次静水的尺寸。不必当天决定。",
      formal: "晚来，十二日下午可再看静水的尺寸。那一席只为比较，无需当天决定。",
    },
  },
  "he-qinghe": {
    title: "约何清和来护理午后",
    reasons: ["22 日成都的场是护理，不是新品", "她会带自己的旧包", "她不接受晚间"],
    dont: "不要把新品搁在护理桌上。",
    scripts: {
      short: "清和，二十二日太古里有一个护理的午后。把旧包带来就好。我把你排在早一点的那一场。",
      formal: "清和，二十二日太古里的护理安排在午后。请带上旧包。我为你排在较早的一段，不排晚间。",
    },
  },
  "xu-nanxing": {
    title: "给许南星留补边的时间",
    reasons: ["包边需要补", "22 日的护理场对得上", "不能排到傍晚"],
    dont: "不要顺带介绍静水。",
    scripts: {
      short: "南星，二十二日的护理可以补边。不排到傍晚。",
      formal: "南星，二十二日的护理可为你补边。时间放在午后早段，不排到傍晚。",
    },
  },
  "chen-shuyi": {
    title: "只回答陈书意的纹样出处",
    reasons: ["她从小说红书来，还没有留电话", "问的是出处，不是到店", "初识这一步只配得到故事"],
    dont: "不要邀她来太古里，不要问预算。",
    scripts: {
      short: "书意，香径页边的植物描自一九二四年的工坊日志，不是当季新稿。想看这页怎么走到丝绸上，我可以寄一页说明。先不必来店。",
      formal:
        "书意，香径的植物纹样描自一九二四年的工坊日志，并非当季新稿。若你想知道它如何走到丝绸上，我可寄一页说明。此刻不必到店。",
    },
  },
  "shen-zhixia": {
    title: "沈知夏这周只配得到系法",
    reasons: ["六天前刚买了第一件香径", "初识的下一步不是高珠", "她的禁忌里写着不要升级"],
    dont: "不要邀请她看夜航或冬青。",
    scripts: {
      short: "知夏，香径正反纹样相差一度，系的时候让较深的一面朝内。这周没有别的要给你看的。",
      formal: "知夏，香径正反纹样相差一度。系的时候可让较深的一面朝内。这一周没有其他需要给你看的物件。",
    },
  },
  "liang-qiubai": {
    title: "梁秋白这周不必被联系",
    reasons: ["五天前刚通过话", "她是密友，不是待填的席位", "夜航若要请，等她自己有空"],
    dont: "不要派她带新客，不要把请柬写成任务。",
    scripts: {
      short: "秋白，这周不必特意联系。十八日的夜航若你想看，我留白天。请柬里不会写带朋友。",
      formal: "秋白，这一周不必特意打扰。十八日夜航若你愿意看，我留白天。请柬中不会写邀约友人。",
    },
  },
};

export function isSilent(client: Client) {
  return daysSince(client.lastTouch) >= 90 && client.lifetime >= 400_000;
}

export type Placement = {
  clientId: string;
  name: string;
  stance: "invite" | "hold" | "personal" | "standard" | "skip";
  reason: string;
};

function judgeVisit(salon: Salon, client: Client): Placement {
  const base = { clientId: client.id, name: client.name };
  if (client.tier === "初识") {
    return { ...base, stance: "hold", reason: "初识只停留在故事里，不进入沙龙。" };
  }
  if (client.city !== salon.city) {
    return { ...base, stance: "hold", reason: `${client.city}的客人不用来填${salon.city}的席。` };
  }
  if (salon.mode === "viewing" && isSilent(client)) {
    return { ...base, stance: "hold", reason: "沉默期不做新品观看。" };
  }
  if (!salon.categories.some((category) => client.preferences.includes(category))) {
    return { ...base, stance: "hold", reason: "品类不是这个人现在要看的。" };
  }
  return {
    ...base,
    stance: "invite",
    reason: inviteReason(salon.id, client.id),
  };
}

function inviteReason(salonId: string, clientId: string) {
  const special: Record<string, string> = {
    "quiet:lin-wanning": "静水候补第三。只留席，不发图册。",
    "quiet:jiang-wanlai": "看过一次，卡在尺寸。可以再看，不要催决定。",
    "night:zhou-yuan": "若十六日前没有看成，十八日仍可留白天。不要排晚宴。",
    "night:liang-qiubai": "可以请。请柬不要写带朋友，她自己提再留席。",
    "care:he-qinghe": "她会带旧包。排早一点，桌上不放新品。",
    "care:xu-nanxing": "补边。不排到傍晚，不顺带介绍手袋。",
  };
  return special[`${salonId}:${clientId}`] ?? "城市、品类和关系都对得上。";
}

function judgeLetter(client: Client): Placement {
  const base = { clientId: client.id, name: client.name };
  if (client.tier === "初识") {
    return { ...base, stance: "skip", reason: "初识不收岁末信。" };
  }
  if (isSilent(client) || client.avoid.includes("节日信")) {
    return { ...base, stance: "skip", reason: "沉默或明确拒绝节日信。改护理，或不写。" };
  }
  if (client.occasion || client.tier === "密友") {
    return { ...base, stance: "personal", reason: "密友或有具体事情的人，信要单独写一行。" };
  }
  return { ...base, stance: "standard", reason: "可收同一封岁末信，仍由顾问署名。" };
}

export function planGuests(salonId: string): Placement[] {
  const salon = salonById(salonId);
  return clients.map((client) => (salon.mode === "letter" ? judgeLetter(client) : judgeVisit(salon, client)));
}

export function seatsLeft(salonId: string, invited: string[]) {
  const salon = salonById(salonId);
  if (salon.seats === null) return null;
  return Math.max(0, salon.seats - salon.held - invited.length);
}

function upcomingInvite(client: Client) {
  return salons
    .filter((salon) => salon.mode !== "letter")
    .filter((salon) => {
      const distance = daysUntil(salon.date);
      return distance >= 0 && distance <= 16;
    })
    .filter((salon) => judgeVisit(salon, client).stance === "invite")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function advise(client: Client): Advice {
  const authored = SCRIPTS[client.id];
  if (!authored) throw new Error(`缺少话术 ${client.id}`);

  if (client.occasion && daysUntil(client.occasion.date) >= 0 && daysUntil(client.occasion.date) <= 21) {
    return {
      clientId: client.id,
      kind: "occasion",
      priority: 90 + (21 - daysUntil(client.occasion.date)),
      salonId: undefined,
      ...authored,
    };
  }

  if (isSilent(client)) {
    return {
      clientId: client.id,
      kind: "silence",
      priority: 70 + Math.min(20, Math.floor(daysSince(client.lastTouch) / 10)),
      ...authored,
    };
  }

  const salon = upcomingInvite(client);
  if (salon) {
    let priority = 60 + Math.max(0, 16 - daysUntil(salon.date));
    if (daysSince(client.lastTouch) < 10) priority = 42;
    return {
      clientId: client.id,
      kind: "salon",
      priority,
      salonId: salon.id,
      ...authored,
    };
  }

  if (client.tier === "初识") {
    return { clientId: client.id, kind: "nurture", priority: 40, ...authored };
  }

  return { clientId: client.id, kind: "steady", priority: 30, ...authored };
}

export function adviseAll() {
  return clients.map((client) => advise(client)).sort((a, b) => b.priority - a.priority);
}

export type Decision = {
  id: string;
  tone: "do" | "dont";
  kicker: string;
  title: string;
  detail: string;
  href: string;
  action: string;
};

export function morningDecisions(invited: Record<string, string[]>): Decision[] {
  const left = seatsLeft("quiet", invited.quiet ?? []);
  return [
    {
      id: "zhou-viewing",
      tone: "do",
      kicker: "关系",
      title: "周予安的生日看货，今天定时间",
      detail: "配偶生日在 16 日。夜航只在国金的白天看，不发图，不办晚宴。",
      href: "/clients?id=zhou-yuan",
      action: "去写这封短信",
    },
    {
      id: "gu-letters",
      tone: "do",
      kicker: "履约",
      title: "顾行舟的四件旧信夹开始做",
      detail: "20 日前要分开包装。信手写，外观没有字母，也没有企业标志。",
      href: "/clients?id=gu-xingzhou",
      action: "去核对禁忌",
    },
    {
      id: "quiet-seats",
      tone: "do",
      kicker: "体验",
      title: left === 0 ? "静水私享已按标准补满" : `静水私享还空 ${left} 席`,
      detail:
        left === 0
          ? "席位已经留出。不要再从消费榜上往里加人。"
          : "只考虑林晚宁和江晚来。留下至少一席，满席不是目标。",
      href: "/calendar?id=quiet",
      action: "去看嘉宾",
    },
    {
      id: "su-restraint",
      tone: "dont",
      kicker: "今天不做",
      title: "不向苏曼介绍新品",
      detail: "她去年说过不想增加物件。若要联系，只为旧信夹的边缘。岁末信也不发给她。",
      href: "/clients?id=su-man",
      action: "看那封不卖的短信",
    },
  ];
}

export function yearEndLetter() {
  return [
    "岁末不另做活动。",
    "价格与平日相同，预约仍在白天。",
    "若旧物需要护理，把物件带来即可。",
    "若什么都不需要，这封信到此为止。",
    "",
    "不附清单。节日不改价格。",
  ].join("\n");
}

export function silentClients() {
  return clients.filter((client) => isSilent(client));
}

export function pieceName(id: string) {
  return productById(id).name;
}
