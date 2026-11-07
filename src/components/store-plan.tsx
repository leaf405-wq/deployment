"use client";

import { useState } from "react";
import { SHOP_PLATE, type FloorTwin, type FloorZone } from "@/lib/floor";
import { aov, formatRate, storeLabel, twinYuan, type StoreTwin } from "@/lib/twin";

const PLAN_SPAN: Record<StoreTwin["tier"], string> = {
  旗舰: "柜位大约 18 × 14 米",
  专卖: "柜位大约 12 × 10 米",
  预约室: "柜位大约 8 × 7 米",
};

export function StorePlan({ floor, store, stamp }: { floor: FloorTwin; store: StoreTwin; stamp: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const people = zonePeople(
    floor.zones.map((zone) => zone.dwellShare),
    store.now.visitors,
  );
  const hottest = [...floor.zones].sort((a, b) => b.dwellShare - a.dwellShare)[0];
  const active = floor.zones.find((zone) => zone.id === hover) ?? floor.zones.find((zone) => zone.id === pinned) ?? hottest;
  const activePeople = active ? people[floor.zones.findIndex((zone) => zone.id === active.id)] : 0;

  return (
    <div>
      <div className="relative border border-[#1c1915] bg-[#ebe4d6]">
        <PlanDrawing floor={floor} activeId={active?.id ?? null} />
        <div className="absolute inset-0">
          {floor.zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              data-zone={zone.id}
              aria-pressed={pinned === zone.id}
              aria-label={`${zone.label}，这一分钟停留 ${people[floor.zones.findIndex((item) => item.id === zone.id)]} 人`}
              className={
                active?.id === zone.id
                  ? "absolute cursor-pointer border border-[#1c1915] bg-[#8c734b]/15"
                  : "absolute cursor-pointer border border-transparent hover:bg-[#f7f4ee]/25"
              }
              style={{
                left: `${zone.x}%`,
                top: `${(zone.y / 80) * 100}%`,
                width: `${zone.w}%`,
                height: `${(zone.h / 80) * 100}%`,
              }}
              onMouseEnter={() => setHover(zone.id)}
              onMouseLeave={() => setHover((current) => (current === zone.id ? null : current))}
              onFocus={() => setPinned(zone.id)}
              onClick={() => setPinned((current) => (current === zone.id ? null : zone.id))}
            />
          ))}
        </div>
        {hover || pinned ? active && <ZoneChip zone={active} people={activePeople} /> : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-[#6d645b]">
        {PLAN_SPAN[store.tier]}。通道在上。把鼠标放在柜位上，看这一分钟的停留。点一下可以钉住。{storeLabel(store)} · {stamp}
      </p>
      {active ? <ZoneCard zone={active} people={activePeople} floor={floor} store={store} stamp={stamp} /> : null}
    </div>
  );
}

function PlanDrawing({ floor, activeId }: { floor: FloorTwin; activeId: string | null }) {
  const rows = floor.heat.length;
  const cols = floor.heat[0]?.length ?? 1;
  const cellW = 100 / cols;
  const cellH = 80 / rows;

  return (
    <svg viewBox="0 0 100 80" className="block h-auto w-full font-sans" role="img" aria-hidden="true">
      <defs>
        <filter id="floor-heat" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="1.05" />
        </filter>
        <clipPath id="floor-plate">
          <rect x={SHOP_PLATE.x} y={SHOP_PLATE.y} width={SHOP_PLATE.w} height={SHOP_PLATE.h} />
        </clipPath>
      </defs>
      <rect width="100" height="80" fill="#ebe4d6" />
      <g clipPath="url(#floor-plate)" filter="url(#floor-heat)">
        {floor.heat.map((row, y) =>
          row.map((value, x) => (
            <rect key={`${x}-${y}`} x={x * cellW} y={y * cellH} width={cellW + 0.12} height={cellH + 0.12} fill={heatFill(value)} />
          )),
        )}
      </g>
      <rect x={SHOP_PLATE.x + 1.4} y={SHOP_PLATE.y + 1.6} width={SHOP_PLATE.w - 2.8} height={SHOP_PLATE.h - 2.8} fill="none" stroke="#8c734b" strokeWidth={0.18} />
      {floor.paths.map((path) => (
        <polyline
          key={path.id}
          points={path.points.map((point) => point.join(",")).join(" ")}
          fill="none"
          stroke="#1c1915"
          strokeWidth={0.28 + path.share * 0.9}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity={0.55}
        />
      ))}
      {floor.zones.map((zone) => (
        <Furnishing key={zone.id} zone={zone} active={zone.id === activeId} />
      ))}
      <rect x="6" y="7" width="34" height="1.15" fill="#1c1915" />
      <rect x="60" y="7" width="34" height="1.15" fill="#1c1915" />
      <rect x="6" y="73.9" width="88" height="1.15" fill="#1c1915" />
      <rect x="6" y="7" width="1.15" height="68" fill="#1c1915" />
      <rect x="92.85" y="7" width="1.15" height="68" fill="#1c1915" />
      <path d="M40 8.2 A7.2 7.2 0 0 0 47.2 15.2" fill="none" stroke="#1c1915" strokeWidth={0.25} />
      <text x="50" y="4.3" textAnchor="middle" fontSize="2.2" fill="#6d645b">
        廊前 · 经过 {floor.passers.toLocaleString("zh-CN")} 人
      </text>
    </svg>
  );
}

function Furnishing({ zone, active }: { zone: FloorZone; active: boolean }) {
  const { id, x, y, w, h, label } = zone;
  const stroke = active ? "#8c3a32" : "#1c1915";
  const inset = 1;
  const ix = x + inset;
  const iy = y + inset;
  const iw = Math.max(2, w - inset * 2);
  const ih = Math.max(2, h - inset * 2);
  return (
    <g>
      {id === "window" ? <WindowWall x={x} y={y} w={w} h={h} stroke={stroke} /> : null}
      {id === "door" ? <DoorMat x={x} y={y} w={w} h={h} stroke={stroke} /> : null}
      {id === "bags" || id === "table" ? <Island x={ix} y={iy} w={iw} h={ih} stroke={stroke} round={id === "table"} /> : null}
      {id === "silk" ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={iw / 2} ry={ih / 2} fill="#f7f4ee" fillOpacity={0.88} stroke={stroke} strokeWidth={0.3} /> : null}
      {id === "small" || id === "strap" || id === "till" ? <Vitrine x={ix} y={iy} w={iw} h={ih} stroke={stroke} shelves={id === "till" ? 1 : 3} /> : null}
      {id === "jewelry" ? <JewelCase x={ix} y={iy} w={iw} h={ih} stroke={stroke} /> : null}
      {id === "try" ? <TryTable x={x} y={y} w={w} h={h} stroke={stroke} /> : null}
      {id === "sofa" || id === "hall" ? <Sofa x={ix} y={iy} w={iw} h={ih} stroke={stroke} /> : null}
      <text x={x + w / 2} y={y + h / 2 + 0.8} textAnchor="middle" fontSize="2.35" fill="#1c1915">
        {label}
      </text>
    </g>
  );
}

function WindowWall({ x, y, w, h, stroke }: Box) {
  const bars = 7;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f7f4ee" fillOpacity={0.35} stroke={stroke} strokeWidth={0.3} />
      {Array.from({ length: bars }, (_, index) => (
        <line key={index} x1={x + ((index + 1) * w) / (bars + 1)} y1={y} x2={x + ((index + 1) * w) / (bars + 1)} y2={y + h} stroke={stroke} strokeWidth={0.18} />
      ))}
    </g>
  );
}

