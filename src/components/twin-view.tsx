"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AS_OF,
  COMPARED_TO,
  aov,
  askTwin,
  categoryRows,
  conversion,
  formatPct,
  formatRate,
  pctDelta,
  rollup,
  storeLabel,
  stores,
  twinReading,
  twinYuan,
} from "@/lib/twin";

type Lens = "all" | "conversion-down" | "churn-up";

const lenses: { id: Lens; label: string }[] = [
  { id: "all", label: "五十家" },
  { id: "conversion-down", label: "转化走低" },
  { id: "churn-up", label: "流失上升" },
];

export function TwinView() {
  const [lens, setLens] = useState<Lens>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const reading = useMemo(() => twinReading(stores), []);

  const visible = stores.filter((store) => {
    const haystack = `${store.city}${store.name}${store.region}`;
    if (query.trim() && !haystack.includes(query.trim())) return false;
    if (lens === "conversion-down") return (pctDelta(conversion(store.now), conversion(store.then)) ?? 0) < 0;
    if (lens === "churn-up") return (pctDelta(store.now.churn, store.then.churn) ?? 0) > 0;
    return true;
  });

  const selected = stores.find((store) => store.id === selectedId) ?? null;
  const scope = selected ? [selected] : visible.length > 0 ? visible : stores;
  const now = rollup(scope, "now");
  const then = rollup(scope, "then");
  const rows = categoryRows(scope);
  const maxCategory = Math.max(...rows.map((row) => row.sales), 1);

  function ask(text: string) {
    setQuestion(text);
    setAnswer(askTwin(text));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">孪生 · 五十家店</p>
      <h1 className="mt-3 font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">同刻看完全网</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        样本时刻 {AS_OF}，对照 {COMPARED_TO}。地图上的圆是到店人流，颜色是转化相对上月同刻的方向。没有个人轨迹，只有门店汇总。
      </p>

      <div className="mt-6 border-l border-[#8c734b] pl-4">
        {reading.map((line) => (
          <p key={line} className="max-w-3xl py-1.5 text-[15px] leading-7">
            {line}
          </p>
        ))}
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="问孪生席：上海的流失、高珠、客单价"
          aria-label="问孪生席"
          className="h-10 rounded-none bg-transparent"
        />
        <Button type="submit" className="h-10 rounded-none px-4">
          问
        </Button>
      </form>
      <div className="mt-2 flex flex-wrap gap-2">
        {["哪家流失升得最快", "转化掉在哪里", "全网客单价", "成都人流"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="border border-[#d9d1c3] px-2 py-1 text-[12px] text-[#3c342c] hover:bg-[#ebe4d6]"
            onClick={() => ask(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      {answer ? <p className="mt-3 max-w-3xl text-sm leading-7">{answer}</p> : null}

      <section className="mt-8" aria-label="当前范围">
        <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">
          {selected ? storeLabel(selected) : query.trim() || lens !== "all" ? `当前 ${visible.length} 家` : "五十家合计"}
        </p>
        <dl className="mt-3 grid grid-cols-2 border border-[#d9d1c3] md:grid-cols-5">
          <Metric
            label="到店人流"
            value={now.visitors.toLocaleString("zh-CN")}
            delta={pctDelta(now.visitors, then.visitors)}
          />
          <Metric label="成交额" value={twinYuan(now.sales)} delta={pctDelta(now.sales, then.sales)} />
          <Metric
            label="客单价"
            value={twinYuan(aov(shotOf(now)))}
            delta={pctDelta(aov(shotOf(now)), aov(shotOf(then)))}
          />
          <Metric
            label="转化率"
            value={formatRate(conversion(shotOf(now)))}
            delta={pctDelta(conversion(shotOf(now)), conversion(shotOf(then)))}
          />
          <Metric
            label="流失率"
            value={formatRate(now.churn)}
            delta={pctDelta(now.churn, then.churn)}
            invert
          />
        </dl>
      </section>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2" role="tablist" aria-label="门店筛选">
          {lenses.map((item) => (
            <Button
              key={item.id}
              role="tab"
              aria-selected={lens === item.id}
              variant={lens === item.id ? "default" : "outline"}
              className="h-9 rounded-none px-3"
              onClick={() => setLens(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="找城市或店名"
          aria-label="搜索门店"
          className="h-10 rounded-none bg-transparent md:w-56"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
        <div>
          <TwinMap
            visibleIds={visible.map((store) => store.id)}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <p className="mt-2 text-xs leading-5 text-[#6d645b]">
            金点是转化不低于上月同刻，赤点是低于。圆越大，到店越多。底图来自 OpenFreeMap。
          </p>
        </div>
        <div className="max-h-[560px] overflow-y-auto border border-[#d9d1c3]">
          {visible.length === 0 ? (
            <p className="px-4 py-8 text-sm leading-7 text-[#6d645b]">没有店落在这个条件里。</p>
          ) : (
            <ul>
              {visible.map((store) => {
                const active = store.id === selectedId;
                return (
                  <li key={store.id} className="border-b border-[#d9d1c3] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setSelectedId(active ? null : store.id)}
                      className={active ? "w-full bg-[#ebe4d6] px-3 py-3 text-left" : "w-full px-3 py-3 text-left hover:bg-[#ebe4d6]/60"}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-serif text-lg">{storeLabel(store)}</span>
                        <span className="text-[11px] text-[#6d645b]">{store.tier}</span>
                      </span>
                      <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-[#3c342c]">
                        <span>{store.now.visitors} 人</span>
                        <span>转化 {formatRate(conversion(store.now))}</span>
                        <span>客单 {twinYuan(aov(store.now))}</span>
                      </span>
                      <span className="mt-1 block text-xs text-[#6d645b]">
                        转化环比 {formatPct(pctDelta(conversion(store.now), conversion(store.then)))}
                        <span className="px-1">·</span>
                        流失 {formatRate(store.now.churn)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-medium">类别成交额</h2>
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.category} className="grid grid-cols-[4rem_1fr_auto] items-center gap-3">
              <span className="text-sm">{row.category}</span>
              <span className="relative h-2 bg-[#ebe4d6]">
                <span
                  className="absolute inset-y-0 left-0 bg-[#1c1915]"
                  style={{ width: `${Math.max(4, (row.sales / maxCategory) * 100)}%` }}
                />
              </span>
              <span className="text-right text-xs text-[#3c342c]">
                {twinYuan(row.sales)}
                <span className="ml-2 text-[#6d645b]">{formatPct(row.delta)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function shotOf(roll: ReturnType<typeof rollup>) {
  return {
    visitors: roll.visitors,
    buyers: roll.buyers,
    sales: roll.sales,
    churn: roll.churn,
    byCategory: roll.byCategory,
  };
}

function Metric({
  label,
  value,
  delta,
  invert = false,
}: {
  label: string;
  value: string;
  delta: number | null;
  invert?: boolean;
}) {
  const good = delta !== null && (invert ? delta < 0 : delta > 0);
  const bad = delta !== null && (invert ? delta > 0 : delta < 0);
  return (
    <div className="border-[#d9d1c3] px-4 py-4 not-first:border-t md:not-first:border-t-0 md:not-first:border-l">
      <dt className="text-[11px] tracking-[0.14em] text-[#6d645b]">{label}</dt>
      <dd className="mt-2 font-display text-3xl tracking-wide">{value}</dd>
      <p className={good ? "mt-1 text-xs text-[#8c734b]" : bad ? "mt-1 text-xs text-[#8c3a32]" : "mt-1 text-xs text-[#6d645b]"}>
        环比 {formatPct(delta)}
      </p>
    </div>
  );
}

function TwinMap({
  visibleIds,
  selectedId,
  onSelect,
}: {
  visibleIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [failed, setFailed] = useState(false);
  const onSelectRef = useRef(onSelect);
  const dataRef = useRef(geojson(visibleIds, selectedId));

  useEffect(() => {
    onSelectRef.current = onSelect;
    const data = geojson(visibleIds, selectedId);
    dataRef.current = data;
    const source = mapRef.current?.getSource("stores");
    if (source?.type === "geojson") (source as GeoJSONSource).setData(data);
  }, [onSelect, selectedId, visibleIds]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;

    void (async () => {
      const maplibregl = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled || !ref.current) return;
      maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
      const map = new maplibregl.Map({
        container: ref.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [112, 33],
        zoom: 3.2,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.on("load", () => {
        const bounds = new maplibregl.LngLatBounds();
        for (const store of stores) bounds.extend([store.lng, store.lat]);
        map.fitBounds(bounds, { padding: 36, maxZoom: 5, duration: 0 });
        map.addSource("stores", { type: "geojson", data: dataRef.current });
        map.addLayer({
          id: "stores",
          type: "circle",
          source: "stores",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "visitors"], 8, 6, 160, 18],
            "circle-color": ["case", ["==", ["get", "down"], 1], "#8c3a32", "#8c734b"],
            "circle-opacity": ["case", ["==", ["get", "dimmed"], 1], 0.28, 0.92],
            "circle-stroke-width": ["case", ["==", ["get", "selected"], 1], 2.5, 1],
            "circle-stroke-color": "#1c1915",
          },
        });
        map.on("click", "stores", (event) => {
          const id = event.features?.[0]?.properties?.id;
          if (typeof id === "string") onSelectRef.current(id);
        });
        map.on("mouseenter", "stores", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "stores", () => {
          map.getCanvas().style.cursor = "";
        });
      });
      map.on("error", () => {
        if (!map.isStyleLoaded()) setFailed(true);
      });
    })().catch(() => setFailed(true));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-[420px] border border-[#d9d1c3] bg-[#ebe4d6] md:h-[560px]">
      <div ref={ref} className="h-full w-full" />
      {failed ? (
        <p className="absolute inset-x-4 bottom-4 bg-[#f7f4ee] px-3 py-2 text-sm leading-6 text-[#3c342c]">
          地图没有载入。右边的店和上面的数字仍然可以看。
        </p>
      ) : null}
    </div>
  );
}

function geojson(visibleIds: string[], selectedId: string | null) {
  const visible = new Set(visibleIds);
  return {
    type: "FeatureCollection" as const,
    features: stores.map((store) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [store.lng, store.lat] },
      properties: {
        id: store.id,
        visitors: store.now.visitors,
        down: (pctDelta(conversion(store.now), conversion(store.then)) ?? 0) < 0 ? 1 : 0,
        dimmed: visible.has(store.id) ? 0 : 1,
        selected: store.id === selectedId ? 1 : 0,
      },
    })),
  };
}
