import PptxGenJS from "pptxgenjs";

export const runtime = "nodejs";

const DESCRIPTION = {
  description: "生成包含架构图、方法论、案例和优缺点分析的 PowerPoint。",
  method: "POST",
  contentType: "application/json",
  presets: ["azure-21v", "gea-data-ai"],
  examples: { preset: { preset: "azure-21v" } },
  slides: ["封面", "架构图", "方法论", "案例", "优缺点"],
};

const MAX_BODY = 6_000_000;

function text(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").slice(0, max);
}

function list(value, maxItems, maxLen) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => text(item, maxLen)).filter(Boolean);
}

function imageData(value) {
  if (typeof value !== "string") return "";
  if (value.length > 4_000_000) return "";
  if (!/^data:image\/(png|jpeg);base64,[a-z0-9+/=\s]+$/i.test(value)) return "";
  return value;
}

function fileName(title) {
  const base = text(title, 40).replace(/[\\/:*?"<>|\r\n]+/g, " ").trim() || "文稿";
  return `${base}.pptx`;
}

export function GET() {
  return Response.json(DESCRIPTION);
}

export async function POST(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return Response.json({ error: "文稿太大。" }, { status: 413 });
  }
  let deck;
  try {
    deck = JSON.parse(raw);
  } catch {
    return Response.json({ error: "文稿格式读不了。" }, { status: 400 });
  }
  if (!deck || typeof deck !== "object" || Array.isArray(deck)) {
    return Response.json({ error: "文稿格式读不了。" }, { status: 400 });
  }

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "演示文稿工坊";
  pptx.title = text(deck.title, 80) || "文稿";

  const ink = "142033";
  const muted = "5E6D80";
  const blue = "0F6CBD";
  const face = "Microsoft YaHei";

  const cover = pptx.addSlide();
  cover.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: "F7F9FB" },
  });
  cover.addText(text(deck.eyebrow, 40) || "演示文稿", {
    x: 0.7,
    y: 1.7,
    w: 11.5,
    h: 0.4,
    fontFace: face,
    fontSize: 14,
    color: blue,
    margin: 0,
  });
  cover.addText(text(deck.title, 80) || "未命名文稿", {
    x: 0.7,
    y: 2.2,
    w: 11.5,
    h: 1.6,
    fontFace: face,
    fontSize: 32,
    bold: true,
    color: ink,
    margin: 0,
  });
  cover.addText(text(deck.subtitle, 160), {
    x: 0.7,
    y: 4.1,
    w: 10.5,
    h: 1,
    fontFace: face,
    fontSize: 16,
    color: muted,
    margin: 0,
  });

  const architecture = deck.architecture && typeof deck.architecture === "object" ? deck.architecture : {};
  const arch = pptx.addSlide();
  arch.addText(text(architecture.title, 80) || "架构图", {
    x: 0.5,
    y: 0.35,
    w: 12.3,
    h: 0.5,
    fontFace: face,
    fontSize: 24,
    bold: true,
    color: ink,
    margin: 0,
  });
  arch.addText(text(architecture.summary, 400), {
    x: 0.5,
    y: 1,
    w: 12.3,
    h: 0.7,
    fontFace: face,
    fontSize: 14,
    color: muted,
    margin: 0,
  });
  const bullets = list(architecture.bullets, 8, 80);
  if (bullets.length) {
    arch.addText(bullets.map((item) => ({ text: item, options: { bullet: true, breakLine: true } })), {
      x: 0.5,
      y: 1.8,
      w: 5.2,
      h: 4.8,
      fontFace: face,
      fontSize: 16,
      color: ink,
      paraSpaceAfter: 10,
    });
  }
  const picture = imageData(architecture.imageDataUrl);
  if (picture) {
    arch.addImage({ data: picture, x: 6, y: 1.8, w: 6.8, h: 4.8 });
  }

  const methodology = deck.methodology && typeof deck.methodology === "object" ? deck.methodology : {};
  const method = pptx.addSlide();
  method.addText(text(methodology.title, 80) || "方法论", {
    x: 0.5,
    y: 0.35,
    w: 12.3,
    h: 0.5,
    fontFace: face,
    fontSize: 24,
    bold: true,
    color: ink,
    margin: 0,
  });
  method.addText(text(methodology.principle, 400), {
    x: 0.5,
    y: 1,
    w: 12.3,
    h: 0.8,
    fontFace: face,
    fontSize: 15,
    color: muted,
    margin: 0,
  });
  const steps = Array.isArray(methodology.steps) ? methodology.steps.slice(0, 8) : [];
  method.addText(
    steps.map((step) => ({
      text: `${text(step?.name, 40)}  ${text(step?.detail, 180)}`.trim(),
      options: { bullet: true, breakLine: true },
    })),
    {
      x: 0.5,
      y: 2,
      w: 12.3,
      h: 4.8,
      fontFace: face,
      fontSize: 15,
      color: ink,
      paraSpaceAfter: 8,
    },
  );

  const cases = deck.cases && typeof deck.cases === "object" ? deck.cases : {};
  const items = Array.isArray(cases.items) ? cases.items.slice(0, 6) : [];
  if (items.length === 0) items.push({});
  items.forEach((item, index) => {
    const slide = pptx.addSlide();
    slide.addText(text(cases.title, 40) || "案例", {
      x: 0.5,
      y: 0.35,
      w: 12.3,
      h: 0.35,
      fontFace: face,
      fontSize: 14,
      color: blue,
      margin: 0,
    });
    slide.addText(text(item?.name, 80) || `案例 ${index + 1}`, {
      x: 0.5,
      y: 0.8,
      w: 12.3,
      h: 0.6,
      fontFace: face,
      fontSize: 24,
      bold: true,
      color: ink,
      margin: 0,
    });
    const blocks = [
      ["背景", text(item?.context, 400)],
      ["动作", text(item?.action, 400)],
      ["结果", text(item?.result, 400)],
    ];
    blocks.forEach(([label, body], row) => {
      slide.addText(label, {
        x: 0.5,
        y: 1.7 + row * 1.6,
        w: 1.2,
        h: 0.4,
        fontFace: face,
        fontSize: 14,
        bold: true,
        color: blue,
        margin: 0,
      });
      slide.addText(body, {
        x: 1.8,
        y: 1.7 + row * 1.6,
        w: 10.8,
        h: 1.4,
        fontFace: face,
        fontSize: 15,
        color: ink,
        margin: 0,
      });
    });
  });

  const tradeoff = deck.tradeoff && typeof deck.tradeoff === "object" ? deck.tradeoff : {};
  const trade = pptx.addSlide();
  trade.addText(text(tradeoff.title, 80) || "优缺点", {
    x: 0.5,
    y: 0.35,
    w: 12.3,
    h: 0.5,
    fontFace: face,
    fontSize: 24,
    bold: true,
    color: ink,
    margin: 0,
  });
  const columns = [
    ["优点", list(tradeoff.pros, 8, 120), "0E7C66"],
    ["缺点", list(tradeoff.cons, 8, 120), "9F2236"],
  ];
  columns.forEach(([label, points, color], index) => {
    trade.addText(label, {
      x: 0.5 + index * 6.4,
      y: 1.1,
      w: 6,
      h: 0.4,
      fontFace: face,
      fontSize: 16,
      bold: true,
      color,
      margin: 0,
    });
    trade.addText(points.map((item) => ({ text: item, options: { bullet: true, breakLine: true } })), {
      x: 0.5 + index * 6.4,
      y: 1.6,
      w: 6,
      h: 3.6,
      fontFace: face,
      fontSize: 14,
      color: ink,
      paraSpaceAfter: 8,
    });
  });
  trade.addText(text(tradeoff.recommendation, 300), {
    x: 0.5,
    y: 5.6,
    w: 12.3,
    h: 1.3,
    fontFace: face,
    fontSize: 15,
    color: muted,
    margin: 0,
  });

  const output = await pptx.write({ outputType: "nodebuffer" });
  const body = output instanceof Uint8Array ? output : Buffer.from(output);
  const name = encodeURIComponent(fileName(deck.title));
  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename*=UTF-8''${name}`,
      "Cache-Control": "no-store",
    },
  });
}