function DoorMat({ x, y, w, h, stroke }: Box) {
  return <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="none" stroke={stroke} strokeWidth={0.25} strokeDasharray="0.8 0.6" />;
}

function Island({ x, y, w, h, stroke, round }: Box & { round: boolean }) {
  return (
    <g>
      {round ? (
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="#f7f4ee" fillOpacity={0.9} stroke={stroke} strokeWidth={0.35} />
      ) : (
        <rect x={x} y={y} width={w} height={h} fill="#f7f4ee" fillOpacity={0.9} stroke={stroke} strokeWidth={0.35} />
      )}
      <rect x={x + 1.1} y={y + 1.1} width={Math.max(1, w - 2.2)} height={Math.max(1, h - 2.2)} fill="none" stroke="#8c734b" strokeWidth={0.18} />
    </g>
  );
}

function Vitrine({ x, y, w, h, stroke, shelves }: Box & { shelves: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f7f4ee" fillOpacity={0.9} stroke={stroke} strokeWidth={0.32} />
      {Array.from({ length: shelves }, (_, index) => (
        <line key={index} x1={x + 0.6} x2={x + w - 0.6} y1={y + ((index + 1) * h) / (shelves + 1)} y2={y + ((index + 1) * h) / (shelves + 1)} stroke={stroke} strokeWidth={0.15} />
      ))}
    </g>
  );
}

function JewelCase({ x, y, w, h, stroke }: Box) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f7f4ee" fillOpacity={0.92} stroke={stroke} strokeWidth={0.4} />
      <rect x={x + 1} y={y + 1} width={Math.max(1, w - 2)} height={Math.max(1, h - 2)} fill="none" stroke={stroke} strokeWidth={0.2} />
      <circle cx={x + w - 1.6} cy={y + h / 2} r={0.45} fill={stroke} />
    </g>
  );
}

