"use client";

import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { gates } from "./gates.js";

const registry = {
  43476: { jsx, jsxs, Fragment },
  22016: { __esModule: true, default: Link },
  71645: React,
  31270: { f: gates },
};

function load(factory) {
  const exported = {};
  const runtime = {
    i(id) {
      const mod = registry[id];
      if (!mod) throw new Error("Missing module " + id);
      return mod;
    },
    s(spec, id) {
      const bucket = {};
      for (let i = 0; i < spec.length; i += 3) bucket[spec[i]] = spec[i + 2];
      if (id != null) registry[id] = bucket;
      Object.assign(exported, bucket);
    },
  };
  factory(runtime);
  return exported;
}

const factory = (e) => {
      var t = e.i(43476),
        s = e.i(22016),
        r = e.i(71645),
        a = e.i(31270);
      let n = [
          { name: "大衣", share: 0.46 },
          { name: "手袋", share: 0.24 },
          { name: "配饰", share: 0.18 },
          { name: "腕表", share: 0.12 },
        ],
        l = [
          { name: "大衣", share: 0.58 },
          { name: "手袋", share: 0.27 },
          { name: "配饰", share: 0.15 },
        ],
        i = [
          {
            id: "sh-huaihai",
            city: "上海",
            name: "淮海",
            door: "旗舰",
            x: 76,
            y: 56,
            visitors: 83,
            deals: 16,
            atv: 43256,
            churn: 0.167,
            prevChurn: 0.142,
            convMom: 0.051,
            trafficMom: 0.021,
            salesMom: 0.186,
            mix: n,
          },
          {
            id: "sh-guojin",
            city: "上海",
            name: "国金",
            door: "旗舰",
            x: 80,
            y: 61,
            visitors: 105,
            deals: 28,
            atv: 32393,
            churn: 0.049,
            prevChurn: 0.061,
            convMom: 0.115,
            trafficMom: 0.04,
            salesMom: 0.08,
            mix: n,
          },
          {
            id: "sh-henglong",
            city: "上海",
            name: "港汇恒隆",
            door: "专卖",
            x: 73,
            y: 63,
            visitors: 41,
            deals: 7,
            atv: 27188,
            churn: 0.152,
            prevChurn: 0.11,
            convMom: -0.296,
            trafficMom: -0.02,
            salesMom: -0.18,
            mix: l,
          },
          {
            id: "sh-taikoo",
            city: "上海",
            name: "前滩太古里",
            door: "专卖",
            x: 83,
            y: 65,
            visitors: 45,
            deals: 6,
            atv: 25940,
            churn: 0.083,
            prevChurn: 0.07,
            convMom: -0.033,
            trafficMom: 0.01,
            salesMom: -0.02,
            mix: l,
          },
          {
            id: "bj-skp",
            city: "北京",
            name: "SKP",
            door: "旗舰",
            x: 62,
            y: 32,
            visitors: 113,
            deals: 28,
            atv: 42739,
            churn: 0.152,
            prevChurn: 0.13,
            convMom: 0.432,
            trafficMom: 0.03,
            salesMom: 0.12,
            mix: n,
          },
          {
            id: "bj-guomao",
            city: "北京",
            name: "国贸",
            door: "预约室",
            x: 67,
            y: 28,
            visitors: 12,
            deals: 7,
            atv: 116449,
            churn: 0.159,
            prevChurn: 0.12,
            convMom: 0.167,
            trafficMom: 0,
            salesMom: 0.09,
            mix: [
              { name: "腕表", share: 0.7 },
              { name: "大衣", share: 0.3 },
            ],
          },
          {
            id: "sz-mixc",
            city: "深圳",
            name: "万象城",
            door: "旗舰",
            x: 70,
            y: 80,
            visitors: 69,
            deals: 14,
            atv: 35201,
            churn: 0.142,
            prevChurn: 0.128,
            convMom: 0.004,
            trafficMom: 0.015,
            salesMom: 0.02,
            mix: n,
          },
          {
            id: "gz-taikoo",
            city: "广州",
            name: "太古汇",
            door: "旗舰",
            x: 66,
            y: 74,
            visitors: 102,
            deals: 28,
            atv: 42371,
            churn: 0.105,
            prevChurn: 0.112,
            convMom: 0.125,
            trafficMom: 0.02,
            salesMom: 0.06,
            mix: n,
          },
          {
            id: "cd-taikoo",
            city: "成都",
            name: "太古里",
            door: "旗舰",
            x: 46,
            y: 62,
            visitors: 74,
            deals: 13,
            atv: 50139,
            churn: 0.105,
            prevChurn: 0.098,
            convMom: 0.054,
            trafficMom: 0.01,
            salesMom: 0.03,
            mix: n,
          },
          {
            id: "hz-dasha",
            city: "杭州",
            name: "大厦",
            door: "旗舰",
            x: 78,
            y: 50,
            visitors: 74,
            deals: 20,
            atv: 41748,
            churn: 0.125,
            prevChurn: 0.11,
            convMom: 0.25,
            trafficMom: 0.025,
            salesMom: 0.11,
            mix: n,
          },
          {
            id: "cq-guojin",
            city: "重庆",
            name: "国金",
            door: "专卖",
            x: 48,
            y: 68,
            visitors: 46,
            deals: 7,
            atv: 19698,
            churn: 0.093,
            prevChurn: 0.08,
            convMom: -0.413,
            trafficMom: 0.08,
            salesMom: -0.22,
            mix: l,
          },
          {
            id: "wx-henglong",
            city: "无锡",
            name: "恒隆",
            door: "专卖",
            x: 82,
            y: 48,
            visitors: 31,
            deals: 7,
            atv: 16108,
            churn: 0.161,
            prevChurn: 0.05,
            convMom: 0.27,
            trafficMom: 0.01,
            salesMom: 0.04,
            mix: l,
          },
        ],
        c = "2026.11.07 18:30",
        o = [
          {
            storeId: "sh-guojin",
            name: "林女士",
            note: "已匿名 · 上海国金 · 腕表",
            interest: "腕表",
            lastVisit: "10月12日",
            looking: "36mm 金壳，两只",
            withhold: "主动折扣",
            draft:
              "下周三国金有一组到店的金壳，按您上次看的尺寸留了两只。不必为这一次专程过来。",
          },
          {
            storeId: "sh-huaihai",
            name: "周先生",
            note: "已匿名 · 上海淮海 · 大衣",
            interest: "大衣",
            lastVisit: "11月2日",
            looking: "驼色双面呢，一件",
            withhold: "库存还剩几件",
            draft:
              "淮海这一周到了一件您看过的驼色。肩宽按上次留下的尺寸。要不要顾问在店里等您。",
          },
        ],
        d = {
          clause: "租赁合同 · 第三条",
          note: "保底租金按月计。条款后段还有一个阶梯，模型没有读完。原文留在租户，不送去公有模型。",
          read: "每月 86 万",
          confidence: 0.62,
          source: "未出域",
          bill: "这一期只收国金店那一份标准 Excel。其他版式先不进模型，时间不耗在版式上。",
          decision: "已停",
          decisionBody:
            "看起来合理，也不放行。等人确认保底之后，才进入这个月的租金。",
        },
        x = [
          {
            door: "国金店",
            ratio: "25%",
            lens: "财务口径",
            alert: "未开",
            match: (e) => e.name.includes("国金"),
          },
          {
            door: "国金店",
            ratio: "30%",
            lens: "营运口径",
            alert: "未开",
            match: (e) => e.name.includes("国金"),
          },
          {
            door: "恒隆店",
            ratio: "—",
            lens: "接口未给数",
            alert: "不叫红灯",
            match: (e) => e.name.includes("恒隆"),
          },
          {
            door: "太古店",
            ratio: "待导入",
            lens: "全成本改 Excel",
            alert: "未开",
            match: (e) => e.name.includes("太古"),
          },
        ];
      function m(e) {
        return new Intl.NumberFormat("zh-CN", {
          style: "currency",
          currency: "CNY",
          maximumFractionDigits: 0,
        }).format(e);
      }
      function h(e, t = 1) {
        return `${(100 * e).toFixed(t)}%`;
      }
      function u(e) {
        return `${e > 0 ? "+" : ""}${(100 * e).toFixed(1)}%`;
      }
      function p(e) {
        return e.deals / e.visitors;
      }
      function f(e) {
        return e.deals * e.atv;
      }
      function g(e, t) {
        let s = t.reduce((e, t) => e + t, 0) || 1,
          r = t.map((t) => (t / s) * e),
          a = r.map((e) => Math.floor(e)),
          n = e - a.reduce((e, t) => e + t, 0),
          l = r
            .map((e, t) => ({ index: t, frac: e - Math.floor(e) }))
            .sort((e, t) => t.frac - e.frac);
        for (let e = 0; e < n; e += 1) a[l[e % l.length].index] += 1;
        return a;
      }
      function j(e) {
        return "旗舰" === e.door ? 1.8 : "预约室" === e.door ? 1.15 : 1.4;
      }
      let b = {
        旗舰: [
          { name: "橱窗", x: 4, y: 6, w: 34, h: 22, weight: 7, priced: !1 },
          { name: "入口", x: 4, y: 32, w: 34, h: 24, weight: 10, priced: !1 },
          { name: "大衣", x: 42, y: 6, w: 52, h: 50, weight: 24, priced: !0 },
          { name: "手袋", x: 98, y: 6, w: 28, h: 28, weight: 16, priced: !0 },
          { name: "配饰", x: 130, y: 6, w: 26, h: 28, weight: 8, priced: !0 },
          { name: "试衣", x: 98, y: 38, w: 28, h: 46, weight: 10, priced: !1 },
          { name: "沙发", x: 130, y: 38, w: 26, h: 46, weight: 8, priced: !1 },
        ],
        专卖: [
          { name: "入口", x: 4, y: 8, w: 36, h: 74, weight: 12, priced: !1 },
          { name: "大衣", x: 44, y: 8, w: 58, h: 74, weight: 28, priced: !0 },
          { name: "手袋", x: 106, y: 8, w: 50, h: 36, weight: 14, priced: !0 },
          { name: "试衣", x: 106, y: 48, w: 50, h: 34, weight: 10, priced: !1 },
        ],
        预约室: [
          { name: "会客", x: 4, y: 8, w: 70, h: 74, weight: 16, priced: !1 },
          { name: "大衣", x: 78, y: 8, w: 36, h: 74, weight: 10, priced: !0 },
          { name: "腕表", x: 118, y: 8, w: 38, h: 74, weight: 18, priced: !0 },
        ],
      };
      function y() {
        return a.f.filter((e) => "未放行" === e.stance);
      }
      function v(e) {
        return `${e.city}${e.name}`;
      }
      let N = { fontFamily: '"Noto Serif SC", "Noto Sans SC", serif' };
      function w({ label: e, value: s, delta: r }) {
        return (0, t.jsxs)("div", {
          className: "border border-[#e4d7c4] bg-[#faf7f2] px-4 py-3",
          children: [
            (0, t.jsx)("p", {
              className: "text-[11px] tracking-[0.2em] text-[#8c7344]",
              children: e,
            }),
            (0, t.jsx)("p", {
              className: "mt-2 text-xl tabular-nums sm:text-2xl",
              style: N,
              children: s,
            }),
            (0, t.jsx)("p", {
              className: "mt-1 text-xs text-[#6f675c]",
              children: r,
            }),
          ],
        });
      }
      function k({ store: e, onChoose: s }) {
        let r = new Map();
        for (let e of i) {
          let t = r.get(e.city) ?? { x: 0, y: 0, n: 0 };
          ((t.x += e.x), (t.y += e.y), (t.n += 1), r.set(e.city, t));
        }
        return (0, t.jsxs)("div", {
          className: "relative mt-4 aspect-[4/3] bg-[#f7f1e6]",
          children: [
            (0, t.jsxs)("svg", {
              viewBox: "0 0 100 100",
              className: "absolute inset-0 h-full w-full",
              "aria-hidden": "true",
              children: [
                (0, t.jsx)("rect", {
                  width: "100",
                  height: "100",
                  fill: "#f7f1e6",
                }),
                [20, 40, 60, 80].map((e) =>
                  (0, t.jsx)(
                    "line",
                    {
                      x1: "6",
                      y1: e,
                      x2: "94",
                      y2: e,
                      stroke: "#eadfce",
                      strokeWidth: "0.2",
                    },
                    e,
                  ),
                ),
                [...r.entries()].map(([e, s]) =>
                  (0, t.jsx)(
                    "text",
                    {
                      x: s.x / s.n,
                      y: Math.max(4, s.y / s.n - 6.5),
                      textAnchor: "middle",
                      fill: "#8a8175",
                      fontSize: "2.4",
                      children: e,
                    },
                    e,
                  ),
                ),
              ],
            }),
            i.map((r) => {
              let a = r.id === e.id,
                n = 14 + r.visitors / 8;
              return (0, t.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => s(r),
                  "aria-pressed": a,
                  "aria-label": `${v(r)} ${r.visitors}人 转化 ${h(p(r))}`,
                  className:
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                  style: {
                    left: `${r.x}%`,
                    top: `${r.y}%`,
                    width: n,
                    height: n,
                    background: r.convMom < 0 ? "#8d3b32" : "#b08948",
                    boxShadow: a
                      ? "0 0 0 4px #f3eee6, 0 0 0 6px #1c1915"
                      : void 0,
                  },
                },
                r.id,
              );
            }),
          ],
        });
      }
      function $({ floorZones: e, activeId: s, pathEnd: r, onChoose: a }) {
        let n = e.find((e) => "入口" === e.name || "会客" === e.name) ?? e[0],
          l = e.find((e) => e.name === r) ?? e[0],
          i = Math.max(...e.map((e) => e.people));
        return (0, t.jsx)("div", {
          className: "border border-[#e4d7c4] bg-[#faf7f2] p-3",
          children: (0, t.jsxs)("svg", {
            viewBox: "0 0 160 90",
            className: "h-auto w-full",
            children: [
              (0, t.jsx)("rect", {
                width: "160",
                height: "90",
                fill: "#faf7f2",
              }),
              (0, t.jsx)("line", {
                x1: n.x + n.w / 2,
                y1: n.y + n.h / 2,
                x2: l.x + l.w / 2,
                y2: l.y + l.h / 2,
                stroke: "#b08948",
                strokeWidth: "0.6",
                strokeDasharray: "1.4 1.1",
              }),
              e.map((e) => {
                let r = e.id === s,
                  n = 0.18 + (e.people / i) * 0.55;
                return (0, t.jsxs)(
                  "g",
                  {
                    role: "button",
                    tabIndex: 0,
                    "aria-pressed": r,
                    "aria-label": `${e.name} ${e.people}人`,
                    className: "cursor-pointer",
                    onClick: () => a(e.id),
                    onKeyDown: (t) => {
                      ("Enter" === t.key || " " === t.key) &&
                        (t.preventDefault(), a(e.id));
                    },
                    children: [
                      (0, t.jsx)("rect", {
                        x: e.x,
                        y: e.y,
                        width: e.w,
                        height: e.h,
                        fill: `rgba(176, 137, 72, ${n})`,
                        stroke: r ? "#1c1915" : "#cbb892",
                        strokeWidth: r ? 0.7 : 0.3,
                      }),
                      (0, t.jsx)("text", {
                        x: e.x + 2,
                        y: e.y + 5,
                        fill: "#1c1915",
                        fontSize: "3.1",
                        children: e.name,
                      }),
                      (0, t.jsxs)("text", {
                        x: e.x + 2,
                        y: e.y + 9.2,
                        fill: "#3c342c",
                        fontSize: "2.6",
                        children: [e.people, " 人"],
                      }),
                    ],
                  },
                  e.id,
                );
              }),
            ],
          }),
        });
      }
      function M({ id: e, kicker: s, title: r, caption: a, children: n }) {
        return (0, t.jsxs)("section", {
          id: e,
          className: "scroll-mt-16 mt-8",
          children: [
            (0, t.jsxs)("div", {
              className:
                "mb-3 flex flex-wrap items-baseline justify-between gap-2",
              children: [
                (0, t.jsxs)("h3", {
                  className: "text-lg",
                  style: N,
                  children: [
                    (0, t.jsx)("span", {
                      className: "mr-3 text-[#b08948]",
                      children: s,
                    }),
                    r,
                  ],
                }),
                (0, t.jsx)("p", {
                  className: "max-w-xl text-xs leading-5 text-[#6f675c]",
                  children: a,
                }),
              ],
            }),
            (0, t.jsx)("div", {
              className:
                "overflow-hidden border border-[#e4d7c4] xl:aspect-video",
              children: n,
            }),
          ],
        });
      }
      function C({ k: e, v: s }) {
        return (0, t.jsxs)("div", {
          children: [
            (0, t.jsx)("dt", {
              className: "text-[11px] tracking-[0.14em] text-[#b7aa98]",
              children: e,
            }),
            (0, t.jsx)("dd", { className: "mt-1 text-[#f4efe6]", children: s }),
          ],
        });
      }
      function S({ n: e, title: s, body: r, tag: a }) {
        return (0, t.jsxs)("li", {
          className: "border border-[#6b5a3e] px-4 py-3",
          children: [
            (0, t.jsxs)("div", {
              className: "flex items-baseline justify-between gap-3",
              children: [
                (0, t.jsx)("p", {
                  className: "text-xs tracking-[0.16em] text-[#c6a56a]",
                  children: e,
                }),
                (0, t.jsx)("p", {
                  className: "text-[11px] tracking-[0.16em] text-[#b7aa98]",
                  children: a,
                }),
              ],
            }),
            (0, t.jsx)("p", {
              className: "mt-1 text-lg",
              style: N,
              children: s,
            }),
            (0, t.jsx)("p", {
              className: "mt-1 text-xs leading-5 text-[#d9d0c3]",
              children: r,
            }),
          ],
        });
      }
      function E({ k: e, v: s }) {
        return (0, t.jsxs)("div", {
          className:
            "grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-[#eadfce] pb-2",
          children: [
            (0, t.jsx)("dt", { className: "text-[#8a8175]", children: e }),
            (0, t.jsx)("dd", { children: s }),
          ],
        });
      }
      function P({ k: e, v: s, warn: r = !1 }) {
        return (0, t.jsxs)("div", {
          className: "border-r border-[#e4d7c4] px-3 py-3 last:border-r-0",
          children: [
            (0, t.jsx)("dt", {
              className: "text-[11px] tracking-[0.14em] text-[#8a8175]",
              children: e,
            }),
            (0, t.jsx)("dd", {
              className: `mt-2 text-lg ${r ? "text-[#8d3b32]" : "text-[#1c1915]"}`,
              style: N,
              children: s,
            }),
          ],
        });
      }
      e.s(
        [
          "TwinBoard",
          0,
          function (sceneProps) {
            let scene = (sceneProps && sceneProps.scene) || "boundary",
              e,
              n,
              l,
              _,
              I = (0, r.useMemo)(() => {
                let e, t, s, r;
                return (
                  (e = (function (e) {
                    let t = e.reduce((e, t) => e + t.visitors, 0),
                      s = e.reduce((e, t) => e + t.deals, 0),
                      r = e.reduce((e, t) => e + f(t), 0),
                      a = e.reduce(
                        (e, t) => e + t.visitors / (1 + t.trafficMom),
                        0,
                      ),
                      n = e.reduce((e, t) => e + f(t) / (1 + t.salesMom), 0),
                      l = e.reduce(
                        (e, t) =>
                          e +
                          (t.visitors / (1 + t.trafficMom)) *
                            (p(t) / (1 + t.convMom)),
                        0,
                      ),
                      i = e.reduce((e, t) => e + t.churn * t.visitors, 0) / t,
                      c =
                        e.reduce((e, t) => e + t.prevChurn * t.visitors, 0) / t,
                      o = new Map();
                    for (let t of e) {
                      let e = g(
                          Math.round(t.deals * j(t)),
                          t.mix.map((e) => e.share),
                        ),
                        s = g(
                          f(t),
                          t.mix.map((e) => e.share),
                        );
                      t.mix.forEach((t, r) => {
                        let a = o.get(t.name) ?? {
                          name: t.name,
                          pieces: 0,
                          amount: 0,
                        };
                        ((a.pieces += e[r]),
                          (a.amount += s[r]),
                          o.set(t.name, a));
                      });
                    }
                    let d = s / t;
                    return {
                      visitors: t,
                      deals: s,
                      sales: r,
                      atv: r / s,
                      conversion: d,
                      churn: i,
                      trafficMom: t / a - 1,
                      salesMom: r / n - 1,
                      convMom: d / (l / a) - 1,
                      atvMom: r / s / (n / l) - 1,
                      churnMom: i / c - 1,
                      categories: [...o.values()].sort(
                        (e, t) => t.amount - e.amount,
                      ),
                    };
                  })(i)),
                  (t = [...i].sort((e, t) => e.convMom - t.convMom)[0]),
                  (s = [...i].sort(
                    (e, t) => t.churn - t.prevChurn - (e.churn - e.prevChurn),
                  )[0]),
                  (r = e.categories[0]),
                  {
                    net: e,
                    lines: [
                      `截至样本 ${c}，${i.length} 家店的转化是 ${h(e.conversion)}，环比上月同刻 ${u(e.convMom)}。人流 ${u(e.trafficMom)}，成交额 ${u(e.salesMom)}。`,
                      `${t.city}${t.name}人来了，转化掉得最多，环比 ${u(t.convMom)}。先看顾问在不在，而不是再加人流。`,
                      `${r.name}是此刻成交额最大的类别，${m(r.amount)}。客单价要跟类别一起看。`,
                      `${s.city}${s.name}的流失率从 ${h(s.prevChurn)} 到 ${h(s.churn)}。这是名册的事，不是橱窗的事。`,
                    ],
                  }
                );
              }, []),
              [T, F] = (0, r.useState)(i[0].id),
              [O, L] = (0, r.useState)(null),
              [z, R] = (0, r.useState)(0),
              [B, A] = (0, r.useState)(!1),
              [U, D] = (0, r.useState)(""),
              [K, W] = (0, r.useState)({}),
              V = i.find((e) => e.id === T) ?? i[0],
              q = (0, r.useMemo)(() => {
                let e, t, s, r, a, n, l, i, c, o, d, x, m;
                return (
                  (e = b[V.door]),
                  (t = g(
                    V.visitors,
                    e.map((e) => e.weight),
                  )),
                  (s = V.mix.map((e, t) => {
                    let s = g(
                        Math.round(V.deals * j(V)),
                        V.mix.map((e) => e.share),
                      ),
                      r = g(
                        f(V),
                        V.mix.map((e) => e.share),
                      );
                    return { name: e.name, pieces: s[t], amount: r[t] };
                  })),
                  (r = e.map((e, r) => {
                    let a = s.find((t) => t.name === e.name);
                    return {
                      id: `${V.id}-${e.name}`,
                      name: e.name,
                      x: e.x,
                      y: e.y,
                      w: e.w,
                      h: e.h,
                      people: t[r],
                      pieces: a?.pieces ?? 0,
                      amount: a?.amount ?? 0,
                      priced: e.priced && !!a,
                    };
                  })),
                  (a =
                    "预约室" === V.door
                      ? ["腕表", "大衣", "腕表"]
                      : ["大衣", "手袋", "配饰"]),
                  (n =
                    "预约室" === V.door
                      ? ["直取腕表", "先看大衣", "坐下来再看腕表"]
                      : ["直取大衣", "沿墙走一圈", "绕到配饰"]),
                  (l =
                    "旗舰" === V.door
                      ? [16, 38.4, 25]
                      : "预约室" === V.door
                        ? [8, 14, 11]
                        : [12, 28, 18]),
                  (i = g(V.deals, [0.36, 0.39, 0.25])),
                  (c = [0.362, 0.393, 0.245]),
                  (o = n.map((e, t) => ({
                    name: e,
                    share: c[t],
                    meters: l[t],
                    deals: i[t],
                    end: a[t] ?? r[0].name,
                  }))),
                  (d = s.reduce((e, t) => e + t.pieces, 0)),
                  (x = o.reduce((e, t) => e + t.share * t.meters, 0)),
                  (m =
                    "旗舰" === V.door
                      ? 0.111
                      : "预约室" === V.door
                        ? 0.045
                        : 0.08),
                  {
                    zones: r,
                    paths: o,
                    categories: s,
                    passers: Math.round(V.visitors / m),
                    entry: m,
                    meters: x,
                    pieces: d,
                    upt: d / V.deals,
                  }
                );
              }, [V]),
              Z =
                q.zones.find((e) => e.id === O) ??
                [...q.zones].sort((e, t) => t.people - e.people)[0],
              H =
                "sh-guojin" === V.id
                  ? d
                  : V.name.includes("恒隆")
                    ? {
                        clause: "租赁合同 · 在租户里",
                        note: `${V.city}${V.name}的租金接口没有数。合同不出域，这一条不进入计算。`,
                        read: "—",
                        confidence: null,
                        source: "未出域",
                        bill: "标准表还没到。没有表，就不算这个月。",
                        decision: "不叫红灯",
                        decisionBody:
                          "缺的数停在导入。没有数，不写成经营红灯。",
                      }
                    : V.name.includes("太古")
                      ? {
                          clause: "账单 · 还没进模型",
                          note: `${V.city}${V.name}的全成本这一期退回导入。没有标准表之前，不计算租金。`,
                          read: "待导入",
                          confidence: null,
                          source: "未出域",
                          bill: "其他版式先不进模型，时间不耗在版式上。",
                          decision: "未放行",
                          decisionBody:
                            "表还没到。没有标准 Excel，这一家这个月就不进模型。",
                        }
                      : {
                          clause: "这一期没有待审条款",
                          note: "没有待审的保底。合同如果在，也留在租户里，不送去公有模型。",
                          read: "—",
                          confidence: null,
                          source: "未出域",
                          bill: "账单只在收到标准表之后才进模型。",
                          decision: "没有待审",
                          decisionBody:
                            "没有条款要放行。值守不替这家店发明一个红灯。",
                        },
              J = o.find((e) => e.storeId === V.id),
              G = a.f[z];
            function Q(e) {
              F(e.id);
            }
            return (
              (0, r.useEffect)(() => {
                let e = () => {
                  var e;
                  let t, s;
                  return D(
                    ((e = new Date()),
                    (t = new Intl.DateTimeFormat("zh-CN", {
                      timeZone: "Asia/Shanghai",
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                      weekday: "long",
                    }).formatToParts(e)),
                    (s = (e) => t.find((t) => t.type === e)?.value ?? ""),
                    `${s("hour")}:${s("minute")} ${s("weekday")}`),
                  );
                };
                e();
                let t = window.setInterval(e, 3e4);
                return () => window.clearInterval(t);
              }, []),
              (0, r.useEffect)(() => {
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches ||
                  B
                )
                  return;
                let e = window.setInterval(() => {
                  R((e) => (e + 1) % a.f.length);
                }, 3400);
                return () => window.clearInterval(e);
              }, [B]),
              (0, t.jsxs)("div", {
                className: "min-h-full bg-[#f3eee6] text-[#1c1915]",
                children: [
                  (0, t.jsx)("header", {
                    className:
                      "sticky top-0 z-20 border-b border-[#e4d7c4] bg-[#f3eee6]",
                    children: (0, t.jsxs)("div", {
                      className:
                        "mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8",
                      children: [
                        (0, t.jsx)("p", {
                          className:
                            "text-[11px] tracking-[0.32em] text-[#8c7344]",
                          children: "孪生 · 私有化底座",
                        }),
                        (0, t.jsxs)("nav", {
                          className:
                            "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.16em] text-[#6f675c]",
                          children: [
                            (0, t.jsx)(s.default, {
                              href: "/",
                              className: scene === "boundary" ? "text-[#1c1915]" : "hover:text-[#1c1915]",
                              children: "边界",
                            }),
                            (0, t.jsx)(s.default, {
                              href: "/watch",
                              className: scene === "watch" ? "text-[#1c1915]" : "hover:text-[#1c1915]",
                              children: "值守",
                            }),
                            (0, t.jsx)(s.default, {
                              href: "/advisor",
                              className: scene === "advisor" ? "text-[#1c1915]" : "hover:text-[#1c1915]",
                              children: "顾问",
                            }),
                            (0, t.jsx)(s.default, {
                              href: "/review",
                              className: scene === "review" ? "text-[#1c1915]" : "hover:text-[#1c1915]",
                              children: "审阅",
                            }),
                            (0, t.jsx)(s.default, {
                              href: "/caliber",
                              className: scene === "caliber" ? "text-[#1c1915]" : "hover:text-[#1c1915]",
                              children: "口径",
                            }),
                            (0, t.jsx)("a", {
                              href: "/console",
                              className: "hover:text-[#1c1915]",
                              children: "值守台",
                            }),
                            (0, t.jsx)(s.default, {
                              href: "/studio",
                              className: "text-[#8c7344] hover:text-[#1c1915]",
                              children: "文稿",
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  (0, t.jsxs)("main", {
                    className:
                      "mx-auto flex max-w-[1240px] flex-col px-5 py-8 sm:px-8 sm:py-10",
                    children: [
                      scene === "boundary" ? (0, t.jsx)(M, {
                        id: "boundary",
                        kicker: "01",
                        title: "边界代理",
                        caption:
                          "先盖房子，再请模型进来。门店和顾问只走品牌网络，经私有网关进租户内模型。",
                        children: (0, t.jsxs)("div", {
                          className:
                            "grid h-full gap-6 bg-[#14110e] p-5 text-[#f4efe6] sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:p-8",
                          children: [
                            (0, t.jsxs)("div", {
                              className: "flex flex-col",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.32em] text-[#c6a56a]",
                                  children: "私有化底座 · 01",
                                }),
                                (0, t.jsx)("h3", {
                                  className: "mt-3 text-4xl",
                                  style: N,
                                  children: "边界代理",
                                }),
                                (0, t.jsx)("div", {
                                  className: "mt-4 h-px w-12 bg-[#c6a56a]",
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-4 max-w-md text-sm leading-7 text-[#d9d0c3]",
                                  children:
                                    "先把房子盖好，再请模型进来。公有聊天入口是关的。门店、顾问、合同和客档，都只经过品牌自己的网关。",
                                }),
                                (0, t.jsxs)("dl", {
                                  className:
                                    "mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#3a332b] pt-4 text-sm",
                                  children: [
                                    (0, t.jsx)(C, {
                                      k: "客户自管密钥",
                                      v: "已启用",
                                    }),
                                    (0, t.jsx)(C, {
                                      k: "专有终结点",
                                      v: "已接通",
                                    }),
                                    (0, t.jsx)(C, {
                                      k: "问答日志",
                                      v: "留在租户",
                                    }),
                                    (0, t.jsx)(C, { k: "公有模型", v: "不接" }),
                                  ],
                                }),
                                (0, t.jsxs)("p", {
                                  className:
                                    "mt-auto pt-6 text-xs leading-6 text-[#b7aa98]",
                                  children: [
                                    "合同出不去。品牌和法务没点头，这一步就不往下走。现在这一眼是 ",
                                    v(V),
                                    "，走的仍是同一道门。",
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsxs)("ol", {
                              className: "flex flex-col justify-center gap-3",
                              children: [
                                (0, t.jsx)(S, {
                                  n: "01",
                                  title: "门店与顾问",
                                  body: `${v(V)}只走品牌网络，不连公有模型`,
                                  tag: "入站",
                                }),
                                (0, t.jsx)(S, {
                                  n: "02",
                                  title: "私有网关",
                                  body: "身份、权限、审计都在这一层",
                                  tag: "边界",
                                }),
                                (0, t.jsx)(S, {
                                  n: "03",
                                  title: "租户内模型",
                                  body: "目录由品牌指定，版本登记到人",
                                  tag: "不出域",
                                }),
                              ],
                            }),
                          ],
                        }),
                      }) : null,
scene === "watch" ? (0, t.jsx)(M, {
                        id: "watch",
                        kicker: "02",
                        title: "值守代理",
                        caption:
                          "六条门禁同时看着。前三条在执行，后三条未放行。",
                        children: (0, t.jsxs)("div", {
                          className:
                            "flex h-full flex-col bg-[#f7f3ec] p-4 sm:p-5",
                          children: [
                            (0, t.jsxs)("div", {
                              className:
                                "flex flex-wrap items-end justify-between gap-3",
                              children: [
                                (0, t.jsxs)("div", {
                                  children: [
                                    (0, t.jsx)("p", {
                                      className:
                                        "text-[11px] tracking-[0.32em] text-[#8c7344]",
                                      children: "私有化底座 · 02",
                                    }),
                                    (0, t.jsx)("h3", {
                                      className: "mt-1 text-3xl",
                                      style: N,
                                      children: "值守代理",
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)("p", {
                                  className:
                                    "text-right text-xs leading-5 text-[#6f675c]",
                                  children: [
                                    a.f.filter((e) => "执行" === e.stance)
                                      .length,
                                    " 条在执行",
                                    (0, t.jsx)("br", {}),
                                    y().length,
                                    " 条未放行",
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsx)("div", {
                              className:
                                "mt-3 border border-[#e4d7c4] bg-[#faf7f2] px-4 py-3",
                              children: (0, t.jsxs)("div", {
                                className:
                                  "flex flex-wrap items-end justify-between gap-3",
                                children: [
                                  (0, t.jsxs)("div", {
                                    children: [
                                      (0, t.jsx)("p", {
                                        className:
                                          "text-[11px] tracking-[0.22em] text-[#8c7344]",
                                        children: "正在看",
                                      }),
                                      (0, t.jsxs)("p", {
                                        className: "mt-1 text-lg",
                                        style: N,
                                        children: [G.id, " ", G.title],
                                      }),
                                      (0, t.jsx)("p", {
                                        className:
                                          "mt-1 text-sm leading-6 text-[#4e463d]",
                                        children: G.reading,
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("p", {
                                    className:
                                      "text-xs tracking-[0.14em] text-[#8c7344]",
                                    children: [G.stance, " · ", G.order],
                                  }),
                                ],
                              }),
                            }),
                            (0, t.jsx)("div", {
                              className:
                                "mt-3 grid flex-1 gap-2 sm:grid-cols-3",
                              children: a.f.map((e, s) => {
                                let r = s === z,
                                  a = "未放行" === e.stance;
                                return (0, t.jsxs)(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => {
                                      (R(s), A(!0));
                                    },
                                    "aria-pressed": r,
                                    className: `flex flex-col border p-3 text-left ${a ? "border-[#1c1915] bg-[#1c1915] text-[#f4efe6]" : "border-[#e4d7c4] bg-[#faf7f2] text-[#1c1915]"} ${r && !a ? "border-[#b08948]" : ""}`,
                                    children: [
                                      (0, t.jsx)("span", {
                                        className: `text-xs tracking-[0.16em] ${a ? "text-[#c6a56a]" : "text-[#b08948]"}`,
                                        children: e.id,
                                      }),
                                      (0, t.jsx)("span", {
                                        className: "mt-2 text-base",
                                        style: N,
                                        children: e.title,
                                      }),
                                      (0, t.jsx)("span", {
                                        className: `mt-2 flex-1 text-xs leading-5 ${a ? "text-[#d9d0c3]" : "text-[#5c554c]"}`,
                                        children: e.body,
                                      }),
                                      (0, t.jsx)("span", {
                                        className: `mt-3 text-[11px] tracking-[0.16em] ${a ? "text-[#c6a56a]" : "text-[#8c7344]"}`,
                                        children: e.stance,
                                      }),
                                    ],
                                  },
                                  e.id,
                                );
                              }),
                            }),
                            (0, t.jsx)("div", {
                              className: "mt-2 flex justify-end",
                              children: (0, t.jsx)("button", {
                                type: "button",
                                onClick: () => A(!1),
                                disabled: !B,
                                className:
                                  "text-xs tracking-[0.14em] text-[#8c7344] disabled:text-[#c4b8a6]",
                                children: B ? "继续巡看" : "正在巡看",
                              }),
                            }),
                          ],
                        }),
                      }) : null,
scene === "advisor" ? (0, t.jsx)(M, {
                        id: "advisor",
                        kicker: "03",
                        title: "顾问代理",
                        caption:
                          "客档留在租户里。话术可以拟，发出必须等顾问确认。",
                        children: (0, t.jsxs)("div", {
                          className:
                            "grid h-full bg-[#f7f3ec] lg:grid-cols-[0.78fr_1.22fr]",
                          children: [
                            (0, t.jsxs)("div", {
                              className:
                                "border-b border-[#e4d7c4] p-5 sm:p-6 lg:border-r lg:border-b-0",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.32em] text-[#8c7344]",
                                  children: "私有化底座 · 03",
                                }),
                                (0, t.jsx)("h3", {
                                  className: "mt-2 text-3xl",
                                  style: N,
                                  children: "顾问代理",
                                }),
                                (0, t.jsx)("div", {
                                  className: "mt-3 h-px w-12 bg-[#b08948]",
                                }),
                                J
                                  ? (0, t.jsxs)(t.Fragment, {
                                      children: [
                                        (0, t.jsx)("p", {
                                          className: "mt-4 text-2xl",
                                          style: N,
                                          children: J.name,
                                        }),
                                        (0, t.jsx)("p", {
                                          className:
                                            "mt-1 text-xs tracking-[0.12em] text-[#8a8175]",
                                          children: J.note,
                                        }),
                                        (0, t.jsxs)("dl", {
                                          className: "mt-5 space-y-3 text-sm",
                                          children: [
                                            (0, t.jsx)(E, {
                                              k: "上次到店",
                                              v: J.lastVisit,
                                            }),
                                            (0, t.jsx)(E, {
                                              k: "在看",
                                              v: J.looking,
                                            }),
                                            (0, t.jsx)(E, {
                                              k: "不说",
                                              v: J.withhold,
                                            }),
                                            (0, t.jsx)(E, {
                                              k: "客档",
                                              v: "留在品牌租户",
                                            }),
                                          ],
                                        }),
                                      ],
                                    })
                                  : (0, t.jsxs)(t.Fragment, {
                                      children: [
                                        (0, t.jsx)("p", {
                                          className: "mt-4 text-2xl",
                                          style: N,
                                          children: v(V),
                                        }),
                                        (0, t.jsx)("p", {
                                          className:
                                            "mt-4 text-sm leading-7 text-[#3c342c]",
                                          children:
                                            "wx-henglong" === V.id
                                              ? "这一家的名册没有进租户。流失率看得到，人叫不出名字。缺的名册不写成红灯，也不拟话术。"
                                              : "cq-guojin" === V.id
                                                ? "这一分钟先看顾问在不在。没有待确认的话术，是因为人不在柜上。客档没有因此被拿出去问模型。"
                                                : "这一家没有待确认的话术。客档如果有，也留在品牌租户里，不拟、不发。",
                                        }),
                                        (0, t.jsxs)("dl", {
                                          className: "mt-5 space-y-3 text-sm",
                                          children: [
                                            (0, t.jsx)(E, {
                                              k: "客档",
                                              v: "留在品牌租户",
                                            }),
                                            (0, t.jsx)(E, {
                                              k: "话术",
                                              v: "这一分钟不拟",
                                            }),
                                            (0, t.jsx)(E, {
                                              k: "发出",
                                              v: "没有可发的短笺",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: "flex flex-col p-5 sm:p-6",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.28em] text-[#8c7344]",
                                  children: "拟好的短笺",
                                }),
                                J
                                  ? (0, t.jsxs)(t.Fragment, {
                                      children: [
                                        (0, t.jsx)("p", {
                                          className:
                                            "mt-3 text-xl leading-snug",
                                          style: N,
                                          children:
                                            "话术可以拟，发出必须等人。",
                                        }),
                                        (0, t.jsx)("p", {
                                          className:
                                            "mt-4 border-l border-[#b08948] pl-4 text-sm leading-7 text-[#1c1915]",
                                          children: J.draft,
                                        }),
                                        (0, t.jsxs)("div", {
                                          className: "mt-auto space-y-2 pt-6",
                                          children: [
                                            (0, t.jsxs)("button", {
                                              type: "button",
                                              onClick: () =>
                                                W((e) => ({
                                                  ...e,
                                                  [J.storeId]: !e[J.storeId],
                                                })),
                                              className:
                                                "flex w-full items-center justify-between bg-[#1c1915] px-4 py-3 text-left text-sm text-[#f4efe6]",
                                              children: [
                                                (0, t.jsx)("span", {
                                                  children: K[J.storeId]
                                                    ? "顾问已点头。短笺仍留在租户里"
                                                    : "顾问确认前，不发出",
                                                }),
                                                (0, t.jsx)("span", {
                                                  className:
                                                    "text-[11px] tracking-[0.16em] text-[#c6a56a]",
                                                  children: K[J.storeId]
                                                    ? "已确认"
                                                    : "待确认",
                                                }),
                                              ],
                                            }),
                                            (0, t.jsxs)("p", {
                                              className:
                                                "flex items-center justify-between bg-[#1c1915] px-4 py-3 text-sm text-[#f4efe6]",
                                              children: [
                                                (0, t.jsx)("span", {
                                                  children:
                                                    "这封短笺没有离开品牌租户",
                                                }),
                                                (0, t.jsx)("span", {
                                                  className:
                                                    "text-[11px] tracking-[0.16em] text-[#c6a56a]",
                                                  children: "不出域",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    })
                                  : (0, t.jsxs)("div", {
                                      className:
                                        "mt-4 flex flex-1 flex-col justify-between",
                                      children: [
                                        (0, t.jsx)("p", {
                                          className: "text-xl leading-snug",
                                          style: N,
                                          children: "没有短笺，就不存在发出。",
                                        }),
                                        (0, t.jsxs)("p", {
                                          className:
                                            "mt-6 bg-[#1c1915] px-4 py-4 text-sm leading-7 text-[#f4efe6]",
                                          children: [
                                            "公有聊天入口是关的。",
                                            v(V),
                                            "的客档不出租户。值守不把缺席写成一条推销。",
                                          ],
                                        }),
                                      ],
                                    }),
                              ],
                            }),
                          ],
                        }),
                      }) : null,
scene === "review" ? (0, t.jsx)(M, {
                        id: "review",
                        kicker: "04",
                        title: "审阅代理",
                        caption:
                          "合同原文不送去公有模型。置信度不够就停。账单这一期只收一份标准 Excel。",
                        children: (0, t.jsxs)("div", {
                          className: "grid h-full bg-[#f7f3ec] lg:grid-cols-2",
                          children: [
                            (0, t.jsxs)("div", {
                              className:
                                "border-b border-[#e4d7c4] p-5 sm:p-6 lg:border-r lg:border-b-0",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.32em] text-[#8c7344]",
                                  children: "私有化底座 · 04",
                                }),
                                (0, t.jsx)("h3", {
                                  className: "mt-2 text-3xl",
                                  style: N,
                                  children: "审阅代理",
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-5 text-sm tracking-[0.08em] text-[#8c7344]",
                                  children: v(V),
                                }),
                                (0, t.jsx)("p", {
                                  className: "mt-2 text-lg",
                                  style: N,
                                  children: H.clause,
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-2 text-sm leading-7 text-[#4e463d]",
                                  children: H.note,
                                }),
                                (0, t.jsxs)("dl", {
                                  className:
                                    "mt-5 grid grid-cols-3 border border-[#e4d7c4]",
                                  children: [
                                    (0, t.jsx)(P, { k: "读到", v: H.read }),
                                    (0, t.jsx)(P, {
                                      k: "置信度",
                                      v:
                                        null === H.confidence
                                          ? "—"
                                          : H.confidence.toFixed(2),
                                      warn:
                                        null !== H.confidence &&
                                        H.confidence < 0.8,
                                    }),
                                    (0, t.jsx)(P, { k: "原文", v: H.source }),
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className: "mt-5 text-sm",
                                  style: N,
                                  children: "账单",
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-2 text-sm leading-7 text-[#4e463d]",
                                  children: H.bill,
                                }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: "flex flex-col gap-3 p-4 sm:p-5",
                              children: [
                                (0, t.jsxs)("div", {
                                  className:
                                    "flex flex-1 flex-col bg-[#14110e] p-6 text-[#f4efe6]",
                                  children: [
                                    (0, t.jsx)("p", {
                                      className:
                                        "text-[11px] tracking-[0.28em] text-[#c6a56a]",
                                      children: "审阅代理的决定",
                                    }),
                                    (0, t.jsx)("p", {
                                      className: "mt-4 text-4xl",
                                      style: N,
                                      children: H.decision,
                                    }),
                                    (0, t.jsx)("p", {
                                      className:
                                        "mt-4 max-w-sm text-sm leading-7 text-[#d9d0c3]",
                                      children: H.decisionBody,
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)("div", {
                                  className:
                                    "border border-[#e4d7c4] bg-[#faf7f2] px-4 py-3",
                                  children: [
                                    (0, t.jsx)("p", {
                                      className: "text-sm",
                                      style: N,
                                      children: "错账比错字严重",
                                    }),
                                    (0, t.jsx)("p", {
                                      className:
                                        "mt-1 text-xs leading-5 text-[#6f675c]",
                                      children:
                                        "低置信度即停。合同出不去。账单只吃标准表。",
                                    }),
                                    (0, t.jsx)("p", {
                                      className:
                                        "mt-2 text-[11px] tracking-[0.14em] text-[#8c7344]",
                                      children: "执行 · 低置信度即停",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }) : null,
scene === "caliber" ? (0, t.jsx)(M, {
                        id: "caliber",
                        kicker: "05",
                        title: "口径代理",
                        caption:
                          "国金店 25% 和 30% 还并着，预警保持关闭。恒隆店没给数，不写成经营红灯。",
                        children: (0, t.jsxs)("div", {
                          className:
                            "grid h-full bg-[#f7f3ec] lg:grid-cols-[1.35fr_0.75fr]",
                          children: [
                            (0, t.jsxs)("div", {
                              className: "p-5 sm:p-6",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.32em] text-[#8c7344]",
                                  children: "私有化底座 · 05",
                                }),
                                (0, t.jsx)("h3", {
                                  className: "mt-2 text-3xl",
                                  style: N,
                                  children: "口径代理",
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-2 text-sm leading-7 text-[#4e463d]",
                                  children:
                                    "两套口径还并着，预警保持关闭。缺的数也不叫红灯。",
                                }),
                                (0, t.jsx)("div", {
                                  className: "mt-4 overflow-x-auto",
                                  children: (0, t.jsxs)("table", {
                                    className:
                                      "w-full min-w-[520px] text-left text-sm",
                                    children: [
                                      (0, t.jsx)("thead", {
                                        className:
                                          "text-[11px] tracking-[0.16em] text-[#8a8175]",
                                        children: (0, t.jsxs)("tr", {
                                          className:
                                            "border-b border-[#e4d7c4]",
                                          children: [
                                            (0, t.jsx)("th", {
                                              className: "py-2 font-normal",
                                              children: "门店",
                                            }),
                                            (0, t.jsx)("th", {
                                              className: "py-2 font-normal",
                                              children: "租售比",
                                            }),
                                            (0, t.jsx)("th", {
                                              className: "py-2 font-normal",
                                              children: "口径",
                                            }),
                                            (0, t.jsx)("th", {
                                              className: "py-2 font-normal",
                                              children: "预警",
                                            }),
                                          ],
                                        }),
                                      }),
                                      (0, t.jsx)("tbody", {
                                        children: x.map((e) => {
                                          let s = e.match(V);
                                          return (0, t.jsxs)(
                                            "tr",
                                            {
                                              className: `border-b border-[#eadfce] ${s ? "bg-[#f3ead8]" : ""}`,
                                              children: [
                                                (0, t.jsx)("td", {
                                                  className: "py-3",
                                                  children: e.door,
                                                }),
                                                (0, t.jsx)("td", {
                                                  className:
                                                    "py-3 tabular-nums",
                                                  children: e.ratio,
                                                }),
                                                (0, t.jsx)("td", {
                                                  className: "py-3",
                                                  children: e.lens,
                                                }),
                                                (0, t.jsx)("td", {
                                                  className:
                                                    "py-3 text-[#8d3b32]",
                                                  children: e.alert,
                                                }),
                                              ],
                                            },
                                            `${e.door}-${e.lens}`,
                                          );
                                        }),
                                      }),
                                    ],
                                  }),
                                }),
                                (0, t.jsxs)("p", {
                                  className:
                                    "mt-3 text-xs leading-6 text-[#8a8175]",
                                  children: [
                                    x.some((e) => e.match(V))
                                      ? `${v(V)}对上的行用底色标出。`
                                      : `${v(V)}不在这四条口径里，预警仍然关着。`,
                                    "版本还没有主人，就说不清哪一版模型算出了哪一个月的租金。",
                                  ],
                                }),
                              ],
                            }),
                            (0, t.jsxs)("aside", {
                              className:
                                "bg-[#14110e] p-5 text-[#f4efe6] sm:p-6",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "text-[11px] tracking-[0.28em] text-[#c6a56a]",
                                  children: "还不能往下走",
                                }),
                                (0, t.jsx)("p", {
                                  className: "mt-3 text-2xl",
                                  style: N,
                                  children: "版本还没有主人",
                                }),
                                (0, t.jsx)("ul", {
                                  className: "mt-6 space-y-4",
                                  children: y().map((e) =>
                                    (0, t.jsxs)(
                                      "li",
                                      {
                                        className:
                                          "border-t border-[#3a332b] pt-3",
                                        children: [
                                          (0, t.jsx)("p", {
                                            className: "text-sm",
                                            style: N,
                                            children: e.title,
                                          }),
                                          (0, t.jsx)("p", {
                                            className:
                                              "mt-1 text-xs leading-5 text-[#d9d0c3]",
                                            children: e.body,
                                          }),
                                        ],
                                      },
                                      e.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                      }) : null,
                    ],
                  }),
                ],
              })
            );
          },
        ],
        42190,
      );
    };

export const TwinBoard = load(factory).TwinBoard;
