"use client";

import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import Link from "next/link";
const gates = [];

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
    "use strict";
    let t, r, n, l, a, i, o, s, d, c, u, f, h, m, p, g;
    var x,
      b = e.i(43476),
      v = e.i(22016),
      y = e.i(71645);
    function w(e, t) {
      return e.nodes.find((e) => e.id === t);
    }
    function j({ node: e }) {
      if ("label" === e.kind)
        return (0, b.jsx)("text", {
          x: e.x,
          y: e.y + 0.72 * e.h,
          fill: "#0f6cbd",
          fontSize: "15",
          fontWeight: "700",
          children: e.text,
        });
      let t = e.sub ? e.y + e.h / 2 - 6 : e.y + e.h / 2 + 5;
      return (0, b.jsxs)("g", {
        children: [
          (0, b.jsx)("rect", {
            x: e.x,
            y: e.y,
            width: e.w,
            height: e.h,
            rx: "group" === e.kind ? 14 : 10,
            fill: `#${e.fill}`,
            stroke: `#${e.stroke}`,
            strokeWidth: "group" === e.kind ? 1.25 : 1.6,
            strokeDasharray: "group" === e.kind ? "7 5" : void 0,
          }),
          "group" === e.kind
            ? (0, b.jsx)("text", {
                x: e.x + 16,
                y: e.y + 24,
                fill: "#0f6cbd",
                fontSize: "14",
                fontWeight: "700",
                children: e.text,
              })
            : (0, b.jsxs)("text", {
                textAnchor: "middle",
                fill: "#142033",
                children: [
                  (0, b.jsx)("tspan", {
                    x: e.x + e.w / 2,
                    y: t,
                    fontSize: "16",
                    fontWeight: "700",
                    children: e.text,
                  }),
                  e.sub
                    ? (0, b.jsx)("tspan", {
                        x: e.x + e.w / 2,
                        y: t + 22,
                        fontSize: "12",
                        fill: "#5e6d80",
                        children: e.sub,
                      })
                    : null,
                ],
              }),
        ],
      });
    }
    function k({ diagram: e, title: t }) {
      let r = (0, y.useId)().replace(/:/g, ""),
        n = e.nodes.filter((e) => "group" === e.kind),
        l = e.nodes.filter((e) => "group" !== e.kind);
      return (0, b.jsxs)("svg", {
        viewBox: `0 0 ${e.width} ${e.height}`,
        role: "img",
        "aria-label": t,
        className: "h-auto w-full",
        children: [
          (0, b.jsx)("rect", {
            width: e.width,
            height: e.height,
            rx: "18",
            fill: "#f4f8fc",
          }),
          (0, b.jsx)("defs", {
            children: (0, b.jsx)("marker", {
              id: r,
              markerWidth: "8",
              markerHeight: "8",
              refX: "7",
              refY: "4",
              orient: "auto",
              children: (0, b.jsx)("path", {
                d: "M0 0 L8 4 L0 8 Z",
                fill: "#0f6cbd",
              }),
            }),
          }),
          n.map((e) => (0, b.jsx)(j, { node: e }, e.id)),
          e.edges.map((t) => {
            let n = (function (e, t) {
              let r = w(e, t.from),
                n = w(e, t.to);
              if (!r || !n || "label" === r.kind || "label" === n.kind)
                return [];
              let l = { x: r.x + r.w, y: r.y + r.h / 2 },
                a = { x: n.x, y: n.y + n.h / 2 },
                i = { x: r.x + r.w / 2, y: r.y + r.h },
                o = { x: n.x + n.w / 2, y: n.y },
                s =
                  Math.min(r.y + r.h, n.y + n.h) - Math.max(r.y, n.y) >
                  0.45 * Math.min(r.h, n.h),
                d =
                  Math.min(r.x + r.w, n.x + n.w) - Math.max(r.x, n.x) >
                  0.35 * Math.min(r.w, n.w),
                c = n.x >= r.x + r.w - 8,
                u = n.y >= r.y + r.h - 8;
              if (c && s) return [l, a];
              if (u && d) {
                if (14 > Math.abs(i.x - o.x)) return [i, o];
                let e = (r.y + r.h + n.y) / 2;
                return [i, { x: i.x, y: e }, { x: o.x, y: e }, o];
              }
              if (c) {
                let e = (r.x + r.w + n.x) / 2;
                return [l, { x: e, y: l.y }, { x: e, y: a.y }, a];
              }
              if (u) {
                let e = (r.y + r.h + n.y) / 2;
                return [i, { x: i.x, y: e }, { x: o.x, y: e }, o];
              }
              return [l, { x: a.x, y: l.y }, a];
            })(e, t);
            return n.length < 2
              ? null
              : (0, b.jsx)(
                  "polyline",
                  {
                    points: n.map((e) => `${e.x},${e.y}`).join(" "),
                    fill: "none",
                    stroke: "#0f6cbd",
                    strokeWidth: "2",
                    markerEnd: `url(#${r})`,
                  },
                  `${t.from}-${t.to}`,
                );
          }),
          l.map((e) => (0, b.jsx)(j, { node: e }, e.id)),
        ],
      });
    }
    let A = (0, y.forwardRef)(function ({ xml: e }, t) {
        let r = (0, y.useRef)(null),
          n = (0, y.useRef)(e),
          l = (0, y.useRef)(!1),
          a = (0, y.useRef)(null),
          [i, o] = (0, y.useState)("loading");
        return (
          (0, y.useEffect)(() => {
            n.current = e;
          }, [e]),
          (0, y.useEffect)(() => {
            let e = window.setTimeout(() => {
              l.current || o("offline");
            }, 8e3);
            function t(t) {
              let i;
              if (
                "string" == typeof t.data &&
                /diagrams\.net|draw\.io/.test(t.origin)
              ) {
                try {
                  i = JSON.parse(t.data);
                } catch {
                  return;
                }
                if (
                  ("init" === i.event &&
                    ((l.current = !0),
                    o("ready"),
                    window.clearTimeout(e),
                    r.current?.contentWindow?.postMessage(
                      JSON.stringify({
                        action: "load",
                        xml: n.current,
                        autosave: 1,
                      }),
                      "*",
                    )),
                  "export" === i.event && a.current)
                ) {
                  let e = a.current;
                  ((a.current = null),
                    e(
                      "string" == typeof i.data
                        ? (function (e) {
                            if (e.startsWith("data:image/png")) return e;
                            let t = e.replace(/\s/g, "");
                            return /^[A-Za-z0-9+/=]+$/.test(t) && t.length > 80
                              ? `data:image/png;base64,${t}`
                              : null;
                          })(i.data)
                        : null,
                    ));
                }
              }
            }
            return (
              window.addEventListener("message", t),
              () => {
                (window.removeEventListener("message", t),
                  window.clearTimeout(e));
              }
            );
          }, []),
          (0, y.useEffect)(() => {
            l.current &&
              r.current?.contentWindow?.postMessage(
                JSON.stringify({ action: "load", xml: e, autosave: 1 }),
                "*",
              );
          }, [e]),
          (0, y.useImperativeHandle)(t, () => ({
            exportPng: () =>
              l.current && r.current?.contentWindow
                ? new Promise((e) => {
                    let t = window.setTimeout(() => {
                      a.current && ((a.current = null), e(null));
                    }, 6e3);
                    ((a.current = (r) => {
                      (window.clearTimeout(t), e(r));
                    }),
                      r.current?.contentWindow?.postMessage(
                        JSON.stringify({
                          action: "export",
                          format: "png",
                          scale: 2,
                          background: "#ffffff",
                          border: 16,
                        }),
                        "*",
                      ));
                  })
                : Promise.resolve(null),
          })),
          (0, b.jsxs)("div", {
            className:
              "overflow-hidden rounded-xl border border-[#d5e3f0] bg-white",
            children: [
              (0, b.jsxs)("div", {
                className:
                  "flex items-center justify-between gap-3 border-b border-[#e6edf5] px-3 py-2 text-xs text-[#5e6d80]",
                children: [
                  (0, b.jsx)("span", { children: "draw.io 编辑器" }),
                  (0, b.jsx)("span", {
                    children:
                      "loading" === i
                        ? "正在连接"
                        : "ready" === i
                          ? "已载入当前流程"
                          : "编辑器没有连上",
                  }),
                ],
              }),
              "offline" === i
                ? (0, b.jsx)("p", {
                    className: "px-4 py-6 text-sm leading-6 text-[#5e6d80]",
                    children:
                      "这里连不上 diagrams.net。生成时会改用同一套模板流程，画进 PPT。你也可以上传一张 PNG 作为架构图。",
                  })
                : (0, b.jsx)("iframe", {
                    ref: r,
                    title: "draw.io 架构图编辑器",
                    src: "https://embed.diagrams.net/?embed=1&proto=json&spin=1&ui=min&libraries=0&noSaveBtn=1&noExitBtn=1&saveAndExit=0&configure=1",
                    className: "h-[540px] w-full bg-white",
                  }),
            ],
          })
        );
      }),
      C = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
      N = function () {
        for (var e, t, r = 0, n = "", l = arguments.length; r < l; r++)
          (e = arguments[r]) &&
            (t = (function e(t) {
              var r,
                n,
                l = "";
              if ("string" == typeof t || "number" == typeof t) l += t;
              else if ("object" == typeof t)
                if (Array.isArray(t)) {
                  var a = t.length;
                  for (r = 0; r < a; r++)
                    t[r] && (n = e(t[r])) && (l && (l += " "), (l += n));
                } else for (n in t) t[n] && (l && (l += " "), (l += n));
              return l;
            })(e)) &&
            (n && (n += " "), (n += t));
        return n;
      },
      z = (e, t = 0) => {
        let r = new Int32Array(e.length);
        for (let n = 0; n < e.length; n++) r[n] = e.charCodeAt(n) - 48 - t;
        return r;
      },
      S = (e) => {
        let t = new Int32Array(e.length + 1);
        for (let r = 0; r < e.length; r++) t[r + 1] = t[r] + e[r];
        return t;
      },
      $ = (e) => {
        let t = new Int32Array(e.length),
          r = 0;
        for (let n = 0; n < e.length; n++) {
          let l = e.charCodeAt(n) - 48;
          ((r += (l >>> 1) ^ -(1 & l)), (t[n] = r));
        }
        return t;
      },
      I = S(
        z(
          "E0500002005282000000002000150000020021820000011200000003022202000300004200120000200420001200021200301200010400162000010000220021010:2192001200220012000220012000200200200400010200040000000000400200108200110100000022010313000162002000020020012020080213000228200000000082000000000120002000120020020040101020300130001001010",
        ),
      ),
      E = S(
        z(
          ":11111111211111119311546544411119731869:671397415686432441111111111161114151214313433415:78311132233313187211117221449443411141111151152226611131111112212518142224214215421421542142424242516171151615616347111111111197911327451111111111111111111113134714133513411111311111111111111111111112444411111342312715245411117:3",
        ),
      ),
      M = (() => {
        let e = I.length - 1,
          t = new Int32Array(e);
        for (let r = e - 1; r >= 0; r--) {
          let e = 1,
            n = r + 1;
          for (let l = I[r]; l < I[r + 1]; l++) ((e += t[n]), (n += t[n]));
          t[r] = e;
        }
        let r = new Int32Array(I[e]),
          n = 0;
        for (let l = 0; l < e; l++) {
          let e = l + 1;
          for (let a = I[l]; a < I[l + 1]; a++) ((r[n++] = e), (e += t[e]));
        }
        return r;
      })(),
      L = z(
        "02000000000000900<=0?000B000F00F00ŏI0J0LNPRTVX0000]_a00000000000000000000000rst0000000zŏ00000000000ŏ0000000ŏ00000000000000000000000000000000000000000000000000000000000000Ë000000000000000000000Þ000000000000000000ð0000000ø0ùúûüýþÿĀāĂăĄąĆ000000000000000000000000000000000000000000ħ0ĨĪ00000000000000000000ļĽ00000Ŭ000000",
        1,
      ),
      F = S(z("123333359346463635126536711576")),
      O = z(
        "93203242332583253248325D>E?F@03263243255B:032523853:0325B:8GA032542H<C=12727B:0328432553;D>E?3257D>032585:0325B:;0328B:032",
      ),
      P = z(
        "012113445661666666789111:5;;;;;;;;444;;;:62999<1161=62>>?61:21@ABCD4446996:64E:::;:?::64:F114GHHIHHHHIHH1HH1HH1HHHHHH::EEJ4444::EE4444441691;644444114244444:;K6666555555555555555999666664444444444444444444444226?6:66644L9M?D:111::::6DE199",
      ),
      R = $(
        "020200202020020020020020020020200200200200200200200002020202001003040106000200200200200200200200200200200200200200200200200200200200200200200200200200200200020020020020020020002020200202002002002002002002002002002020002002020020200220200200200200200200200200200200020020020000200020002000200200200020020020002000200200200020020202002020202000200200020022000200200020020002002000200220002002000200W0Z00020020002002020002002000200g0j0002002000200200020020002002000200200020020002000200002000002002002002002000200020000200002002002002002002002020020020200200200200200200200200202020020020020020020020020002002002020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020002002002002002002000200200200200200200200200200020202020002000200020002002002002000020200200",
      ),
      U = (() => {
        let e = new Int32Array(319).fill(-1),
          t = $(
            "02422242:222222242224222242442222222422222244442242226224222426222422442462222422622222222626222462242622422622422424242422222222422222222242422222222222222222622442224222222222222224424442262222222222222222222226224222424242422224422422422222",
          ),
          r = $(
            "02222222222222222222202222222222222222222222221422222222222222222222222222222222222Y\\222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222221422222222222222222222222222222222222222Ŀł222222222222222222",
          );
        for (let n = 0; n < t.length; n++) e[t[n]] = r[n];
        return e;
      })(),
      D =
        "container |break-after- all auto avoid avoid-page column left page right|break-before- all auto avoid avoid-page column left page right|break-inside-a uto void void-column void-page|box-decoration- clone slice|box- border content| contents flow-root hidden table table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group| not-sr-only sr-only|float- end left none right start|clear- both end left none right start|isolat e ion-auto|overflow- auto clip hidden scroll visible|overflow-x- auto clip hidden scroll visible|overflow-y- auto clip hidden scroll visible|overscroll- auto contain none|overscroll-x- auto contain none|overscroll-y- auto contain none| absolute fixed relative static sticky| collapse invisible visible|justify- around baseline between center center-safe end end-safe evenly normal start stretch|justify-items- center center-safe end end-safe normal start stretch|justify-self- auto center center-safe end end-safe start stretch|items- baseline baseline-last center center-safe end end-safe start stretch|self- auto baseline baseline-last center center-safe end end-safe start stretch|place-content- around baseline between center center-safe end end-safe evenly start stretch|place-items- baseline center center-safe end end-safe start stretch|place-self- auto center center-safe end end-safe start stretch| antialiased subpixel-antialiased| italic not-italic|normal-nums |ordinal |slashed-zero | lining-nums oldstyle-nums| proportional-nums tabular-nums| diagonal-fractions stacked-fractions| no-underline overline| capitalize lowercase normal-case uppercase|truncate |whitespace- break-spaces normal nowrap pre pre-line pre-wrap|break- all keep normal words|wrap- anywhere break-word normal|hyphens- auto manual none|mix-blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay plus-darker plus-lighter saturation screen soft-light|table- auto fixed|caption- bottom top|backface- hidden visible|appearance- auto none|scheme- dark light light-dark normal only-dark only-light|field-sizing- content fixed|pointer-events- auto none|resize  -none -x -y|snap- align-none center end start|snap- always normal|snap- both none x y|snap- mandatory proximity|touch- auto manipulation none|touch-pan- left right x|touch-pan- down up y|touch-pinch-zoom |select- all auto none text|forced-color-adjust- auto none| normal size| baseline bottom middle sub super text-bottom text-top top| bounce none ping pulse spin| auto square video| auto fr max min px|none | auto full px| fixed local scroll|clip- border content padding text|origin- border content padding| bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| no-repeat repeat repeat-round repeat-space repeat-x repeat-y| auto contain cover|blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay saturation screen soft-light|to- b bl br l r t tl tr| auto dvh fit full lh lvh max min px screen svh| dashed dotted double hidden none solid| collapse separate|px |auto |full | content none strict| inline-size size|layout |paint |style | around baseline between center center-safe end end-safe evenly normal start stretch| alias all-scroll auto cell col-resize context-menu copy crosshair default e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize no-drop none not-allowed ns-resize nw-resize nwse-resize pointer progress row-resize s-resize se-resize sw-resize text vertical-text w-resize wait zoom-in zoom-out| dashed dotted double solid wavy| auto from-font|reverse |initial | in in-out initial linear out| col col-reverse row row-reverse| nowrap wrap wrap-reverse| auto initial none| black bold extrabold extralight light medium normal semibold thin| condensed expanded extra-condensed extra-expanded normal semi-condensed semi-expanded ultra-condensed ultra-expanded|flow- col col-dense dense row row-dense| none subgrid| auto dvh dvw fit full lh lvh lvw max min px screen svh svw| block flex grid table| auto dvw fit full lvw max min px screen svw| loose none normal px relaxed snug tight|through |item | inside outside| decimal disc none| auto px| clip-border clip-content clip-fill clip-padding clip-stroke clip-view no-clip| add exclude intersect subtract| alpha luminance match|origin- border content fill padding stroke view|type- alpha luminance| circle ellipse| closest-corner closest-side farthest-corner farthest-side|at- bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| dvh fit full lh lvh max min none px screen svh| auto dvh dvw fit full lh lvh lvw max min none px screen svh svw| dvw fit full lvw max min none px screen svw| auto dvh dvw fit full lvh lvw max min none prose px svh svw| auto dvh dvw fit full lvh lvw max min none px screen svh svw| contain cover fill none scale-down| first last none| distant dramatic midrange near none normal|inset | full none|3d | auto smooth|gutter- auto both stable| auto none thin| inner none| auto dvh dvw fit full lvh lvw max min px svh svw|base | center end justify left right start| clip ellipsis| balance nowrap pretty wrap| normal tight tighter wide wider widest| cpu gpu none| 3d flat| all colors none opacity shadow transform| discrete normal| full px| auto dvh dvw fit full lvh lvw max min px screen svh svw| auto contents scroll transform"
          .split("|")
          .map((e) => {
            let t = e.split(" "),
              r = t.shift();
            for (let e = 0; e < t.length; e++) t[e] = r + t[e];
            return t;
          }),
      B = $(
        "0000000000000000000000000000000000000000000000000000000000000262242:6@200000006:240B428:4422400002046044222426220026642642462026224222824220022400000000\\00N222422242222222224062242222222422226264222422222222222222442804222422222222222222222222220<4<0204260002444020204224422",
      ),
      T = $(
        "ɠ222222222222222222222222222222222222222222222222222222222222˕4222226>6ʰ22ʷʺʷʺʷ42ʴ2ʓ22>621422ɶ222ɹɼɷɺɷɺ22ɱ42222ɨ2ɧ26622ɘɓ244ƸƵ222]d24242ǖǓƚÄȫ2263ȨȥȨ2222222ǣ222222222222222222ǂƽ2ƾƵ2222222422222ƜƑ22222222222222222222144Ŧţ22Ţş222222222222222222222ĸ2ı68ĦģĦɡŰ4Ġ«®ĝ822ĔđĔ2ē2222622",
      ),
      H = $(
        "02222222222222222222222222222222222222222222222222222222222222222202021422222222CF2200GJ021042222WZ222IL0ad2c10h2222U00X202[^2w0000120zy|}22:22z22222222222G000qOVI00000{2<40000@00000G¦§000ª00000000000000021K¬«00®000000000000000000000222HGH_1¸222½2¾2222ÇÊ000­°2±",
      ),
      V = new Int32Array(987),
      _ = new Int32Array(987),
      W = new Int32Array(987),
      G = "",
      J = new Int32Array(1022);
    {
      let e = new Map(),
        t = 0,
        r = 0;
      for (let n = 0; n < B.length; n++)
        for (let l of D[H[n]]) {
          let a = e.get(l);
          (void 0 === a &&
            ((a = t++),
            e.set(l, a),
            (J[2 * a] = G.length),
            (J[2 * a + 1] = l.length),
            (G += l)),
            (V[r] = B[n]),
            (_[r] = T[n]),
            (W[r] = a),
            r++);
        }
    }
    let q = $("0b2N:222@R>F@286¦2@H2D266226FB22B2>BD\\6N22222Z222D222p"),
      Z = S(z("1::24444432:442:44:44>222222:44:4421322511111311111114")),
      K = $(
        "24A;33N=C@H4A;33N=C@<27;83:;8393NQ:3NQʰ222ˉºŴŽ2R2=18cƴÅŇ=cĞÛC1ƈǝȈ:ħ25=11D3A@4=<1;1DEr25;11B3?<6;:371BCn9@7=<8192>2E121@9@EHE@9>2T25511<398454131<=V25511<398454131<=ƧNž2Đå242L222290000f22500ɛ000ǘ222",
      ),
      Y = z("ĳ");
    var X = {
      GROUP_COUNT: 384,
      customValidatorNames: [],
      edgeStart: I,
      labelStart: E,
      labelText:
        "@containerabcdefghinlmoprstunderlineviawzccentlignnimatespectuto-colsrowsaglorightnessckdrop-sisbcontrastfiltergrayscalehue-rotateinvertopacityslurrightnessaturateepia-coniclinearpositionradialsizeockurrderttom-belrstxyespacing-xyaretoursorlnt-umnsendspantartainentrasteividerop-shadowurationcorationlay-xyasendillexontromlter-featuresstretchapr-xyayscaleidow-colsrowsue-rotatedentlinesetvert-beringsxyeshadoweiadingftnest-clamp-imageabein-lrstxyskx--b-coniclpositionrsizet-x-y-fromto-fromto-inearfromto-fromto-adialfromto-fromtofromtofromtofromtoblockhinlinew-screenesblockhinlinewbjectpacityrutlinederigin-offsetbelrstxyesrspective-originaceholderioghtng-offsettateundedw-xyz-belrstlreseslr-endspantartaturatecepiahizekewpace-taleroll-xyz-barmpbelrstxyesbelrstxyes-thumbrackadowrink-xyxyartrokeabextora-shadowpckingnsformitionlate-xyz-offsetill-changeoom",
      edgeTarget: M,
      nodeGroup: L,
      nodeVlist: U,
      vlistPat: F,
      vlistOps: O,
      vlistRef: P,
      vlistGroup: R,
      litAnchor: V,
      litGroup: _,
      litPool: W,
      poolOffsets: J,
      poolText: G,
      adjGid: q,
      adjStart: Z,
      adjTgt: K,
      patGid: Y,
      patTgt: z(""),
      postfixLookupGroups: z("1"),
      orderSensitiveModifiers:
        "* ** after backdrop before details-content file first-letter first-line marker placeholder selection",
    };
    let Q = "line" in Error(),
      ee = (e, t, r) => {
        let n = 0x811c9dc5;
        for (let l = t; l < r; l++)
          n = Math.imul(n ^ e.charCodeAt(l), 0x1000193);
        return n;
      },
      et = (e, t, r) => {
        let n = r - t,
          l = Math.imul(n, 0x9e3779b1) ^ e.charCodeAt(t);
        if (n > 3) {
          let a = n >> 2,
            i = n >> 1;
          l =
            Math.imul(
              (l = Math.imul(
                l ^
                  (e.charCodeAt(t + 1) << 8) ^
                  (e.charCodeAt(t + 2) << 16) ^
                  e.charCodeAt(t + a),
                0x85ebca6b,
              )) ^
                (e.charCodeAt(t + i) << 8) ^
                (e.charCodeAt(t + i + a) << 16) ^
                e.charCodeAt(r - 3),
              0xc2b2ae35,
            ) ^
            ((e.charCodeAt(r - 2) << 8) ^ (e.charCodeAt(r - 1) << 16));
          for (let n = t + 3, a = r - 4; n < t + 8 && n < a; n++, a--)
            l = Math.imul(
              l ^ e.charCodeAt(n) ^ (e.charCodeAt(a) << 8),
              0x1000193,
            );
        }
        return l ^ (l >>> 15);
      },
      er = (e, t) => {
        if (!e) return "";
        if ("string" == typeof e) return e;
        let r = "";
        if ("number" == typeof e.length && (!t || Array.isArray(e))) {
          for (let n = 0; n < e.length; n++) {
            let l = e[n];
            if (!l) continue;
            let a = "string" == typeof l ? l : er(l, t);
            a && (r && (r += " "), (r += a));
          }
          return r;
        }
        if (t) {
          if ("number" == typeof e) return "" + e;
          if ("object" == typeof e)
            for (let t in e) e[t] && (r && (r += " "), (r += t));
        }
        return r;
      },
      en = function () {
        return ((e, t) => {
          let r = "";
          for (let n = 0; n < e.length; n++) {
            let l = e[n];
            if (!l) continue;
            let a = "string" == typeof l ? l : er(l, t);
            a && (r && (r += " "), (r += a));
          }
          return r;
        })(arguments, !1);
      },
      el = ((e, t = {}) => {
        let {
            GROUP_COUNT: r,
            edgeStart: n,
            labelStart: l,
            labelText: a,
            edgeTarget: i,
            nodeGroup: o,
            nodeVlist: s,
            vlistPat: d,
            vlistOps: c,
            vlistRef: u,
            vlistGroup: f,
            litAnchor: h,
            litGroup: m,
            litPool: p,
            poolOffsets: g,
            poolText: x,
            adjGid: b,
            adjStart: v,
            adjTgt: y,
            patGid: w,
            patTgt: j,
            postfixLookupGroups: k,
            customValidatorNames: A,
            orderSensitiveModifiers: C,
          } = e,
          N = new Int32Array(r).fill(-1);
        for (let e = 0; e < b.length; e++) N[b[e]] = e;
        let z = 0;
        for (let e = 0; e + 1 < v.length; e++) {
          let t = v[e + 1] - v[e];
          t > z && (z = t);
        }
        let S = 32;
        for (; S < 2 * (1 + z + w.length); ) S <<= 1;
        let $ = new Int32Array(u.length + 1);
        for (let e = 0; e < u.length; e++)
          $[e + 1] = $[e] + d[u[e] + 1] - d[u[e]];
        let I = new Uint8Array(r);
        for (let e = 0; e < k.length; e++) I[k[e]] = 1;
        let E = new Uint8Array(n.length - 1),
          M = 0,
          L = !0;
        for (let e = 0; e < h.length; e++) {
          E[h[e]] = 1;
          let t = g[2 * p[e] + 1];
          t > M && (M = t);
          let r = x.charCodeAt(g[2 * p[e]]);
          (91 === r || 40 === r) && (L = !1);
        }
        let F = 1;
        for (; F < 2 * h.length; ) F <<= 1;
        let O = new Int32Array(F).fill(-1);
        for (let e = 0; e < h.length; e++) {
          let t = g[2 * p[e]],
            r =
              (ee(x, t, t + g[2 * p[e] + 1]) ^ Math.imul(h[e], 0x9e3779b1)) &
              (F - 1);
          for (; -1 !== O[r]; ) r = (r + 1) & (F - 1);
          O[r] = e;
        }
        let P = (e, t, r, n) => {
            let l = (ee(t, r, n) ^ Math.imul(e, 0x9e3779b1)) & (F - 1),
              a = n - r;
            for (;;) {
              let n = O[l];
              if (-1 === n) return -1;
              if (h[n] === e && g[2 * p[n] + 1] === a) {
                let e = g[2 * p[n]],
                  l = !0;
                for (let n = 0; n < a; n++)
                  if (x.charCodeAt(e + n) !== t.charCodeAt(r + n)) {
                    l = !1;
                    break;
                  }
                if (l) return m[n];
              }
              l = (l + 1) & (F - 1);
            }
          },
          R = t.cacheSize ?? 8192,
          U = t.prefix ?? e.prefix ?? "",
          D = "" === U ? "" : U + ":",
          B = D.length,
          T = (A ?? []).map((e) => {
            let t;
            if (!t) throw Error("cn: missing validator " + e);
            return t;
          }),
          H =
            /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
          V = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
          _ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
          W =
            /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
          G = 0,
          J = -1,
          q = -1,
          Z = -1,
          K = -1,
          Y = (e) =>
            (e >= 97 && e <= 122) ||
            (e >= 65 && e <= 90) ||
            (e >= 48 && e <= 57) ||
            95 === e,
          X = (e) => /\s/.test(String.fromCharCode(e)),
          er = (e, t, r) => {
            if (((G = 0), (J = -1), r - t < 3)) return;
            let n = e.charCodeAt(t),
              l = e.charCodeAt(r - 1);
            if (91 === n && 93 === l) G = 1;
            else {
              if (40 !== n || 41 !== l) return;
              G = 2;
            }
            ((Z = t + 1), (K = r - 1));
            let a = t + 1;
            if (Y(e.charCodeAt(a))) {
              for (a++; a < r - 1; ) {
                let t = e.charCodeAt(a);
                if (!Y(t) && 45 !== t) break;
                a++;
              }
              a < r - 2 &&
                58 === e.charCodeAt(a) &&
                ((J = t + 1), (q = a), (Z = a + 1));
            }
          },
          el = (e, t, r, n) => {
            if (r - t !== n.length) return !1;
            for (let r = 0; r < n.length; r++)
              if (e.charCodeAt(t + r) !== n.charCodeAt(r)) return !1;
            return !0;
          },
          ea = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
          ei = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
          eo = (e) => !!e && !Number.isNaN(Number(e)),
          es = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
          ed =
            "length|number|number weight|family-name|position percentage|length size bg-size|image url|shadow|length|family-name|position percentage|length size bg-size|image url|shadow|number weight"
              .split("|")
              .map((e) => e.split(" ")),
          ec = [2, 3, 1, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 1, 1],
          eu = (e, t, r, n) => {
            if (e >= 10) {
              if (e >= 25) return T[e - 25](t.slice(r, n));
              let l = e - 10;
              if (G !== es[l]) return !1;
              if (J >= 0) {
                for (let e of ed[l]) if (el(t, J, q, e)) return !0;
                return !1;
              }
              switch (ec[l]) {
                case 0:
                  return !1;
                case 1:
                  return !0;
                case 2: {
                  let e = t.slice(Z, K);
                  return H.test(e) && !V.test(e);
                }
                case 3:
                  return eo(t.slice(Z, K));
                case 4:
                  return W.test(t.slice(Z, K));
                default:
                  return _.test(t.slice(Z, K));
              }
            }
            switch (e) {
              case 0:
                return !0;
              case 1:
                return 0 === G;
              case 2:
                return 1 === G;
              case 3:
                return 2 === G;
              case 4:
                return ea.test(t.slice(r, n));
              case 5:
                return eo(t.slice(r, n));
              case 6: {
                let e = t.slice(r, n);
                return !!e && Number.isInteger(Number(e));
              }
              case 7:
                return (
                  n > r && 37 === t.charCodeAt(n - 1) && eo(t.slice(r, n - 1))
                );
              case 8:
                return ei.test(t.slice(r, n));
              default:
                if (n - r < 11 || !el(t, r, r + 10, "@container")) return !1;
                if (47 === t.charCodeAt(r + 10)) return n - r >= 12;
                let l = t.charCodeAt(r + 11);
                return (
                  (115 === l &&
                    n - r >= 17 &&
                    el(t, r + 10, r + 16, "-size/")) ||
                  (110 === l &&
                    n - r >= 19 &&
                    el(t, r + 10, r + 18, "-normal/"))
                );
            }
          },
          ef = new Set("string" == typeof C ? C.split(" ") : C),
          eh = (e, t, r, n, l, a) => {
            let i = ee(t, r, n) ^ (0x9e3779b9 * !!l),
              o = e.get(i);
            if (void 0 !== o)
              e: for (let e = 0; e < o.length; e++) {
                let a = o[e];
                if (a.imp === l && a.k.length === n - r) {
                  for (let e = 0; e < a.k.length; e++)
                    if (a.k.charCodeAt(e) !== t.charCodeAt(r + e)) continue e;
                  return a.id;
                }
              }
            else e.set(i, (o = []));
            let s = t.slice(r, n),
              d = a(s);
            return (o.push({ k: s, imp: l, id: d }), d);
          },
          em = new Map(),
          ep = new Map(),
          eg = 2,
          ex = (e, t) => {
            let r = [],
              n = 0,
              l = 0,
              a = 0;
            for (let t = 0; t < e.length; t++) {
              let i = e.charCodeAt(t);
              0 === n && 0 === l && 58 === i
                ? (r.push(e.slice(a, t)), (a = t + 1))
                : 91 === i
                  ? n++
                  : 93 === i
                    ? n--
                    : 40 === i
                      ? l++
                      : 41 === i && l--;
            }
            r.push(e.slice(a));
            let i = r[0];
            if (r.length > 1) {
              let e = [],
                t = [];
              for (let n of r)
                91 === n.charCodeAt(0) || ef.has(n)
                  ? (t.length && (e.push(...t.sort()), (t = [])), e.push(n))
                  : t.push(n);
              (t.length && e.push(...t.sort()), (i = e.join(":")));
            }
            let o = t ? i + " !" : i,
              s = ep.get(o);
            return (void 0 === s && ep.set(o, (s = eg++)), s);
          },
          eb = new Map(),
          ev = r,
          ey = r + 4096,
          ew = () => ev++,
          ej = new Int32Array(8192),
          ek = Array(8192).fill(null),
          eA = new Int32Array(8192),
          eC = new Int32Array(8192),
          eN = new Uint8Array(8192),
          ez = 0,
          eS = (e, t, r, n, l, a, i, o) => {
            let s = e;
            if (null !== ek[e])
              if (null === ek[1 | e]) s = 1 | e;
              else {
                if ((3 & ez++) != 0) return;
                s = e | ((ez >> 2) & 1);
              }
            ((ek[s] = t.slice(r, n)),
              (ej[s] = l),
              (eA[s] = a),
              (eC[s] = i),
              (eN[s] = o));
          },
          e$ = 256,
          eI = [
            new Int32Array(256),
            new Int32Array(e$),
            new Int32Array(e$),
            new Int32Array(e$),
          ],
          [eE, eM, eL, eF] = eI,
          eO = new Uint8Array(e$),
          eP = new Uint8Array(e$),
          eR = () => {
            ((e$ *= 2),
              (eI = eI.map((e) => {
                let t = new Int32Array(e$);
                return (t.set(e), t);
              })),
              ([eE, eM, eL, eF] = eI));
            let e = new Uint8Array(e$);
            (e.set(eO), (eO = e), (eP = new Uint8Array(e$)));
          },
          eU = 64,
          eD = new Int32Array(64),
          eB = new Int32Array(eU),
          eT = new Int32Array(r),
          eH = 2048,
          eV = 21,
          e_ = new Float64Array(2048),
          eW = new Int32Array(eH),
          eG = 0,
          eJ = (e, t) => {
            if (0 === e && t < r) return eT[t] === eG ? 1 : ((eT[t] = eG), 0);
            let n = 2097152 * e + t + 1,
              l = Math.imul(n, 0x9e3779b1) >>> eV;
            for (; eW[l] === eG; ) {
              if (e_[l] === n) return 1;
              l = (l + 1) & (eH - 1);
            }
            return ((e_[l] = n), (eW[l] = eG), 0);
          },
          eq = (e, t, r, n, l) => {
            if (
              r - t >= 2 &&
              91 === e.charCodeAt(t) &&
              93 === e.charCodeAt(r - 1)
            ) {
              let n = -1;
              for (let l = t + 1; l < r - 1; l++)
                if (58 === e.charCodeAt(l)) {
                  n = l;
                  break;
                }
              return -1 === n || n === t + 1 ? -1 : eh(eb, e, t + 1, n, 0, ew);
            }
            if (n >= 0 && o[n] >= 0) return o[n];
            for (let t = l - 1; t >= 0; t--) {
              let n = eB[t];
              if (n > r) continue;
              let l = eD[t],
                a = r - n;
              if (1 === E[l] && a > 0 && a <= M) {
                let t = e.charCodeAt(n);
                if (!1 === L || (91 !== t && 40 !== t)) {
                  let t = P(l, e, n, r);
                  if (t >= 0) return t;
                }
              }
              let i = s[l];
              if (i < 0) continue;
              let o = u[i],
                h = d[o],
                m = d[o + 1];
              if (h === m) continue;
              er(e, n, r);
              let p = $[i] - h;
              for (let t = h; t < m; t++)
                if (eu(c[t], e, n, r)) return f[p + t];
            }
            return -1;
          },
          eZ = (e) => {
            let t = e.length,
              o = 0,
              d = 0,
              c = !1;
            ((eg > 4096 || em.size > 4096) &&
              ((em = new Map()), (ep = new Map()), (eg = 2), ek.fill(null)),
              ev > ey && ((eb = new Map()), (ev = r), ek.fill(null)));
            let u = 0;
            for (; u < t; ) {
              let f,
                h = e.charCodeAt(u);
              if (32 === h || (h >= 9 && h <= 13) || (h >= 160 && X(h))) {
                (32 !== h && (c = !0), u++);
                continue;
              }
              let m = u,
                p = 0;
              for (; u < t; ) {
                if ((h = e.charCodeAt(u)) <= 32) {
                  if (32 === h) break;
                  if (h >= 9 && h <= 13) {
                    c = !0;
                    break;
                  }
                } else if (h >= 160 && X(h)) {
                  c = !0;
                  break;
                }
                ((p = Math.imul(p ^ h, 0x1000193)), u++);
              }
              let g = u,
                x = g - m;
              o === e$ && eR();
              let b = o++;
              ((eE[b] = m), (eM[b] = g), (d += x));
              let v = (p ^= Math.imul(x, 0x9e3779b1)) ^ (p >>> 15),
                y = 8190 & v;
              {
                let t = -1;
                if (
                  (ej[y] === v && null !== ek[y] && ek[y].length === x
                    ? (t = y)
                    : ej[1 | y] === v &&
                      null !== ek[1 | y] &&
                      ek[1 | y].length === x &&
                      (t = 1 | y),
                  t >= 0)
                ) {
                  let r = ek[t],
                    n = !0;
                  for (let t = 0; t < x; t++)
                    if (r.charCodeAt(t) !== e.charCodeAt(m + t)) {
                      n = !1;
                      break;
                    }
                  if (n) {
                    ((eL[b] = eA[t]), (eF[b] = eC[t]), (eO[b] = eN[t]));
                    continue;
                  }
                }
              }
              let w = m;
              if (0 !== B) {
                if (g - m <= B || !e.startsWith(D, m)) {
                  ((eL[b] = -1), eS(y, e, m, g, v, -1, 0, 0));
                  continue;
                }
                w = m + B;
              }
              let j = 0,
                k = 0,
                A = -1,
                C = -1;
              for (let t = w; t < g; t++) {
                let r = e.charCodeAt(t);
                if (0 === j && 0 === k) {
                  if (58 === r) {
                    A = t;
                    continue;
                  }
                  if (47 === r) {
                    C = t;
                    continue;
                  }
                }
                91 === r
                  ? j++
                  : 93 === r
                    ? j--
                    : 40 === r
                      ? k++
                      : 41 === r && k--;
              }
              let N = A >= w ? A + 1 : w,
                z = N,
                S = g,
                $ = !1,
                M = 0;
              S > z && 33 === e.charCodeAt(S - 1)
                ? (($ = !0), S--)
                : S > z && 33 === e.charCodeAt(z) && (($ = !0), z++, (M = 1));
              let L = -1;
              C > N && (L = C + M) >= S && (L = -1);
              let F = z;
              S - z > 1 && 45 === e.charCodeAt(z) && (F = z + 1);
              let O = 0,
                P = 0,
                R = 0,
                U = -1,
                T = 0;
              (s[0] >= 0 || 1 === E[0]) && ((eD[0] = 0), (eB[0] = F), (T = 1));
              let H = -1,
                V = 0;
              for (let t = F; t < S; t++)
                if ((t === L && ((H = P < R ? -1 : O), (V = T)), -1 !== O)) {
                  let r = e.charCodeAt(t),
                    o = -1;
                  if (P < R)
                    a.charCodeAt(P) === r ? ++P === R && (o = O = U) : (O = -1);
                  else {
                    let e = n[O],
                      t = n[O + 1],
                      s = -1;
                    for (let n = e; n < t; n++) {
                      let e = l[n];
                      if (a.charCodeAt(e) === r) {
                        l[n + 1] - e == 1
                          ? (o = s = i[n])
                          : ((P = e + 1), (R = l[n + 1]), (U = i[n]), (s = O));
                        break;
                      }
                    }
                    O = s;
                  }
                  if (
                    o >= 0 &&
                    (s[o] >= 0 || 1 === E[o]) &&
                    t + 1 < S &&
                    45 === e.charCodeAt(t + 1)
                  ) {
                    if (T === eU) {
                      let e = new Int32Array((eU *= 2));
                      (e.set(eD), (eD = e));
                      let t = new Int32Array(eU);
                      (t.set(eB), (eB = t));
                    }
                    ((eD[T] = o), (eB[T] = t + 2), T++);
                  }
                }
              L === S && ((H = P < R ? -1 : O), (V = T));
              let _ = P < R ? -1 : O,
                W = !1;
              if (L >= 0)
                if (
                  ((W = !0), -1 !== (f = eq(e, z, L, H, V)) && f < r && I[f])
                ) {
                  let t = eq(e, z, S, _, T);
                  -1 !== t && t !== f && ((f = t), (W = !1));
                } else -1 === f && ((f = eq(e, z, S, _, T)), (W = !1));
              else f = eq(e, z, S, _, T);
              let G = 0,
                J = 0;
              (-1 === f
                ? (eL[b] = -1)
                : ((J = +!!W),
                  (G = w >= A ? +!!$ : eh(em, e, w, A, +!!$, (e) => ex(e, $))),
                  (eL[b] = f),
                  (eO[b] = J),
                  (eF[b] = G)),
                eS(y, e, m, g, v, f, G, J));
            }
            if (0 === o) return "";
            if (1 === o)
              return 0 === eE[0] && eM[0] === t ? e : e.slice(eE[0], eM[0]);
            if (o * S > eH) {
              for (; o * S > eH; ) ((eH <<= 1), eV--);
              ((e_ = new Float64Array(eH)), (eW = new Int32Array(eH)));
            }
            if (eg >= 2097152 || ev >= 2097152)
              throw Error("cn: too many distinct classes in one merge");
            0 == (eG = (eG + 1) | 0) && (eT.fill(0), eW.fill(0), (eG = 1));
            let f = !1;
            for (let e = o - 1; e >= 0; e--) {
              let t = eL[e];
              if (-1 === t) {
                eP[e] = 1;
                continue;
              }
              let n = eF[e];
              if (1 === eJ(n, t)) {
                ((eP[e] = 0), (f = !0));
                continue;
              }
              if (((eP[e] = 1), t < r)) {
                let r = N[t];
                if (r >= 0) for (let e = v[r]; e < v[r + 1]; e++) eJ(n, y[e]);
                if (1 & eO[e])
                  for (let e = 0; e < w.length; e++) w[e] === t && eJ(n, j[e]);
              }
            }
            if (!f && !c && t === d + o - 1) return e;
            let h = "",
              m = 0;
            for (; m < o; ) {
              if (!eP[m]) {
                m++;
                continue;
              }
              let t = eE[m],
                r = eM[m],
                n = m + 1;
              for (
                ;
                n < o && eP[n] && eE[n] === r + 1 && 32 === e.charCodeAt(r);

              )
                ((r = eM[n]), n++);
              (h.length > 0 && (h += " "), (h += e.slice(t, r)), (m = n));
            }
            return h;
          },
          eK = new Int32Array(32768),
          eY = 0,
          eX = 1,
          eQ = Object.create(null),
          e0 = Object.create(null),
          e2 = new Map(),
          e1 = new Map(),
          e4 = 0,
          e3 = 0,
          e6 = () => {
            ((eY ^= 16384), (eX = (eX + 1) | 0), (e3 = 0));
          },
          e5 =
            0 === R
              ? eZ
              : Q
                ? (e) => {
                    let t = e2.get(e);
                    return void 0 !== t
                      ? t
                      : ((e) => {
                          let t = e2.get(e);
                          if (void 0 !== t) return t;
                          let r = et(e, 0, e.length),
                            n = (16383 & r) + eY,
                            l =
                              eK[n] === (r ^ eX) ||
                              eK[16384 ^ n] === (r ^ (eX - 1));
                          return l && void 0 !== (t = e1.get(e))
                            ? (e2.set(e, t), t)
                            : ((t = eZ(e)),
                              l
                                ? (e2.set(e, t),
                                  ++e4 > R &&
                                    ((e4 = 0),
                                    (e1 = e2),
                                    (e2 = new Map()),
                                    e6()))
                                : ((eK[n] = r ^ eX), ++e3 > 16384 && e6()),
                              t);
                        })(e);
                  }
                : (e) => {
                    let t = eQ[e];
                    if (void 0 !== t) return t;
                    let r = et(e, 0, e.length),
                      n = (16383 & r) + eY,
                      l =
                        eK[n] === (r ^ eX) || eK[16384 ^ n] === (r ^ (eX - 1));
                    return l && void 0 !== (t = e0[e])
                      ? ((eQ[e] = t), t)
                      : ((t = eZ(e)),
                        l
                          ? ((eQ[e] = t),
                            ++e4 > R &&
                              ((e4 = 0),
                              (e0 = eQ),
                              (eQ = Object.create(null)),
                              e6()))
                          : ((eK[n] = r ^ eX), ++e3 > 16384 && e6()),
                        t);
                  };
        return {
          merge: function () {
            return 1 == arguments.length && "string" == typeof arguments[0]
              ? e5(arguments[0])
              : e5(en.apply(null, arguments));
          },
          mergeString: e5,
          seenBefore:
            0 === R
              ? () => !1
              : (e) => {
                  let t = et(e, 0, e.length),
                    r = (16383 & t) + eY;
                  return (
                    eK[r] === (t ^ eX) ||
                    eK[16384 ^ r] === (t ^ (eX - 1)) ||
                    ((eK[r] = t ^ eX), ++e3 > 16384 && e6(), !1)
                  );
                },
          mergeUncached: eZ,
        };
      })(X),
      ea =
        ((x = el.mergeString),
        (t = void 0 === el ? () => !0 : el.seenBefore),
        (r = void 0 === el ? x : el.mergeUncached),
        (n = new Map()),
        (l = new Map()),
        (a = 0),
        (i = null),
        (o = null),
        (s = []),
        (d = []),
        (c = 0),
        (u = (e, t, r) => {
          null === o &&
            ((o = Array(4096).fill("")),
            (s = Array(4096).fill("")),
            (d = Array(4096).fill("")));
          let n = 4094 & et(e, 0, e.length);
          if (o[n] === e && s[n] === t) return d[n];
          if (o[1 | n] === e && s[1 | n] === t) return d[1 | n];
          let l = x(r ? t + " " + e : e),
            a = "" === o[n] ? n : n | ("" === o[1 | n] ? 1 : 1 & c++);
          return ((o[a] = e), (s[a] = t), (d[a] = l), l);
        }),
        (f = (e, t, r, n) => {
          let l = 0;
          if (t) {
            if (t !== e.a0) return !1;
            l = 1;
          }
          if (r) {
            if (r !== (0 === l ? e.a0 : e.a1)) return !1;
            l++;
          }
          if (n) {
            if (n !== (0 === l ? e.a0 : 1 === l ? e.a1 : e.a2)) return !1;
            l++;
          }
          return l === e.t;
        }),
        (h = (e, t) => {
          let r = e.a,
            n = 0;
          for (let e = 0; e < t.length; e++) {
            let l = t[e];
            if (l) {
              if (l !== r[n]) return !1;
              n++;
            }
          }
          return n === e.t;
        }),
        (m = (e, o) => {
          let s = e.length,
            d = null === i ? null : i.n;
          if (!o) {
            if (null !== d && h(d, e)) return ((i = d), d.r);
            if (null !== i && i !== d && h(i, e)) return i.r;
          }
          let c = "",
            f = -1,
            m = 0,
            p = !1;
          for (let t = 0; t < s; t++) {
            let r = e[t];
            if (r) {
              if ("string" != typeof r) {
                if (!(r = e[t] = er(r, !0))) continue;
                p = !0;
              }
              (f < 0 && ((c = r), (f = t)), m++);
            }
          }
          if (0 === m) return "";
          if (1 === m) return x(c);
          if (p) {
            if (null !== d && h(d, e)) return ((i = d), d.r);
            if (null !== i && i !== d && h(i, e)) return i.r;
          }
          let g = n.get(c);
          void 0 === g && void 0 !== (g = l.get(c)) && n.set(c, g);
          let b = null;
          if (void 0 !== g) {
            if (g.skip > 0) {
              (g.skip--, (i = null));
              let t = c;
              for (let r = f + 1; r < s; r++) {
                let n = e[r];
                n && (t += " " + n);
              }
              return u(t, "", !1);
            }
            let t = g.e;
            e: for (let r = 0; r < t.length; r++) {
              let n = t[r];
              if (n.t !== m) continue;
              let l = n.a,
                a = 1;
              for (let t = f + 1; t < s; t++) {
                let r = e[t];
                if (r && r !== l[a++]) continue e;
              }
              b = n;
              break;
            }
            null !== b && (g.miss = 0);
          }
          if (null === b) {
            let i = c,
              o = [c];
            for (let t = f + 1; t < s; t++) {
              let r = e[t];
              r && ((i += " " + r), o.push(r));
            }
            if (!t(i)) return r(i);
            ((b = {
              r: x(i),
              t: o.length,
              a0: o[0],
              a1: o[1],
              a2: o[2] ?? "",
              a: o,
              n: null,
            }),
              void 0 === g
                ? n.set(c, (g = { e: [], miss: 0, skip: 0, at: 0 }))
                : ++g.miss > 16 &&
                  ((g.miss = 16),
                  (g.skip = 1024),
                  (g.e.length = 0),
                  (g.at = 0)));
            let d = g.e;
            (d.length < 256
              ? d.push(b)
              : ((d[g.at] = b), (g.at = (g.at + 1) & 255)),
              ++a > 1e3 && ((a = 0), (l = n), (n = new Map())));
          }
          return (null !== i && i !== b && (i.n = b), (i = b), b.r);
        }),
        function (e, t, r) {
          let l = arguments.length;
          if ((1 | l) == 3) {
            let a = i;
            if (null !== a) {
              let n = a.n;
              if (null !== n && f(n, e, t, r)) return ((i = n), n.r);
              if (a !== n && f(a, e, t, r)) return a.r;
            }
            if (2 === l && "string" == typeof t && "" !== t) {
              let r = n.get(e);
              if (void 0 !== r && r.skip > 0)
                return (r.skip--, (i = null), u(t, e, !0));
            }
            return m([e, t, r], !0);
          }
          if (1 === l)
            return "string" == typeof e
              ? x(e)
              : Array.isArray(e)
                ? m(e.slice(), !1)
                : x(er(e, !0));
          let a = i;
          if (null !== a) {
            let e = a.n;
            if (null !== e) {
              let t = e.a,
                r = 0,
                n = !0;
              for (let e = 0; e < l; e++) {
                let l = arguments[e];
                if (l) {
                  if (l !== t[r]) {
                    n = !1;
                    break;
                  }
                  r++;
                }
              }
              if (n && r === e.t) return ((i = e), e.r);
            }
            if (a !== e) {
              let e = a.a,
                t = 0,
                r = !0;
              for (let n = 0; n < l; n++) {
                let l = arguments[n];
                if (l) {
                  if (l !== e[t]) {
                    r = !1;
                    break;
                  }
                  t++;
                }
              }
              if (r && t === a.t) return a.r;
            }
          }
          let o = [];
          for (let e = 0; e < l; e++) o.push(arguments[e]);
          return m(o, !0);
        });
    el.merge;
    var ei = Object.defineProperty,
      eo = (e, t) => ei(e, "name", { value: t, configurable: !0 });
    function es(e, t) {
      if ("function" == typeof e) return e(t);
      null != e && (e.current = t);
    }
    function ed(...e) {
      return (t) => {
        let r = !1,
          n = e.map((e) => {
            let n = es(e, t);
            return (r || "function" != typeof n || (r = !0), n);
          });
        if (r)
          return () => {
            for (let t = 0; t < n.length; t++) {
              let r = n[t];
              "function" == typeof r ? r() : es(e[t], null);
            }
          };
      };
    }
    function ec(...e) {
      return y.useCallback(ed(...e), e);
    }
    (eo(es, "setRef"), eo(ed, "composeRefs"), eo(ec, "useComposedRefs"));
    var eu = Object.defineProperty,
      ef = (e, t) => eu(e, "name", { value: t, configurable: !0 });
    function eh(e) {
      let t = y.forwardRef((t, r) => {
        let { children: n, ...l } = t,
          a = null,
          i = !1,
          o = [];
        ((n = ek(n)),
          y.Children.forEach(n, (e) => {
            if (ev(e)) {
              i = !0;
              let t = "child" in e.props ? e.props.child : e.props.children;
              for (; ew(t) && "function" == typeof ez; ) t = ez(t._payload);
              ((a = eg(e, t)), o.push(a?.props?.children));
            } else o.push(e);
          }),
          a
            ? (a = y.cloneElement(a, void 0, o))
            : !i &&
              1 === y.Children.count(n) &&
              y.isValidElement(n) &&
              (a = n));
        let s = a ? eb(a) : void 0,
          d = ec(r, s);
        if (!a) {
          if (n || 0 === n) throw Error(i ? eN(e) : eC(e));
          return n;
        }
        let c = ex(l, a.props ?? {});
        return (
          a.type !== y.Fragment && (c.ref = r ? d : s),
          y.cloneElement(a, c)
        );
      });
      return ((t.displayName = `${e}.Slot`), t);
    }
    ef(eh, "createSlot");
    var em = eh("Slot"),
      ep = Symbol.for("radix.slottable");
    ef(function (e) {
      let t = ef(
        (e) => ("child" in e ? e.children(e.child) : e.children),
        "Slottable",
      );
      return ((t.displayName = `${e}.Slottable`), (t.__radixId = ep), t);
    }, "createSlottable");
    var eg = ef(
      (e, t) =>
        "child" in e.props
          ? y.isValidElement(t)
            ? y.cloneElement(t, void 0, e.props.children(t.props.children))
            : null
          : y.isValidElement(t)
            ? t
            : null,
      "getSlottableElementFromSlottable",
    );
    function ex(e, t) {
      let r = { ...t };
      for (let n in t) {
        let l = e[n],
          a = t[n];
        /^on[A-Z]/.test(n)
          ? l && a
            ? (r[n] = (...e) => {
                let t = a(...e);
                return (l(...e), t);
              })
            : l && (r[n] = l)
          : "style" === n
            ? (r[n] = { ...l, ...a })
            : "className" === n
              ? (r[n] = [l, a].filter(Boolean).join(" "))
              : "aria-describedby" === n && (r[n] = eA(a, l));
      }
      return { ...e, ...r };
    }
    function eb(e) {
      let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
        r = t && "isReactWarning" in t && t.isReactWarning;
      return r
        ? e.ref
        : (r =
              (t = Object.getOwnPropertyDescriptor(e, "ref")?.get) &&
              "isReactWarning" in t &&
              t.isReactWarning)
          ? e.props.ref
          : e.props.ref || e.ref;
    }
    function ev(e) {
      return (
        y.isValidElement(e) &&
        "function" == typeof e.type &&
        "__radixId" in e.type &&
        e.type.__radixId === ep
      );
    }
    (ef(ex, "mergeProps"), ef(eb, "getElementRef"), ef(ev, "isSlottable"));
    var ey = Symbol.for("react.lazy");
    function ew(e) {
      return (
        null != e &&
        "object" == typeof e &&
        "$$typeof" in e &&
        e.$$typeof === ey &&
        "_payload" in e &&
        ej(e._payload)
      );
    }
    function ej(e) {
      return "object" == typeof e && null !== e && "then" in e;
    }
    function ek(e) {
      let t = e;
      for (; ew(t) && "function" == typeof ez; ) t = ez(t._payload);
      return t;
    }
    function eA(...e) {
      let t = new Set();
      for (let r of e)
        if ("string" == typeof r)
          for (let e of String(r).trim().split(/\s+/)) e && t.add(e);
      return t.size > 0 ? Array.from(t).join(" ") : void 0;
    }
    (ef(ew, "isLazyComponent"),
      ef(ej, "isPromiseLike"),
      ef(ek, "useUnwrappedLazy"),
      ef(eA, "concatAriaDescribedby"));
    var eC = ef(
        (e) =>
          `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,
        "createSlotError",
      ),
      eN = ef(
        (e) =>
          `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
        "createSlottableError",
      ),
      ez = y[" use ".trim().toString()];
    e.s(["Root", 0, em], 91918);
    var eS = e.i(91918),
      eS = eS;
    let e$ =
      ((p =
        "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"),
      (g = {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/80",
            outline:
              "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
            ghost:
              "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
            destructive:
              "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default:
              "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
            xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
            lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
            icon: "size-8",
            "icon-xs":
              "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
            "icon-sm":
              "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
            "icon-lg": "size-9",
          },
        },
        defaultVariants: { variant: "default", size: "default" },
      }),
      (e) => {
        var t;
        if ((null == g ? void 0 : g.variants) == null)
          return N(
            p,
            null == e ? void 0 : e.class,
            null == e ? void 0 : e.className,
          );
        let { variants: r, defaultVariants: n } = g,
          l = Object.keys(r).map((t) => {
            let l = null == e ? void 0 : e[t],
              a = null == n ? void 0 : n[t];
            if (null === l) return null;
            let i = C(l) || C(a);
            return r[t][i];
          }),
          a =
            e &&
            Object.entries(e).reduce((e, t) => {
              let [r, n] = t;
              return (void 0 === n || (e[r] = n), e);
            }, {});
        return N(
          p,
          l,
          null == g || null == (t = g.compoundVariants)
            ? void 0
            : t.reduce((e, t) => {
                let { class: r, className: l, ...i } = t;
                return Object.entries(i).every((e) => {
                  let [t, r] = e;
                  return Array.isArray(r)
                    ? r.includes({ ...n, ...a }[t])
                    : { ...n, ...a }[t] === r;
                })
                  ? [...e, r, l]
                  : e;
              }, []),
          null == e ? void 0 : e.class,
          null == e ? void 0 : e.className,
        );
      });
    function eI({
      className: e,
      variant: t = "default",
      size: r = "default",
      asChild: n = !1,
      ...l
    }) {
      let a = n ? eS.Root : "button";
      return (0, b.jsx)(a, {
        "data-slot": "button",
        "data-variant": t,
        "data-size": r,
        className: ea(e$({ variant: t, size: r, className: e })),
        ...l,
      });
    }
    function eE({ className: e, type: t, ...r }) {
      return (0, b.jsx)("input", {
        type: t,
        "data-slot": "input",
        className: ea(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          e,
        ),
        ...r,
      });
    }
    function eM({ className: e, ...t }) {
      return (0, b.jsx)("textarea", {
        "data-slot": "textarea",
        className: ea(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          e,
        ),
        ...t,
      });
    }
    let eL = "0F6CBD",
      eF = "E8F3FC",
      eO = "FFFFFF",
      eP = "C48A12",
      eR = "FFF6E4",
      eU = "0E7C66",
      eD = "E5F6F1";
    function eB(e, t, r, n, l, a, i, o = eO, s = eL) {
      return {
        id: e,
        text: t,
        sub: r,
        x: n,
        y: l,
        w: a,
        h: i,
        fill: o,
        stroke: s,
        kind: "box",
      };
    }
    let eT = {
        "azure-21v": {
          id: "azure-21v",
          eyebrow: "零信任与网络安全",
          title: "Azure 21V 零信任网络与 China Overlay 适配",
          subtitle: "无隐式信任、无公网暴露，全球模板只做参数级本土化",
          architecture: {
            title: "从全球模板到 21V 信任边界",
            summary:
              "架构与全球 GEA 保持一致。中国区差异进入 China Overlay，运行时只走已验明的私有路径。",
            bullets: ["无隐式信任", "流量不出 VNet", "参数覆盖，不改架构"],
            diagram: {
              width: 1280,
              height: 560,
              nodes: [
                eB(
                  "gea",
                  "全球 GEA 模板",
                  "同一套架构基线",
                  36,
                  36,
                  280,
                  108,
                  eF,
                  eL,
                ),
                eB(
                  "overlay",
                  "China Overlay",
                  "只覆盖法规端点与参数",
                  400,
                  36,
                  300,
                  108,
                  eR,
                  eP,
                ),
                eB(
                  "boundary",
                  "Azure 21V 信任边界",
                  "默认拒绝，无隐式信任",
                  784,
                  36,
                  460,
                  108,
                  eO,
                  eL,
                ),
                {
                  id: "path",
                  text: "运行路径",
                  x: 24,
                  y: 214,
                  w: 1232,
                  h: 220,
                  fill: "F7FBFE",
                  stroke: "9BB8D3",
                  kind: "group",
                },
                {
                  id: "blocked",
                  text: "公网入口已阻断",
                  x: 900,
                  y: 164,
                  w: 344,
                  h: 40,
                  fill: "FFF1F3",
                  stroke: "C4314B",
                  kind: "danger",
                },
                eB(
                  "iam",
                  "身份闸门",
                  "Azure AD 21V · MFA · JIT",
                  48,
                  268,
                  270,
                  120,
                ),
                eB(
                  "vnet",
                  "VNet 微分段",
                  "生产网络互不隐式信任",
                  362,
                  268,
                  270,
                  120,
                ),
                eB(
                  "link",
                  "Private Link",
                  "私有终点留在 VNet 内",
                  676,
                  268,
                  270,
                  120,
                ),
                eB(
                  "service",
                  "目标服务",
                  "数据与平台不对公网开放",
                  990,
                  268,
                  250,
                  120,
                  eD,
                  eU,
                ),
              ],
              edges: [
                { from: "gea", to: "overlay" },
                { from: "overlay", to: "boundary" },
                { from: "iam", to: "vnet" },
                { from: "vnet", to: "link" },
                { from: "link", to: "service" },
              ],
            },
          },
          methodology: {
            title: "零信任落地方法",
            principle:
              "先定边界，再验身份，最后把服务收进虚拟网络。区域差异写进参数，不改全球模板。",
            steps: [
              {
                name: "锁定边界",
                detail:
                  "默认拒绝。先写清哪些流量可以进生产，而不是先开通路再补规则。",
              },
              {
                name: "验明身份",
                detail:
                  "生产身份走 Azure AD 21V，强制 MFA 和 JIT，不保留本地临时账号。",
              },
              {
                name: "收进网络",
                detail:
                  "工作负载放入 VNet，按微分段互访，不因为同处一个大网段就互相信任。",
              },
              {
                name: "私有接入",
                detail:
                  "用 Private Link 把服务终点留在 VNet 内，公网入口不建立。",
              },
              {
                name: "参数覆盖",
                detail:
                  "法规端点和区域配置写入 China Overlay，全球模板的结构保持不动。",
              },
              {
                name: "核对差异",
                detail:
                  "逐项确认 21V 是否有对应服务。缺能力就换实现，不为对齐功能去改蓝图。",
              },
            ],
          },
          cases: {
            title: "落地案例",
            items: [
              {
                name: "GEA 全球模板进入 Azure 21V",
                context:
                  "同一套架构要进中国区。不能把服务暴露到公网，也不能为了合规分叉出第二套蓝图。",
                action:
                  "用 China Overlay 覆盖法规端点；身份收口到 Azure AD 21V 的 MFA 与 JIT；数据面只保留 VNet 内的 Private Link。",
                result:
                  "架构与全球 GEA 仍然一致，公网入口关闭，生产环境不再使用本地临时账号。",
              },
            ],
          },
          tradeoff: {
            title: "优缺点与取舍",
            pros: [
              "全球与中国区共用一套结构，后续变更不用维护两套蓝图",
              "私有终点把公网暴露面关掉，攻击入口明显变少",
              "MFA 和 JIT 把生产特权收成临时授权，而不是长期账号",
              "合规差异留在参数里，评审时能看出改了哪一项",
            ],
            cons: [
              "21V 与全球 Azure 的服务清单和 API 并不完全一致",
              "Overlay 参数要随法规端点持续维护，否则模板无法直接套用",
              "排障要同时看身份、DNS 和私有链路，初期定位更慢",
              "VNet、终点和解析不齐时，业务接入周期会拉长",
            ],
            recommendation:
              "先锁信任边界和私有接入，再逐项核对 21V 的服务差异。缺的能力换实现，不要改全球模板。",
          },
        },
        "gea-data-ai": {
          id: "gea-data-ai",
          eyebrow: "数据与 AI",
          title: "GEA 数据架构与 AI 建设",
          subtitle: "从统一底座到模型交付，再落到可以验收的业务价值",
          architecture: {
            title: "底座、生产线与价值主张",
            summary:
              "数据先汇聚、再治理，模型在工厂里训练，经 MLOps 发布。每条用例对应一项可验收的价值。",
            bullets: ["统一湖仓与治理", "模型工厂到 MLOps", "价值可以逐项验收"],
            diagram: {
              width: 1280,
              height: 560,
              nodes: [
                {
                  id: "base-label",
                  text: "数据架构底座",
                  x: 36,
                  y: 8,
                  w: 240,
                  h: 28,
                  fill: "000000",
                  stroke: "000000",
                  kind: "label",
                },
                eB(
                  "lake",
                  "统一数据湖仓",
                  "多源汇聚，PB 级存储",
                  36,
                  42,
                  384,
                  108,
                  eF,
                  eL,
                ),
                eB(
                  "gov",
                  "数据治理体系",
                  "标准、质量、血缘与权限",
                  452,
                  42,
                  384,
                  108,
                  eF,
                  eL,
                ),
                eB(
                  "rt",
                  "实时计算引擎",
                  "流批一体，秒级延迟",
                  868,
                  42,
                  376,
                  108,
                  eF,
                  eL,
                ),
                {
                  id: "ai-label",
                  text: "AI 与智能引擎",
                  x: 36,
                  y: 168,
                  w: 240,
                  h: 28,
                  fill: "000000",
                  stroke: "000000",
                  kind: "label",
                },
                eB(
                  "factory",
                  "AI 模型工厂",
                  "训练、调优、版本可追溯",
                  36,
                  204,
                  600,
                  120,
                  eR,
                  eP,
                ),
                eB(
                  "mlops",
                  "MLOps 部署平台",
                  "发布、灰度、监控与再训练",
                  668,
                  204,
                  576,
                  120,
                  eR,
                  eP,
                ),
                {
                  id: "value-label",
                  text: "业务价值主张",
                  x: 36,
                  y: 348,
                  w: 240,
                  h: 28,
                  fill: "000000",
                  stroke: "000000",
                  kind: "label",
                },
                eB(
                  "cost",
                  "降本增效",
                  "降低 IT 与运营成本",
                  36,
                  384,
                  292,
                  140,
                  eD,
                  eU,
                ),
                eB(
                  "exp",
                  "体验提升",
                  "按用户需求做个性化服务",
                  352,
                  384,
                  292,
                  140,
                  eD,
                  eU,
                ),
                eB(
                  "innov",
                  "创新引领",
                  "孵化数据产品与新模式",
                  668,
                  384,
                  292,
                  140,
                  eD,
                  eU,
                ),
                eB(
                  "risk",
                  "风险可控",
                  "合规、连续稳定、抗风险",
                  984,
                  384,
                  260,
                  140,
                  eD,
                  eU,
                ),
              ],
              edges: [
                { from: "lake", to: "gov" },
                { from: "gov", to: "rt" },
                { from: "factory", to: "mlops" },
              ],
            },
          },
          methodology: {
            title: "建设方法",
            principle:
              "先有可共享的数据和认责，再把模型做成可重复的生产线，最后用一条价值指标验收。",
            steps: [
              {
                name: "汇聚",
                detail:
                  "多源数据进入统一湖仓，结构化和非结构化一起存储、一起检索。",
              },
              {
                name: "治理",
                detail:
                  "标准、质量、血缘和权限先于广泛使用，目录要有业务主人。",
              },
              {
                name: "实时",
                detail: "需要秒级判断的链路走流批一体，和批处理在资源上分开。",
              },
              {
                name: "生产模型",
                detail: "预测、分类、推荐进入模型工厂，训练和版本可以追溯。",
              },
              {
                name: "交付",
                detail: "MLOps 负责发布、灰度、监控和再训练，回滚是常规操作。",
              },
              {
                name: "兑现",
                detail:
                  "每条用例只对应降本、体验、创新或风控中的一条，避免价值说不清。",
              },
            ],
          },
          cases: {
            title: "建设案例",
            items: [
              {
                name: "从部门数据到可重复的模型交付",
                context:
                  "数据散在各部门，模型靠个人脚本上线，业务侧看不到可以复用的资产。",
                action:
                  "湖仓统一汇聚，治理目录认责到人，模型工厂收口训练，MLOps 把发布和回滚做成固定流程。",
                result:
                  "跨部门共享同一份数据，模型交付从一次性项目变成可以重复运行的生产线。",
              },
            ],
          },
          tradeoff: {
            title: "优缺点与取舍",
            pros: [
              "底座、模型和生产价值画在同一张图里，投资口径清楚",
              "治理放在使用之前，少做事后补标准和补血缘的返工",
              "模型有版本和监控，线上问题能回到一次具体训练",
              "价值拆成四条，验收时可以逐项看，而不是只看平台是否建完",
            ],
            cons: [
              "湖仓、治理和 MLOps 一起铺，初期范围容易过大",
              "实时和批处理如果共用资源池，高峰会互相拖慢",
              "目录没有业务主人时，治理会停在文档",
              "价值指标不进经营例会，蓝图就只停留在汇报",
            ],
            recommendation:
              "先打通一条从数据到模型、再到一个价值指标的窄链路，跑通之后再扩展平台。",
          },
        },
      },
      eH = [
        {
          id: "azure-21v",
          name: "Azure 21V 零信任",
          detail: "全球模板、China Overlay、私有链路",
        },
        {
          id: "gea-data-ai",
          name: "GEA 数据与 AI",
          detail: "湖仓、治理、模型工厂与价值",
        },
      ];
    function eV(e) {
      return structuredClone(eT[e]);
    }
    function e_(e) {
      return e
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    let eW = [
      { id: "brief", label: "文稿", detail: "标题与封面" },
      { id: "architecture", label: "架构图", detail: "draw.io 流程" },
      { id: "methodology", label: "方法论", detail: "原则与步骤" },
      { id: "cases", label: "案例", detail: "背景、动作、结果" },
      { id: "tradeoff", label: "优缺点", detail: "取舍与建议" },
    ];
    function eG({ label: e, children: t }) {
      return (0, b.jsxs)("label", {
        className: "block",
        children: [
          (0, b.jsx)("span", {
            className: "mb-1.5 block text-sm font-medium text-[#17304d]",
            children: e,
          }),
          t,
        ],
      });
    }
    function eJ({ deck: e, pages: t, presetId: r, onPreset: n, onChange: l }) {
      return (0, b.jsxs)("div", {
        className: "space-y-5",
        children: [
          (0, b.jsxs)("div", {
            children: [
              (0, b.jsx)("h2", {
                className: "text-lg font-semibold text-[#142033]",
                children: "文稿",
              }),
              (0, b.jsx)("p", {
                className: "mt-1 text-sm leading-6 text-[#5e6d80]",
                children:
                  "选一个预设当底稿，再改标题。生成结果固定包含封面、架构图、方法论、案例和优缺点。",
              }),
            ],
          }),
          (0, b.jsx)("div", {
            className: "grid gap-2 sm:grid-cols-2",
            children: eH.map((e) =>
              (0, b.jsx)(
                eI,
                {
                  type: "button",
                  variant: "outline",
                  "aria-pressed": r === e.id,
                  onClick: () => n(e.id),
                  className:
                    r === e.id
                      ? "h-auto justify-start bg-[#e8f3fc] py-3 text-left hover:bg-[#e8f3fc]"
                      : "h-auto justify-start bg-white py-3 text-left",
                  children: (0, b.jsxs)("span", {
                    children: [
                      (0, b.jsx)("span", {
                        className: "block font-semibold text-[#142033]",
                        children: e.name,
                      }),
                      (0, b.jsx)("span", {
                        className:
                          "mt-0.5 block text-xs font-normal text-[#5e6d80]",
                        children: e.detail,
                      }),
                    ],
                  }),
                },
                e.id,
              ),
            ),
          }),
          (0, b.jsxs)("div", {
            className: "grid gap-4",
            children: [
              (0, b.jsx)(eG, {
                label: "眉题",
                children: (0, b.jsx)(eE, {
                  maxLength: 24,
                  value: e.eyebrow,
                  onChange: (t) => l({ ...e, eyebrow: t.target.value }),
                }),
              }),
              (0, b.jsx)(eG, {
                label: "标题",
                children: (0, b.jsx)(eE, {
                  maxLength: 60,
                  value: e.title,
                  onChange: (t) => l({ ...e, title: t.target.value }),
                }),
              }),
              (0, b.jsx)(eG, {
                label: "副标题",
                children: (0, b.jsx)(eM, {
                  maxLength: 90,
                  value: e.subtitle,
                  onChange: (t) => l({ ...e, subtitle: t.target.value }),
                }),
              }),
            ],
          }),
          (0, b.jsxs)("div", {
            className: "rounded-xl bg-[#f4f8fc] px-4 py-3",
            children: [
              (0, b.jsxs)("p", {
                className: "text-sm font-medium text-[#17304d]",
                children: ["将生成 ", t, " 页"],
              }),
              (0, b.jsxs)("ol", {
                className: "mt-2 space-y-1 text-sm text-[#5e6d80]",
                children: [
                  (0, b.jsx)("li", { children: "1. 封面" }),
                  (0, b.jsxs)("li", {
                    children: ["2. ", e.architecture.title],
                  }),
                  (0, b.jsxs)("li", { children: ["3. ", e.methodology.title] }),
                  e.cases.items.map((e, t) =>
                    (0, b.jsxs)(
                      "li",
                      { children: [t + 4, ". ", e.name || "未命名案例"] },
                      `${e.name}-${t}`,
                    ),
                  ),
                  (0, b.jsxs)("li", {
                    children: [
                      4 + e.cases.items.length,
                      ". ",
                      e.tradeoff.title,
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    function eq({
      deck: e,
      xml: t,
      drawioOpen: r,
      drawioRef: n,
      onChange: l,
      onOpenDrawio: a,
      onUpload: i,
      onClearImage: o,
    }) {
      let s = e.architecture;
      return (0, b.jsxs)("div", {
        className: "space-y-5",
        children: [
          (0, b.jsxs)("div", {
            children: [
              (0, b.jsx)("h2", {
                className: "text-lg font-semibold text-[#142033]",
                children: "架构图",
              }),
              (0, b.jsx)("p", {
                className: "mt-1 text-sm leading-6 text-[#5e6d80]",
                children:
                  "流程图以 draw.io 为素材。编辑器里的图会导出成图片放进这一页；连不上时，按下面这套模板流程画进 PPT。",
              }),
            ],
          }),
          (0, b.jsx)(eG, {
            label: "这一页的标题",
            children: (0, b.jsx)(eE, {
              maxLength: 60,
              value: s.title,
              onChange: (t) =>
                l({ ...e, architecture: { ...s, title: t.target.value } }),
            }),
          }),
          (0, b.jsx)(eG, {
            label: "说明",
            children: (0, b.jsx)(eM, {
              maxLength: 140,
              value: s.summary,
              onChange: (t) =>
                l({ ...e, architecture: { ...s, summary: t.target.value } }),
            }),
          }),
          (0, b.jsx)(eQ, {
            label: "页眉短句",
            items: s.bullets,
            max: 4,
            placeholder: "例如：流量不出 VNet",
            empty: "还没有短句。可以不加，架构图本身仍然会生成。",
            onChange: (t) => l({ ...e, architecture: { ...s, bullets: t } }),
          }),
          (0, b.jsx)("div", {
            className:
              "overflow-hidden rounded-xl border border-[#d5e3f0] bg-[#f4f8fc] p-3",
            children: s.imageDataUrl
              ? (0, b.jsx)("img", {
                  src: s.imageDataUrl,
                  alt: s.title,
                  className: "h-auto w-full",
                })
              : (0, b.jsx)(k, { diagram: s.diagram, title: s.title }),
          }),
          (0, b.jsxs)("div", {
            className: "flex flex-wrap gap-2",
            children: [
              (0, b.jsx)(eI, {
                type: "button",
                variant: "outline",
                onClick: a,
                children: r ? "draw.io 已打开" : "用 draw.io 编辑",
              }),
              (0, b.jsx)(eI, {
                type: "button",
                variant: "outline",
                onClick: () => {
                  var r;
                  let n, l, a;
                  return (
                    (r = `${e.title || "流程"}.drawio`),
                    (n = new Blob([t], {
                      type: "application/vnd.jgraph.mxfile",
                    })),
                    (l = URL.createObjectURL(n)),
                    void (((a = document.createElement("a")).href = l),
                    (a.download = r),
                    a.click(),
                    URL.revokeObjectURL(l))
                  );
                },
                children: "下载 .drawio",
              }),
              (0, b.jsxs)("label", {
                className:
                  "inline-flex h-8 cursor-pointer items-center rounded-lg border border-input bg-background px-2.5 text-sm font-medium hover:bg-muted",
                children: [
                  "上传 PNG / draw.io",
                  (0, b.jsx)("input", {
                    type: "file",
                    accept: "image/png,.drawio,.xml,application/xml,text/xml",
                    className: "sr-only",
                    onChange: (e) => {
                      (i(e.target.files?.[0]), (e.target.value = ""));
                    },
                  }),
                ],
              }),
              s.imageDataUrl
                ? (0, b.jsx)(eI, {
                    type: "button",
                    variant: "ghost",
                    onClick: o,
                    children: "改回模板流程",
                  })
                : null,
            ],
          }),
          r ? (0, b.jsx)(A, { ref: n, xml: t }) : null,
        ],
      });
    }
    function eZ({ deck: e, onChange: t }) {
      let r = e.methodology;
      return (0, b.jsxs)("div", {
        className: "space-y-5",
        children: [
          (0, b.jsxs)("div", {
            children: [
              (0, b.jsx)("h2", {
                className: "text-lg font-semibold text-[#142033]",
                children: "方法论",
              }),
              (0, b.jsx)("p", {
                className: "mt-1 text-sm leading-6 text-[#5e6d80]",
                children:
                  "先写原则，再写有顺序的步骤。最多 6 步，每步一个名称和一句说明。",
              }),
            ],
          }),
          (0, b.jsx)(eG, {
            label: "标题",
            children: (0, b.jsx)(eE, {
              maxLength: 60,
              value: r.title,
              onChange: (n) =>
                t({ ...e, methodology: { ...r, title: n.target.value } }),
            }),
          }),
          (0, b.jsx)(eG, {
            label: "原则",
            children: (0, b.jsx)(eM, {
              maxLength: 140,
              value: r.principle,
              onChange: (n) =>
                t({ ...e, methodology: { ...r, principle: n.target.value } }),
            }),
          }),
          (0, b.jsxs)("div", {
            className: "space-y-3",
            children: [
              0 === r.steps.length
                ? (0, b.jsx)("p", {
                    className: "text-sm text-[#5e6d80]",
                    children: "还没有步骤。至少加一步，否则不能生成。",
                  })
                : null,
              r.steps.map((n, l) =>
                (0, b.jsxs)(
                  "div",
                  {
                    className: "rounded-xl border border-[#e1e7ee] p-3",
                    children: [
                      (0, b.jsxs)("div", {
                        className: "mb-2 flex items-center justify-between",
                        children: [
                          (0, b.jsxs)("p", {
                            className: "text-sm font-medium text-[#17304d]",
                            children: ["步骤 ", l + 1],
                          }),
                          (0, b.jsx)(eI, {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            onClick: () =>
                              t({
                                ...e,
                                methodology: {
                                  ...r,
                                  steps: r.steps.filter((e, t) => t !== l),
                                },
                              }),
                            children: "删除",
                          }),
                        ],
                      }),
                      (0, b.jsxs)("div", {
                        className: "grid gap-3",
                        children: [
                          (0, b.jsx)(eE, {
                            maxLength: 16,
                            value: n.name,
                            placeholder: "步骤名称",
                            "aria-label": `步骤 ${l + 1} 名称`,
                            onChange: (n) => {
                              let a = r.steps.map((e, t) =>
                                t === l ? { ...e, name: n.target.value } : e,
                              );
                              t({ ...e, methodology: { ...r, steps: a } });
                            },
                          }),
                          (0, b.jsx)(eM, {
                            maxLength: 90,
                            value: n.detail,
                            placeholder: "这一步做什么",
                            "aria-label": `步骤 ${l + 1} 说明`,
                            onChange: (n) => {
                              let a = r.steps.map((e, t) =>
                                t === l ? { ...e, detail: n.target.value } : e,
                              );
                              t({ ...e, methodology: { ...r, steps: a } });
                            },
                          }),
                        ],
                      }),
                    ],
                  },
                  l,
                ),
              ),
              (0, b.jsx)(eI, {
                type: "button",
                variant: "outline",
                disabled: r.steps.length >= 6,
                onClick: () =>
                  t({
                    ...e,
                    methodology: {
                      ...r,
                      steps: [...r.steps, { name: "", detail: "" }],
                    },
                  }),
                children: "添加步骤",
              }),
            ],
          }),
        ],
      });
    }
    function eK({ deck: e, onChange: t }) {
      let r = e.cases;
      return (0, b.jsxs)("div", {
        className: "space-y-5",
        children: [
          (0, b.jsxs)("div", {
            children: [
              (0, b.jsx)("h2", {
                className: "text-lg font-semibold text-[#142033]",
                children: "案例",
              }),
              (0, b.jsx)("p", {
                className: "mt-1 text-sm leading-6 text-[#5e6d80]",
                children: "每个案例单独一页，分成背景、动作和结果。最多 3 个。",
              }),
            ],
          }),
          (0, b.jsx)(eG, {
            label: "章节标题",
            children: (0, b.jsx)(eE, {
              maxLength: 60,
              value: r.title,
              onChange: (n) =>
                t({ ...e, cases: { ...r, title: n.target.value } }),
            }),
          }),
          0 === r.items.length
            ? (0, b.jsx)("p", {
                className: "text-sm text-[#5e6d80]",
                children: "还没有案例。至少加一个，否则不能生成。",
              })
            : null,
          r.items.map((n, l) =>
            (0, b.jsxs)(
              "div",
              {
                className: "space-y-3 rounded-xl border border-[#e1e7ee] p-3",
                children: [
                  (0, b.jsxs)("div", {
                    className: "flex items-center justify-between",
                    children: [
                      (0, b.jsxs)("p", {
                        className: "text-sm font-medium text-[#17304d]",
                        children: ["案例 ", l + 1],
                      }),
                      (0, b.jsx)(eI, {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: () =>
                          t({
                            ...e,
                            cases: {
                              ...r,
                              items: r.items.filter((e, t) => t !== l),
                            },
                          }),
                        children: "删除",
                      }),
                    ],
                  }),
                  (0, b.jsx)(eE, {
                    maxLength: 40,
                    value: n.name,
                    placeholder: "案例名称",
                    "aria-label": `案例 ${l + 1} 名称`,
                    onChange: (r) => eY(e, l, { name: r.target.value }, t),
                  }),
                  (0, b.jsx)(eM, {
                    maxLength: 140,
                    value: n.context,
                    placeholder: "背景",
                    "aria-label": `案例 ${l + 1} 背景`,
                    onChange: (r) => eY(e, l, { context: r.target.value }, t),
                  }),
                  (0, b.jsx)(eM, {
                    maxLength: 140,
                    value: n.action,
                    placeholder: "动作",
                    "aria-label": `案例 ${l + 1} 动作`,
                    onChange: (r) => eY(e, l, { action: r.target.value }, t),
                  }),
                  (0, b.jsx)(eM, {
                    maxLength: 140,
                    value: n.result,
                    placeholder: "结果",
                    "aria-label": `案例 ${l + 1} 结果`,
                    onChange: (r) => eY(e, l, { result: r.target.value }, t),
                  }),
                ],
              },
              l,
            ),
          ),
          (0, b.jsx)(eI, {
            type: "button",
            variant: "outline",
            disabled: r.items.length >= 3,
            onClick: () =>
              t({
                ...e,
                cases: {
                  ...r,
                  items: [
                    ...r.items,
                    { name: "", context: "", action: "", result: "" },
                  ],
                },
              }),
            children: "添加案例",
          }),
        ],
      });
    }
    function eY(e, t, r, n) {
      let l = e.cases.items.map((e, n) => (n === t ? { ...e, ...r } : e));
      n({ ...e, cases: { ...e.cases, items: l } });
    }
    function eX({ deck: e, onChange: t }) {
      let r = e.tradeoff;
      return (0, b.jsxs)("div", {
        className: "space-y-5",
        children: [
          (0, b.jsxs)("div", {
            children: [
              (0, b.jsx)("h2", {
                className: "text-lg font-semibold text-[#142033]",
                children: "优缺点",
              }),
              (0, b.jsx)("p", {
                className: "mt-1 text-sm leading-6 text-[#5e6d80]",
                children:
                  "优点和局限分开写，最后给一句可执行的建议。每边最多 6 条。",
              }),
            ],
          }),
          (0, b.jsx)(eG, {
            label: "标题",
            children: (0, b.jsx)(eE, {
              maxLength: 60,
              value: r.title,
              onChange: (n) =>
                t({ ...e, tradeoff: { ...r, title: n.target.value } }),
            }),
          }),
          (0, b.jsx)(eQ, {
            label: "优点",
            items: r.pros,
            max: 6,
            placeholder: "写一条具体好处",
            empty: "还没有优点。至少留一条才能生成。",
            onChange: (n) => t({ ...e, tradeoff: { ...r, pros: n } }),
          }),
          (0, b.jsx)(eQ, {
            label: "局限",
            items: r.cons,
            max: 6,
            placeholder: "写一条真实约束",
            empty: "还没有局限。至少留一条才能生成。",
            onChange: (n) => t({ ...e, tradeoff: { ...r, cons: n } }),
          }),
          (0, b.jsx)(eG, {
            label: "建议",
            children: (0, b.jsx)(eM, {
              maxLength: 140,
              value: r.recommendation,
              onChange: (n) =>
                t({ ...e, tradeoff: { ...r, recommendation: n.target.value } }),
            }),
          }),
        ],
      });
    }
    function eQ({
      label: e,
      items: t,
      max: r,
      placeholder: n,
      empty: l,
      onChange: a,
    }) {
      return (0, b.jsxs)("div", {
        className: "space-y-2",
        children: [
          (0, b.jsxs)("div", {
            className: "flex items-center justify-between gap-3",
            children: [
              (0, b.jsx)("h3", {
                className: "text-sm font-medium text-[#17304d]",
                children: e,
              }),
              (0, b.jsx)(eI, {
                type: "button",
                variant: "outline",
                size: "sm",
                disabled: t.length >= r,
                onClick: () => a([...t, ""]),
                children: "添加",
              }),
            ],
          }),
          0 === t.length
            ? (0, b.jsx)("p", {
                className: "text-sm text-[#5e6d80]",
                children: l,
              })
            : null,
          (0, b.jsx)("ul", {
            className: "space-y-2",
            children: t.map((r, l) =>
              (0, b.jsxs)(
                "li",
                {
                  className: "flex gap-2",
                  children: [
                    (0, b.jsx)(eE, {
                      maxLength: 80,
                      value: r,
                      placeholder: n,
                      "aria-label": `${e} ${l + 1}`,
                      onChange: (e) =>
                        a(t.map((t, r) => (r === l ? e.target.value : t))),
                    }),
                    (0, b.jsx)(eI, {
                      type: "button",
                      variant: "ghost",
                      onClick: () => a(t.filter((e, t) => t !== l)),
                      children: "删除",
                    }),
                  ],
                },
                l,
              ),
            ),
          }),
        ],
      });
    }
    e.s(
      [
        "Studio",
        0,
        function () {
          var e;
          let t,
            r,
            [n, l] = (0, y.useState)("azure-21v"),
            [a, i] = (0, y.useState)(() => eV("azure-21v")),
            [o, s] = (0, y.useState)("architecture"),
            [d, c] = (0, y.useState)(!1),
            [u, f] = (0, y.useState)(null),
            [h, m] = (0, y.useState)(!1),
            [p, g] = (0, y.useState)(null),
            [x, w] = (0, y.useState)(null),
            j = (0, y.useRef)(null),
            k =
              u ??
              ((t = (e = a.architecture.diagram).nodes
                .map(
                  (e) => `        <mxCell id="${e_(e.id)}" value="${(function (
                    e,
                  ) {
                    if ("label" === e.kind) return e_(e.text);
                    let t = e_(e.text);
                    if (!e.sub) return `&lt;b&gt;${t}&lt;/b&gt;`;
                    let r = e_(e.sub);
                    return `&lt;b&gt;${t}&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:12px&quot; color=&quot;#5e6d80&quot;&gt;${r}&lt;/font&gt;`;
                  })(e)}" style="${(function (e) {
                    if ("label" === e.kind)
                      return "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontFamily=Microsoft YaHei;fontSize=14;fontStyle=1;fontColor=#0F6CBD;";
                    let t =
                        "group" === e.kind ? "dashed=1;dashPattern=8 4;" : "",
                      r =
                        "group" === e.kind
                          ? "align=left;verticalAlign=top;spacingLeft=14;spacingTop=8;fontStyle=1;"
                          : "align=center;verticalAlign=middle;";
                    return [
                      "rounded=1",
                      "whiteSpace=wrap",
                      "html=1",
                      "arcSize=8",
                      `fillColor=#${e.fill}`,
                      `strokeColor=#${e.stroke}`,
                      "strokeWidth=1.5",
                      "fontFamily=Microsoft YaHei",
                      "fontSize=15",
                      "fontColor=#142033",
                      t,
                      r,
                    ]
                      .filter(Boolean)
                      .join(";");
                  })(e)}" vertex="1" parent="1">
          <mxGeometry x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" as="geometry"/>
        </mxCell>`,
                )
                .join("\n")),
              (r = e.edges
                .map(
                  (
                    e,
                    t,
                  ) => `        <mxCell id="e${t + 1}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=#0F6CBD;strokeWidth=1.75;" edge="1" parent="1" source="${e_(e.from)}" target="${e_(e.to)}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`,
                )
                .join("\n")),
              `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" type="device">
  <diagram id="flow" name="流程">
    <mxGraphModel dx="${e.width}" dy="${e.height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${e.width}" pageHeight="${e.height}" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
${t}
${r}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`),
            A = 4 + a.cases.items.length;
          async function C() {
            if (!j.current) return null;
            let e = await j.current.exportPng();
            return e
              ? (i((t) => ({
                  ...t,
                  architecture: { ...t.architecture, imageDataUrl: e },
                })),
                e)
              : null;
          }
          async function N(e) {
            ("architecture" === o &&
              "architecture" !== e &&
              d &&
              (await C()) &&
              w("已记下 draw.io 里的架构图，生成时会用这张图。"),
              s(e));
          }
          async function z() {
            (m(!0), g(null), w(null));
            try {
              let e = a.architecture.imageDataUrl;
              if (d) {
                let t = await C();
                t && (e = t);
              }
              let t = await fetch("/api/ppt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...a,
                  architecture: { ...a.architecture, imageDataUrl: e },
                }),
              });
              if (!t.ok) {
                let e = await t.json().catch(() => null);
                g(e?.error ?? "没有生成成功。");
                return;
              }
              let r = await t.blob(),
                n = URL.createObjectURL(r),
                l = document.createElement("a"),
                i = (t.headers.get("content-disposition") ?? "").match(
                  /filename\*=UTF-8''([^;]+)/,
                );
              ((l.href = n),
                (l.download = i ? decodeURIComponent(i[1]) : "deck.pptx"),
                l.click(),
                URL.revokeObjectURL(n),
                w(
                  e
                    ? "PPT 已下载，架构图用的是 draw.io 或上传的图片。"
                    : "PPT 已下载，架构图用的是模板流程。",
                ));
            } catch {
              g("网络中断了，请再试一次。");
            } finally {
              m(!1);
            }
          }
          return (0, b.jsxs)("div", {
            className: "min-h-full bg-[#eef2f4]",
            children: [
              (0, b.jsx)("header", {
                className: "border-b border-[#e1e7ee] bg-white",
                children: (0, b.jsxs)("div", {
                  className:
                    "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6",
                  children: [
                    (0, b.jsxs)("div", {
                      children: [
                        (0, b.jsx)("p", {
                          className:
                            "text-xs font-semibold tracking-[0.16em] text-[#0f6cbd]",
                          children: "演示文稿工坊",
                        }),
                        (0, b.jsx)("h1", {
                          className:
                            "mt-1 text-xl font-semibold text-[#142033]",
                          children: "用 draw.io 流程生成四段式 PPT",
                        }),
                        (0, b.jsx)("p", {
                          className: "mt-1 text-sm text-[#5e6d80]",
                          children:
                            "架构图、方法论、案例、优缺点，一次导出 .pptx。",
                        }),
                      ],
                    }),
                    (0, b.jsxs)("div", {
                      className: "flex items-center gap-4",
                      children: [
                        (0, b.jsx)(v.default, {
                          href: "/",
                          className:
                            "text-sm text-[#5e6d80] underline-offset-4 hover:underline",
                          children: "五张画面",
                        }),
                        (0, b.jsx)(v.default, {
                          href: "/console",
                          className:
                            "text-sm text-[#5e6d80] underline-offset-4 hover:underline",
                          children: "值守台",
                        }),
                        (0, b.jsx)(eI, {
                          type: "button",
                          onClick: () => void z(),
                          disabled: h,
                          className:
                            "bg-[#0d2137] text-white hover:bg-[#16324d]",
                          children: h ? "正在生成…" : "生成 PPT",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, b.jsxs)("div", {
                className:
                  "mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]",
                children: [
                  (0, b.jsx)("aside", {
                    className:
                      "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible",
                    children: eW.map((e) =>
                      (0, b.jsx)(
                        eI,
                        {
                          type: "button",
                          variant: o === e.id ? "default" : "outline",
                          "aria-current": o === e.id ? "page" : void 0,
                          onClick: () => void N(e.id),
                          className:
                            o === e.id
                              ? "h-auto shrink-0 justify-start bg-[#0d2137] py-2 whitespace-normal text-white hover:bg-[#16324d] lg:w-full"
                              : "h-auto shrink-0 justify-start bg-white py-2 whitespace-normal lg:w-full",
                          children: (0, b.jsxs)("span", {
                            className: "text-left",
                            children: [
                              (0, b.jsx)("span", {
                                className: "block",
                                children: e.label,
                              }),
                              (0, b.jsx)("span", {
                                className:
                                  o === e.id
                                    ? "block text-[11px] text-white/70"
                                    : "block text-[11px] text-[#8b95a3]",
                                children: e.detail,
                              }),
                            ],
                          }),
                        },
                        e.id,
                      ),
                    ),
                  }),
                  (0, b.jsxs)("div", {
                    className:
                      "rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(16,40,70,0.04)] ring-1 ring-[#e1e7ee] sm:p-6",
                    children: [
                      p
                        ? (0, b.jsx)("p", {
                            role: "alert",
                            className:
                              "mb-4 rounded-lg bg-[#fff1f3] px-3 py-2 text-sm text-[#9f2236]",
                            children: p,
                          })
                        : null,
                      x
                        ? (0, b.jsx)("p", {
                            role: "status",
                            className:
                              "mb-4 rounded-lg bg-[#e5f6f1] px-3 py-2 text-sm text-[#0e7c66]",
                            children: x,
                          })
                        : null,
                      "brief" === o
                        ? (0, b.jsx)(eJ, {
                            deck: a,
                            pages: A,
                            presetId: n,
                            onPreset: function (e) {
                              (l(e),
                                i(eV(e)),
                                f(null),
                                g(null),
                                w(null),
                                s("architecture"));
                            },
                            onChange: i,
                          })
                        : null,
                      "architecture" === o
                        ? (0, b.jsx)(eq, {
                            deck: a,
                            xml: k,
                            drawioOpen: d,
                            drawioRef: j,
                            onChange: i,
                            onOpenDrawio: () => c(!0),
                            onUpload: function (e) {
                              if (e) {
                                if ((g(null), "image/png" === e.type)) {
                                  let t = new FileReader();
                                  ((t.onload = () => {
                                    "string" == typeof t.result &&
                                      (i((e) => ({
                                        ...e,
                                        architecture: {
                                          ...e.architecture,
                                          imageDataUrl: t.result,
                                        },
                                      })),
                                      w(
                                        "已换上这张 PNG，生成时会放进架构图页。",
                                      ));
                                  }),
                                    t.readAsDataURL(e));
                                  return;
                                }
                                if (
                                  e.name.endsWith(".drawio") ||
                                  e.type.includes("xml") ||
                                  e.name.endsWith(".xml")
                                )
                                  return void e.text().then((e) => {
                                    (f(e),
                                      c(!0),
                                      w(
                                        "已载入 draw.io 文件。编辑器连上之后，生成时会导出其中的图。",
                                      ));
                                  });
                                g("请上传 PNG，或 draw.io 的 .drawio 文件。");
                              }
                            },
                            onClearImage: () =>
                              i((e) => ({
                                ...e,
                                architecture: {
                                  ...e.architecture,
                                  imageDataUrl: void 0,
                                },
                              })),
                          })
                        : null,
                      "methodology" === o
                        ? (0, b.jsx)(eZ, { deck: a, onChange: i })
                        : null,
                      "cases" === o
                        ? (0, b.jsx)(eK, { deck: a, onChange: i })
                        : null,
                      "tradeoff" === o
                        ? (0, b.jsx)(eX, { deck: a, onChange: i })
                        : null,
                    ],
                  }),
                ],
              }),
            ],
          });
        },
      ],
      20675,
    );
  };

export const Studio = load(factory).Studio;