function TryTable({ x, y, w, h, stroke }: Box) {
  return (
    <g>
      <rect x={x + 1} y={y + h * 0.35} width={w * 0.42} height={h * 0.5} fill="#f7f4ee" fillOpacity={0.9} stroke={stroke} strokeWidth={0.25} />
      <rect x={x + w * 0.55} y={y + h * 0.35} width={w * 0.38} height={h * 0.5} fill="#f7f4ee" fillOpacity={0.9} stroke={stroke} strokeWidth={0.25} />
      <circle cx={x + w / 2} cy={y + h * 0.28} r={Math.min(w, h) * 0.16} fill="#f7f4ee" stroke={stroke} strokeWidth={0.25} />
    </g>
  );
}

function Sofa({ x, y, w, h, stroke }: Box) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1.1} fill="#f7f4ee" fillOpacity={0.92} stroke={stroke} strokeWidth={0.32} />
      <line x1={x + w / 2} y1={y + 0.6} x2={x + w / 2} y2={y + h - 0.6} stroke={stroke} strokeWidth={0.15} />
    </g>
  );
}

function ZoneChip({ zone, people }: { zone: FloorZone; people: number }) {
  const below = zone.y < 48;
  return (
    <div
      className="pointer-events-none absolute z-10 border border-[#1c1915] bg-[#f7f4ee] px-2 py-1"
      style={{
        left: `${zone.x + zone.w / 2}%`,
        top: `${((below ? zone.y + zone.h : zone.y) / 80) * 100}%`,
        transform: below ? "translate(-50%, 0.35rem)" : "translate(-50%, calc(-100% - 0.35rem))",
      }}
    >
      <p className="text-[11px] leading-4 text-[#1c1915]">
        {zone.label} · {people} 人
      </p>
    </div>
  );
}

function ZoneCard({
  zone,
  people,
  floor,
  store,
  stamp,
}: {
  zone: FloorZone;
  people: number;
  floor: FloorTwin;
  store: StoreTwin;
  stamp: string;
}) {
  const piece = zone.category ? floor.pieces.find((item) => item.category === zone.category) : null;
  const routes = floor.paths.filter((path) => path.points.some(([px, py]) => px >= zone.x && px <= zone.x + zone.w && py >= zone.y && py <= zone.y + zone.h));
  return (
    <div data-zone-card className="mt-3 border border-[#1c1915] bg-[#f7f4ee] px-4 py-3">
      <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">
        {stamp} · {zone.label}
      </p>
      <p className="mt-2 font-display text-4xl tracking-wide">{people} 人</p>
      <p className="mt-1 text-sm leading-6 text-[#3c342c]">这一分钟停在这里，占店内停留 {formatRate(zone.dwellShare)}。</p>
      {piece ? (
        <p className="text-sm leading-6">
          {piece.category}成交 {twinYuan(piece.sales)}，{piece.units} 件。
        </p>
      ) : (
        <p className="text-sm leading-6">这里不直接出货，人停一下再往柜走。</p>
      )}
      {routes.length > 0 ? (
        <p className="text-sm leading-6 text-[#3c342c]">经过的路线：{routes.map((path) => `${path.name} ${path.meters.toFixed(1)} 米`).join("，")}。</p>
      ) : null}
      <p className="mt-1 text-xs leading-5 text-[#6d645b]">
        全店进店 {store.now.visitors.toLocaleString("zh-CN")} 人，进店占比 {formatRate(floor.capture)}，客单价 {twinYuan(aov(store.now))}，客单量 {(floor.units / store.now.buyers).toFixed(2)} 件。
      </p>
    </div>
  );
}

type Box = { x: number; y: number; w: number; h: number; stroke: string };

function zonePeople(weights: number[], total: number) {
  if (total <= 0) return weights.map(() => 0);
  const sum = weights.reduce((acc, weight) => acc + weight, 0) || 1;
  const raw = weights.map((weight) => (total * weight) / sum);
  const base = raw.map((value) => Math.floor(value));
  let left = total - base.reduce((acc, value) => acc + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  while (left > 0) {
    for (const item of order) {
      if (left === 0) break;
      base[item.index] += 1;
      left -= 1;
    }
  }
  return base;
}

function heatFill(value: number) {
  const eased = Math.pow(Math.min(1, Math.max(0, value)), 0.7);
  const ivory = [246, 241, 231];
  const gold = [176, 136, 74];
  const ink = [72, 40, 28];
  const [from, to, t] = eased < 0.58 ? [ivory, gold, eased / 0.58] : [gold, ink, (eased - 0.58) / 0.42];
  const rgb = from.map((channel, index) => Math.round(channel + (to[index] - channel) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
