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
        r = e.i(22016),
        n = e.i(71645),
        a = e.i(31270);
      let o = { fontFamily: '"Noto Serif SC", "Noto Sans SC", serif' };
      function i({ gate: e, active: r, onLook: n }) {
        return (0, t.jsxs)("button", {
          type: "button",
          onClick: n,
          "aria-current": r ? "true" : void 0,
          className: `flex h-full flex-col border bg-[#faf7f2] p-5 text-left transition-colors ${r ? "border-[#b08948]" : "border-[#e6dccb] hover:border-[#cbb892]"}`,
          children: [
            (0, t.jsxs)("div", {
              className: "flex items-start justify-between gap-3",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "text-sm tabular-nums tracking-[0.2em] text-[#b08948]",
                  style: o,
                  children: e.id,
                }),
                (0, t.jsx)("span", {
                  className: `text-[11px] tracking-[0.18em] ${"执行" === e.stance ? "text-[#8c7344]" : "text-[#7a3b3b]"}`,
                  children: e.stance,
                }),
              ],
            }),
            (0, t.jsx)("h2", {
              className: "mt-4 text-[1.35rem] leading-snug",
              style: o,
              children: e.title,
            }),
            (0, t.jsx)("p", {
              className:
                "mt-3 flex-1 text-pretty text-sm leading-7 text-[#4e463d]",
              children: e.body,
            }),
            (0, t.jsx)("p", {
              className:
                "mt-5 border-t border-[#eadfce] pt-3 text-xs tracking-[0.16em] text-[#8c7344]",
              children: e.order,
            }),
          ],
        });
      }
      e.s([
        "MaisonConsole",
        0,
        function () {
          let [e, s] = (0, n.useState)(0),
            [l, c] = (0, n.useState)(!1),
            [u, d] = (0, n.useState)("");
          ((0, n.useEffect)(() => {
            let e = () => {
              var e;
              return d(
                ((e = new Date()),
                new Intl.DateTimeFormat("zh-CN", {
                  timeZone: "Asia/Shanghai",
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                }).format(e)),
              );
            };
            e();
            let t = window.setInterval(e, 3e4);
            return () => window.clearInterval(t);
          }, []),
            (0, n.useEffect)(() => {
              if (
                window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                l
              )
                return;
              let e = window.setInterval(() => {
                s((e) => (e + 1) % a.f.length);
              }, 3400);
              return () => window.clearInterval(e);
            }, [l]));
          let f = a.f[e],
            p = a.f.filter((e) => "未放行" === e.stance).length;
          return (0, t.jsxs)("div", {
            className: "min-h-full bg-[#f3eee6] text-[#1c1915]",
            children: [
              (0, t.jsx)("div", {
                className:
                  "pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(176,137,72,0.16),_transparent_46%)]",
              }),
              (0, t.jsxs)("div", {
                className:
                  "relative mx-auto flex min-h-full max-w-[1240px] flex-col px-5 py-6 sm:px-8 sm:py-8",
                children: [
                  (0, t.jsxs)("header", {
                    className:
                      "flex flex-wrap items-end justify-between gap-6 border-b border-[#ddc9a4] pb-6",
                    children: [
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("p", {
                            className:
                              "text-[11px] tracking-[0.42em] text-[#8c7344]",
                            children: "私有环境 · 值守代理",
                          }),
                          (0, t.jsx)("h1", {
                            className:
                              "mt-3 text-[2rem] leading-none text-[#1c1915] sm:text-[2.6rem]",
                            style: o,
                            children: "AI 私有化底座",
                          }),
                          (0, t.jsx)("div", {
                            className: "mt-4 h-px w-14 bg-[#b08948]",
                          }),
                          (0, t.jsx)("p", {
                            className:
                              "mt-4 max-w-xl text-sm leading-7 text-[#6f675c]",
                            children:
                              "六条门禁同时看着。说不清的数不往下走，缺的数也不叫红灯。",
                          }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className:
                          "flex items-center gap-6 text-sm text-[#6f675c]",
                        children: [
                          (0, t.jsxs)("p", {
                            children: [
                              (0, t.jsx)("span", {
                                className:
                                  "mr-2 inline-block size-1.5 rounded-full bg-[#b08948]",
                              }),
                              l ? "停在这一条" : "正在巡看",
                            ],
                          }),
                          (0, t.jsx)("p", {
                            className: "tabular-nums tracking-[0.14em]",
                            children: u || "—",
                          }),
                          (0, t.jsx)(r.default, {
                            href: "/",
                            className:
                              "tracking-[0.18em] text-[#8c7344] hover:text-[#1c1915]",
                            children: "场景代理",
                          }),
                          (0, t.jsx)(r.default, {
                            href: "/studio",
                            className:
                              "tracking-[0.18em] text-[#8c7344] hover:text-[#1c1915]",
                            children: "文稿",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("section", {
                    className:
                      "mt-6 border border-[#e4d7c4] bg-[#faf7f2]/80 px-5 py-4 sm:px-6",
                    children: [
                      (0, t.jsxs)("div", {
                        className:
                          "flex flex-wrap items-end justify-between gap-4",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "min-w-0",
                            children: [
                              (0, t.jsx)("p", {
                                className:
                                  "text-[11px] tracking-[0.36em] text-[#8c7344]",
                                children: "值守正在看",
                              }),
                              (0, t.jsxs)("p", {
                                className: "mt-2 text-2xl leading-snug",
                                style: o,
                                children: [f.id, " ", f.title],
                              }),
                            ],
                          }),
                          (0, t.jsxs)("p", {
                            className:
                              "text-xs tracking-[0.16em] text-[#8c7344]",
                            children: [f.stance, " · ", f.order],
                          }),
                        ],
                      }),
                      (0, t.jsx)("p", {
                        className:
                          "mt-3 max-w-3xl text-sm leading-7 text-[#3c342c]",
                        children: f.reading,
                      }),
                      (0, t.jsxs)("div", {
                        className:
                          "mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8a8175]",
                        children: [
                          (0, t.jsxs)("p", {
                            children: [
                              "三条在执行，",
                              p,
                              " 条未放行。点一条，值守就停在那里。",
                            ],
                          }),
                          (0, t.jsx)("button", {
                            type: "button",
                            onClick: () => c(!1),
                            disabled: !l,
                            className:
                              "tracking-[0.14em] text-[#8c7344] disabled:text-[#c4b8a6]",
                            children: "继续巡看",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("section", {
                    "aria-label": "六条门禁",
                    className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                    children: a.f.map((r, n) =>
                      (0, t.jsx)(
                        i,
                        {
                          gate: r,
                          active: n === e,
                          onLook: () => {
                            (s(n), c(!0));
                          },
                        },
                        r.id,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          });
        },
      ]);
    };

export const MaisonConsole = load(factory).MaisonConsole;
