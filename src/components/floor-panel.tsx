"use client";

import { useEffect, useMemo } from "react";
import { buildFloor } from "@/lib/floor";
import { StorePlan } from "@/components/store-plan";
import { aov, formatPct, formatRate, pctDelta, storeLabel, twinYuan, type StoreTwin } from "@/lib/twin";

export function FloorPanel({
  store,
  list,
  explicit,
  minuteKey,
  stamp,
  compared,
}: {
  store: StoreTwin;
  list: StoreTwin[];
  explicit: boolean;
  minuteKey: string;
  stamp: string;
  compared: string;
}) {
  const floor = useMemo(() => buildFloor(store, list, minuteKey), [store, list, minuteKey]);
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
        这一分钟 {stamp}，对照 {compared}。平面按柜位来画：橱窗、岛柜、高珠宝柜和沙发都在原来的位置。颜色是这一分钟的停留，线是人群走的路。鼠标放上去，看这个柜位此刻的人数、件数和金额。
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
          <StorePlan floor={floor} store={store} stamp={stamp} />
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

