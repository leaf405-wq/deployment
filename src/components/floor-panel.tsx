"use client";

import { useEffect, useMemo } from "react";
import { buildFloor, SHOP_PLATE, type FloorTwin } from "@/lib/floor";
import { aov, formatPct, formatRate, pctDelta, storeLabel, stores, twinYuan, type StoreTwin } from "@/lib/twin";

export function FloorPanel({ store, explicit }: { store: StoreTwin; explicit: boolean }) {
  const floor = useMemo(() => buildFloor(store, stores), [store]);
  const upt = floor.units / store.now.buyers;
  const thenUpt = floor.thenUnits / store.then.buyers;

  useEffect(() => {
    if (!explicit) return;
    document.getElementById("store-floor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [explicit, store.id]);

  return (
    <section id="store-floor" className="mt-10 scroll-mt-28" aria-labelledby="store-floor-title">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">分店平面 · {store.tier}</p>
      <h2 id="store-floor-title" className="mt-3 font-serif text-[1.8rem] leading-tight font-medium md:text-4xl">
        {storeLabel(store)}的店内人流
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        廊前是门口经过的人，进店占比是其中走进这一家的比例。颜色越深，停留越久；线越粗，走的人越多。客单量是每笔件数。这是样本汇总，不跟到某一个人。
      </p>
      {explicit ? null : (
        <p className="mt-2 text-sm leading-6 text-[#6d645b]">点地图上的圆，或右边的店名，平面换成那一家。现在先放上海淮海旗舰。</p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-px bg-[#d9d1c3] md:grid-cols-3">
        <FloorMetric label="廊前人流" value={floor.passers.toLocaleString("zh-CN")} note={`进店 ${store.now.visitors.toLocaleString("zh-CN")} 人`} />
        <FloorMetric
          label="进店占比"
          value={formatRate(floor.capture)}
          delta={pctDelta(floor.capture, floor.thenCapture)}
          note={`占${store.city}到店 ${formatRate(floor.cityShare)}`}
        />
        <FloorMetric
          label="平均路程"
          value={`${floor.avgMeters.toFixed(1)} 米`}
          delta={pctDelta(floor.avgMeters, floor.thenAvgMeters)}
          plain
        />
        <FloorMetric
          label="客单量"
          value={`${upt.toFixed(2)} 件`}
          delta={pctDelta(upt, thenUpt)}
          note={`成交 ${store.now.buyers} 笔`}
          plain
        />
        <FloorMetric
          label="客单价"
          value={twinYuan(aov(store.now))}
          delta={pctDelta(aov(store.now), aov(store.then))}
        />
        <FloorMetric
          label="成交笔数"
          value={store.now.buyers.toLocaleString("zh-CN")}
          delta={pctDelta(store.now.buyers, store.then.buyers)}
        />
      </dl>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)]">
        <div>
          <FloorSvg floor={floor} passers={floor.passers} label={storeLabel(store)} />
          <p className="mt-2 text-xs leading-5 text-[#6d645b]">店框外是廊前。金褐色越深，人停得越久。三条线是人群最常走的路，不是某一个人的轨迹。</p>
        </div>
        <div className="border border-[#d9d1c3]">
          <div className="border-b border-[#d9d1c3] px-3 py-3">
            <h3 className="text-[11px] tracking-[0.16em] text-[#6d645b]">走动</h3>
            <ul className="mt-2">
              {floor.paths.map((path) => (
                <li key={path.id} className="border-t border-[#d9d1c3] py-2 first:border-t-0">
                  <p className="font-serif text-lg">{path.name}</p>
                  <p className="text-xs leading-5 text-[#3c342c]">
                    占进店 {formatRate(path.share)} · {path.meters.toFixed(1)} 米 · 成交 {path.buyers} 笔 · {path.category}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-b border-[#d9d1c3] px-3 py-3">
            <h3 className="text-[11px] tracking-[0.16em] text-[#6d645b]">停留</h3>
            <ul className="mt-3 space-y-2">
              {[...floor.zones]
                .sort((a, b) => b.dwellShare - a.dwellShare)
                .map((zone) => (
                  <li key={zone.id} className="grid grid-cols-[4rem_1fr_auto] items-center gap-2 text-xs">
                    <span>{zone.label}</span>
                    <span className="relative h-1.5 bg-[#ebe4d6]">
                      <span className="absolute inset-y-0 left-0 bg-[#8c734b]" style={{ width: `${Math.max(4, zone.dwellShare * 100)}%` }} />
                    </span>
                    <span className="text-[#6d645b]">{formatRate(zone.dwellShare)}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="px-3 py-3">
            <h3 className="text-[11px] tracking-[0.16em] text-[#6d645b]">品类 · 件数与金额</h3>
            <ul className="mt-2">
              {floor.pieces.map((piece) => (
                <li key={piece.category} className="flex items-baseline justify-between gap-3 border-t border-[#d9d1c3] py-1.5 text-sm first:border-t-0">
                  <span>
                    {piece.category}
                    <span className="ml-2 text-xs text-[#6d645b]">{piece.units} 件</span>
                  </span>
                  <span className="text-xs text-[#3c342c]">{twinYuan(piece.sales)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 border-l border-[#8c734b] pl-4">
        {floor.reading.map((line) => (
          <p key={line} className="max-w-3xl py-1.5 text-[15px] leading-7">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

function FloorMetric({
  label,
  value,
  delta,
  note,
  plain = false,
}: {
  label: string;
  value: string;
  delta?: number | null;
  note?: string;
  plain?: boolean;
}) {
  const good = !plain && delta !== undefined && delta !== null && delta > 0;
  const bad = !plain && delta !== undefined && delta !== null && delta < 0;
  return (
    <div className="bg-[#f3efe6] px-4 py-4">
      <dt className="text-[11px] tracking-[0.14em] text-[#6d645b]">{label}</dt>
      <dd className="mt-2 font-display text-3xl tracking-wide">{value}</dd>
      {delta !== undefined ? (
        <p className={good ? "mt-1 text-xs text-[#8c734b]" : bad ? "mt-1 text-xs text-[#8c3a32]" : "mt-1 text-xs text-[#6d645b]"}>
          环比 {formatPct(delta)}
        </p>
      ) : (
        <p className="mt-1 text-xs text-[#6d645b]">{note}</p>
      )}
      {delta !== undefined && note ? <p className="text-xs text-[#6d645b]">{note}</p> : null}
    </div>
  );
}

function FloorSvg({ floor, passers, label }: { floor: FloorTwin; passers: number; label: string }) {
  const rows = floor.heat.length;
  const cols = floor.heat[0]?.length ?? 1;
  const cellW = 100 / cols;
  const cellH = 80 / rows;
  const stayed = [...floor.zones].sort((a, b) => b.dwellShare - a.dwellShare)[0];

  return (
    <svg
      viewBox="0 0 100 80"
      role="img"
      aria-label={`${label}店内热力。进店占比 ${formatRate(floor.capture)}，平均 ${floor.avgMeters.toFixed(1)} 米。停留最久在${stayed?.label ?? "店内"}。`}
      className="h-auto w-full border border-[#d9d1c3] bg-[#f7f4ee]"
    >
      <title>{`${label}店内热力`}</title>
      <defs>
        <filter id="floor-heat" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="1.15" />
        </filter>
      </defs>
      <g filter="url(#floor-heat)">
        {floor.heat.map((row, y) =>
          row.map((value, x) => (
            <rect key={`${x}-${y}`} x={x * cellW} y={y * cellH} width={cellW + 0.12} height={cellH + 0.12} fill={heatFill(value)} />
          )),
        )}
      </g>
      <rect
        x={SHOP_PLATE.x}
        y={SHOP_PLATE.y}
        width={SHOP_PLATE.w}
        height={SHOP_PLATE.h}
        fill="none"
        stroke="#1c1915"
        strokeWidth={0.45}
      />
      <text x="50" y="4.2" textAnchor="middle" fontSize="2.3" fill="#6d645b">
        廊前 · 经过 {passers.toLocaleString("zh-CN")} 人
      </text>
      {floor.paths.map((path) => (
        <polyline
          key={path.id}
          points={path.points.map((point) => point.join(",")).join(" ")}
          fill="none"
          stroke="#1c1915"
          strokeWidth={0.35 + path.share * 1.35}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity={0.88}
        />
      ))}
      {floor.zones.map((zone) => {
        const chipW = Math.max(zone.label.length * 3.1, 8);
        const cx = zone.x + zone.w / 2;
        const cy = zone.y + zone.h / 2;
        return (
          <g key={zone.id}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill="none" stroke="#1c1915" strokeOpacity={0.28} strokeWidth={0.25} />
            <rect x={cx - chipW / 2} y={cy - 2.1} width={chipW} height={4.2} fill="#f7f4ee" fillOpacity={0.9} />
            <text x={cx} y={cy + 0.7} textAnchor="middle" fontSize="2.5" fill="#1c1915">
              {zone.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function heatFill(value: number) {
  const eased = Math.pow(Math.min(1, Math.max(0, value)), 0.7);
  const ivory = [247, 244, 238];
  const gold = [166, 128, 68];
  const ink = [62, 32, 24];
  const [from, to, t] = eased < 0.58 ? [ivory, gold, eased / 0.58] : [gold, ink, (eased - 0.58) / 0.42];
  const rgb = from.map((channel, index) => Math.round(channel + (to[index] - channel) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
