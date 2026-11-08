"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/lib/maison";
import { formatRate, storeLabel, twinYuan, type StoreTwin } from "@/lib/twin";
import {
  buildVirtual,
  editionScript,
  guideLines,
  type Advisor,
  type Device,
  type DisplayPlan,
  type EditionPiece,
  type Fixture,
  type RoomId,
  type SeatGuest,
  type Station,
  type VirtualScene,
} from "@/lib/virtual";
import { cn } from "cn";

const ROOMS: { id: RoomId; index: string; label: string }[] = [
  { id: "experience", index: "壹", label: "客户体验" },
  { id: "operations", index: "贰", label: "门店运营" },
  { id: "merch", index: "叁", label: "商品与陈列" },
  { id: "brand", index: "肆", label: "品牌内容" },
];

const FEATURES: Record<RoomId, { id: string; label: string }[]> = {
  experience: [
    { id: "store", label: "虚拟门店" },
    { id: "guide", label: "远程导购" },
    { id: "turn", label: "产品转台" },
    { id: "try", label: "虚拟试戴" },
    { id: "culture", label: "文化展陈" },
  ],
  operations: [
    { id: "heat", label: "客流热力" },
    { id: "path", label: "动线" },
    { id: "ba", label: "顾问效率" },
    { id: "queue", label: "排队接待" },
    { id: "device", label: "安防设备" },
  ],
  merch: [
    { id: "stock", label: "缺货" },
    { id: "comply", label: "陈列合规" },
    { id: "inventory", label: "库存" },
    { id: "ab", label: "方案对照" },
  ],
  brand: [
    { id: "tour", label: "数字巡展" },
    { id: "launch", label: "新品发布" },
    { id: "craft", label: "工艺故事" },
    { id: "limited", label: "限量沉浸" },
  ],
};

const TRY_ON = [
  { id: "quiet-water", slot: "肩" },
  { id: "path-silk", slot: "颈" },
  { id: "holly", slot: "耳" },
  { id: "night-voyage", slot: "指" },
  { id: "traveler", slot: "腕" },
  { id: "old-letter", slot: "手" },
];

export function VirtualAtelier({
  store,
  list,
  minuteKey,
  stamp,
}: {
  store: StoreTwin;
  list: StoreTwin[];
  minuteKey: string;
  stamp: string;
}) {
  const scene = useMemo(() => buildVirtual(store, list, minuteKey), [store, list, minuteKey]);

  return (
    <section id="virtual" className="mt-14 scroll-mt-28" aria-labelledby="virtual-title">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">虚拟 · 四间</p>
      <h2 id="virtual-title" className="mt-3 font-serif text-[1.8rem] leading-tight font-medium md:text-4xl">
        {storeLabel(store)}可以走进去
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        这一分钟 {stamp}。线上的门、远程的席、转台、样衣、巡展和柜面，都跟着这家店的同一只钟。样本推演，不接摄像头，不改库房。
      </p>
      <div className="mt-4 border-l border-[#8c734b] pl-4">
        {scene.reading.map((line) => (
          <p key={line} className="max-w-3xl py-1 text-[15px] leading-7">
            {line}
          </p>
        ))}
      </div>
      <VirtualDesk key={store.id} scene={scene} store={store} />
    </section>
  );
}

function VirtualDesk({ scene, store }: { scene: VirtualScene; store: StoreTwin }) {
  const [room, setRoom] = useState<RoomId>("experience");
  const [feature, setFeature] = useState<Record<RoomId, string>>({
    experience: "store",
    operations: "heat",
    merch: "stock",
    brand: "tour",
  });
  const [walk, setWalk] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [pieceId, setPieceId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [angle, setAngle] = useState(32);
  const [worn, setWorn] = useState<string[]>([]);
  const [exhibitId, setExhibitId] = useState<string | null>(null);
  const [pathId, setPathId] = useState<string | null>(null);
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const [fixtureId, setFixtureId] = useState<string | null>(null);
  const [adopted, setAdopted] = useState<"A" | "B">("A");
  const [stopCity, setStopCity] = useState<string | null>(null);
  const [craftId, setCraftId] = useState<string | null>(null);
  const [serial, setSerial] = useState<string | null>(null);
  const [beat, setBeat] = useState(0);

  const current = feature[room];
  const station = scene.stations.find((item) => item.id === walk) ?? busiest(scene.stations);
  const guest = scene.guests.find((item) => item.id === guestId) ?? scene.guests[0];
  const piece = products.find((item) => item.id === (pieceId ?? scene.featuredId)) ?? products[0];
  const exhibit = scene.exhibits.find((item) => item.id === (exhibitId ?? scene.exhibitNow)) ?? scene.exhibits[0];
  const path = scene.paths.find((item) => item.id === pathId) ?? scene.paths[0];
  const advisor = scene.advisors.find((item) => item.id === advisorId) ?? ranked(scene.advisors)[0];
  const fixture = scene.fixtures.find((item) => item.id === fixtureId) ?? scene.fixtures.find((item) => item.onHand === 0) ?? scene.fixtures[0];
  const stop = scene.tour.find((item) => item.city === stopCity) ?? scene.tour.find((item) => item.status === "在展") ?? scene.tour[0];
  const craft = products.find((item) => item.id === (craftId ?? scene.featuredId)) ?? products[0];
  const edition = scene.editions.find((item) => item.serial === serial) ?? scene.editions.find((item) => item.storeId === store.id) ?? scene.editions[0];

  return (
    <>
      <div className="sticky top-[92px] z-20 mt-6 flex gap-2 overflow-x-auto bg-[#f3efe6]/95 py-2 md:top-0" role="tablist" aria-label="虚拟四间">
        {ROOMS.map((item) => (
          <Button
            key={item.id}
            role="tab"
            aria-selected={room === item.id}
            variant={room === item.id ? "default" : "outline"}
            className="h-10 shrink-0 rounded-none px-3"
            onClick={() => setRoom(item.id)}
          >
            <span className="mr-2 font-display text-[11px] tracking-[0.16em]">{item.index}</span>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto" role="tablist" aria-label={ROOMS.find((item) => item.id === room)?.label}>
        {FEATURES[room].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={current === item.id}
            data-feature={item.id}
            className={cn(
              "shrink-0 border px-3 py-2 text-[13px]",
              current === item.id ? "border-[#1c1915] bg-[#1c1915] text-[#f3efe6]" : "border-[#d9d1c3] text-[#3c342c] hover:bg-[#ebe4d6]",
            )}
            onClick={() => setFeature((prev) => ({ ...prev, [room]: item.id }))}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4" data-virtual-room={room} data-virtual-feature={current}>
        {room === "experience" && current === "store" ? <VirtualStore scene={scene} station={station} onWalk={setWalk} /> : null}
        {room === "experience" && current === "guide" ? (
          <RemoteGuide
            scene={scene}
            guest={guest}
            piece={piece}
            connected={connected}
            onGuest={(id) => {
              setGuestId(id);
              setConnected(false);
            }}
            onPiece={(id) => {
              setPieceId(id);
              setConnected(false);
            }}
            onToggle={() => setConnected((value) => !value)}
          />
        ) : null}
        {room === "experience" && current === "turn" ? (
          <Turntable
            piece={piece}
            angle={angle}
            onAngle={setAngle}
            onPiece={(id) => setPieceId(id)}
          />
        ) : null}
        {room === "experience" && current === "try" ? (
          <TryOn worn={worn} onToggle={(id) => setWorn((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))} />
        ) : null}
        {room === "experience" && current === "culture" ? (
          <Culture scene={scene} exhibitId={exhibit.id} onOpen={setExhibitId} />
        ) : null}
        {room === "operations" && current === "heat" ? <HeatMap scene={scene} station={station} onPick={setWalk} /> : null}
        {room === "operations" && current === "path" ? <Paths scene={scene} pathId={path?.id ?? null} onPick={setPathId} /> : null}
        {room === "operations" && current === "ba" ? <Advisors advisors={scene.advisors} activeId={advisor?.id ?? null} onPick={setAdvisorId} /> : null}
        {room === "operations" && current === "queue" ? <QueueDesk scene={scene} /> : null}
        {room === "operations" && current === "device" ? (
          <Devices devices={scene.devices} activeId={deviceId} onlyWatch={onlyWatch} onFilter={setOnlyWatch} onPick={setDeviceId} />
        ) : null}
        {room === "merch" && current === "stock" ? <Stockouts fixtures={scene.fixtures} activeId={fixture?.id ?? null} onPick={setFixtureId} /> : null}
        {room === "merch" && current === "comply" ? <Compliance fixtures={scene.fixtures} /> : null}
        {room === "merch" && current === "inventory" ? <Inventory fixtures={scene.fixtures} activeId={fixture?.id ?? null} onPick={setFixtureId} /> : null}
        {room === "merch" && current === "ab" ? <Plans plans={scene.plans} adopted={adopted} onAdopt={setAdopted} /> : null}
        {room === "brand" && current === "tour" ? <Tour scene={scene} city={stop?.city ?? null} onPick={setStopCity} /> : null}
        {room === "brand" && current === "launch" ? <Launch scene={scene} store={store} /> : null}
        {room === "brand" && current === "craft" ? <Craft activeId={craft.id} onPick={setCraftId} /> : null}
        {room === "brand" && current === "limited" ? (
          <Limited edition={edition} beat={beat} editions={scene.editions} onPick={(next) => { setSerial(next); setBeat(0); }} onBeat={setBeat} />
        ) : null}
      </div>
    </>
  );
}

function busiest(stations: Station[]) {
  return stations.reduce((best, station) => (station.people > best.people ? station : best));
}

function ranked(advisors: Advisor[]) {
  return [...advisors].sort((a, b) => b.converted / Math.max(1, b.served) - a.converted / Math.max(1, a.served));
}

function VirtualStore({ scene, station, onWalk }: { scene: VirtualScene; station: Station; onWalk: (id: string) => void }) {
  const max = Math.max(...scene.stations.map((item) => item.people), 1);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_18rem]">
      <div>
        <Plate stations={scene.stations} activeId={station.id} max={max} onPick={onWalk} dark />
        <p className="mt-2 text-xs leading-5 text-[#6d645b]">点一个区域，人就走到那里。颜色越亮，这一分钟停的人越多。</p>
      </div>
      <aside className="border border-[#d9d1c3] px-4 py-4">
        <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">你在这里</p>
        <h3 className="mt-2 font-serif text-2xl">{station.label}</h3>
        <p className="mt-3 text-sm leading-7">{station.line}</p>
        <p className="mt-4 text-xs text-[#6d645b]">{station.category ? station.category : "不设陈列"} · {station.people} 人</p>
      </aside>
    </div>
  );
}

function Plate({
  stations,
  activeId,
  max,
  onPick,
  dark,
}: {
  stations: Station[];
  activeId: string;
  max: number;
  onPick: (id: string) => void;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "relative h-[420px] border border-[#1c1915] bg-[#161411]" : "relative h-[420px] border border-[#1c1915] bg-[#ebe4d6]"}>
      {stations.map((station) => {
        const heat = 0.16 + (station.people / max) * 0.78;
        return (
          <button
            key={station.id}
            type="button"
            data-zone={station.id}
            aria-pressed={activeId === station.id}
            aria-label={`${station.label}，${station.people} 人`}
            className={cn("absolute text-left", activeId === station.id ? "ring-1 ring-[#e4d3a8]" : "")}
            style={{
              left: `${station.x}%`,
              top: `${(station.y / 80) * 100}%`,
              width: `${station.w}%`,
              height: `${(station.h / 80) * 100}%`,
              background: dark ? `rgba(228, 211, 168, ${heat})` : `rgba(140, 58, 50, ${heat * 0.72})`,
            }}
            onClick={() => onPick(station.id)}
          >
            <span className={cn("block px-1 pt-1 text-[11px]", dark ? "text-[#161411]" : "text-[#1c1915]")}>
              {station.label}
              <span className="block">{station.people}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RemoteGuide({
  scene,
  guest,
  piece,
  connected,
  onGuest,
  onPiece,
  onToggle,
}: {
  scene: VirtualScene;
  guest: SeatGuest;
  piece: Product;
  connected: boolean;
  onGuest: (id: string) => void;
  onPiece: (id: string) => void;
  onToggle: () => void;
}) {
  const lines = guideLines(guest, piece);
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="border border-[#d9d1c3]">
        <p className="border-b border-[#d9d1c3] px-3 py-2 text-[11px] tracking-[0.16em] text-[#6d645b]">名册</p>
        <ul>
          {scene.guests.map((item) => (
            <li key={item.id} className="border-b border-[#d9d1c3] last:border-b-0">
              <button
                type="button"
                className={cn("w-full px-3 py-3 text-left", item.id === guest.id ? "bg-[#ebe4d6]" : "hover:bg-[#ebe4d6]/60")}
                onClick={() => onGuest(item.id)}
              >
                <span className="font-serif text-lg">{item.name}</span>
                <span className="mt-1 block text-xs text-[#6d645b]">
                  {item.tier}
                  <span className="px-1">·</span>
                  {item.sameHouse ? "约在这家" : "同城，未必约在这家"}
                  <span className="px-1">·</span>
                  {item.remote}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className={cn("border px-4 py-4", guest.remote === "只看实物" ? "border-[#8c734b] bg-[#f7f1e4]" : "border-[#d9d1c3]")}>
          <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">先读不要</p>
          <p className="mt-2 text-sm leading-7">
            {guest.avoid.length ? guest.avoid.join("、") : "名册里没有写下要避开的说法。"}
          </p>
          <p className="mt-2 text-sm leading-7 text-[#3c342c]">{guest.notes}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {products.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === piece.id}
              className={cn(
                "border px-3 py-2 text-[13px]",
                item.id === piece.id ? "border-[#1c1915] bg-[#1c1915] text-[#f3efe6]" : "border-[#d9d1c3]",
              )}
              onClick={() => onPiece(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-3 border border-[#161411] bg-[#161411] px-4 py-4 text-[#f3efe6]">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-xl tracking-wide">{connected ? "已接通" : "未接通"}</p>
            <Button type="button" variant="secondary" className="h-9 rounded-none" onClick={onToggle}>
              {connected ? "挂断" : "接通"}
            </Button>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#c8b48a]">
            {guest.remote === "只看实物" ? "这一位只看实物。镜头保持关闭。" : "画面只在这台浏览器里。不会真正拨出。"}
          </p>
          {connected ? (
            <ol className="mt-4 space-y-3">
              {lines.map((turn, index) => (
                <li key={`${turn.speaker}-${index}`} className="text-sm leading-7">
                  <span className="text-[#c8b48a]">{turn.speaker}</span>
                  <span className="px-2 text-[#8c734b]">/</span>
                  {turn.text}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[#d9d0c4]">接通之后，顾问按这只单品和名册里的禁忌说话。</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Turntable({
  piece,
  angle,
  onAngle,
  onPiece,
}: {
  piece: Product;
  angle: number;
  onAngle: (angle: number) => void;
  onPiece: (id: string) => void;
}) {
  const drag = useRef<{ x: number; angle: number } | null>(null);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_18rem]">
      <div>
        <div
          role="application"
          aria-label={`${piece.name}转台，左右方向键转动`}
          tabIndex={0}
          className="grid h-[420px] cursor-grab place-items-center bg-[#161411] outline-none active:cursor-grabbing"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, angle };
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            onAngle(drag.current.angle + (event.clientX - drag.current.x) * 0.6);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") onAngle(angle - 24);
            if (event.key === "ArrowRight") onAngle(angle + 24);
          }}
        >
          <div style={{ transform: `rotateX(10deg) rotateY(${angle}deg)`, transformStyle: "preserve-3d" }}>
            <PieceShape product={piece} />
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" className="h-9 rounded-none" onClick={() => onAngle(angle - 45)}>
            左转
          </Button>
          <Button type="button" variant="outline" className="h-9 rounded-none" onClick={() => onAngle(angle + 45)}>
            右转
          </Button>
        </div>
      </div>
      <aside>
        <div className="flex flex-wrap gap-2">
          {products.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === piece.id}
              className={cn("border px-3 py-2 text-[13px]", item.id === piece.id ? "border-[#1c1915] bg-[#1c1915] text-[#f3efe6]" : "border-[#d9d1c3]")}
              onClick={() => onPiece(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <h3 className="mt-4 font-serif text-3xl">{piece.name}</h3>
        <p className="mt-2 text-sm text-[#6d645b]">{piece.family} · {twinYuan(piece.price)}</p>
        <p className="mt-3 text-sm leading-7">{piece.material}</p>
        <p className="mt-2 text-sm leading-7">{piece.craft}</p>
        <p className="mt-3 text-sm leading-7 text-[#8c734b]">{piece.publicLine}</p>
      </aside>
    </div>
  );
}

function PieceShape({ product }: { product: Product }) {
  if (product.family === "戒指") {
    return (
      <div style={{ width: 168, height: 168, transform: "rotateX(54deg)", transformStyle: "preserve-3d" }}>
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: "50%",
            border: "22px solid #e4d3a8",
            boxShadow: "0 16px 0 #6e5834, inset 0 0 0 10px #14110e",
            background: "radial-gradient(circle at 50% 46%, #7eb0d4 0 10px, #143e78 11px 22px, transparent 23px)",
          }}
        />
      </div>
    );
  }
  if (product.family === "丝巾") {
    return (
      <div
        style={{
          width: 168,
          height: 96,
          transform: "rotateX(62deg)",
          background: "repeating-linear-gradient(128deg, #d9c7a4 0 10px, #8c734b 10px 12px)",
          border: "1px solid #e4d3a8",
        }}
      />
    );
  }
  if (product.family === "耳坠") {
    return (
      <div style={{ width: 120, height: 150, position: "relative", transformStyle: "preserve-3d" }}>
        <Drop style={{ left: 8, transform: "translateZ(20px)" }} />
        <Drop style={{ right: 8, transform: "translateZ(-20px)" }} />
      </div>
    );
  }
  if (product.family === "表带") {
    return <Solid w={48} h={150} d={18} front="#3c342c" side="#241e18" top="#8c734b" label="" light />;
  }
  if (product.family === "小皮具") {
    return <Solid w={120} h={78} d={16} front="#c4b49a" side="#8c734b" top="#e4d3a8" label="内里" />;
  }
  return <Solid w={118} h={96} d={64} front="#c4b49a" side="#8c734b" top="#e7d7b4" label="静水" />;
}

function Drop({ style }: { style: CSSProperties }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 18,
        width: 36,
        height: 92,
        borderRadius: "40% 40% 46% 46%",
        background: "radial-gradient(circle at 40% 30%, #efe6d4, #1c6b45 42%, #10281c 78%)",
        ...style,
      }}
    />
  );
}

function Solid({
  w,
  h,
  d,
  front,
  side,
  top,
  label,
  light,
}: {
  w: number;
  h: number;
  d: number;
  front: string;
  side: string;
  top: string;
  label: string;
  light?: boolean;
}) {
  const face = (width: number, height: number, background: string, transform: string, extra?: CSSProperties): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width,
    height,
    marginLeft: -width / 2,
    marginTop: -height / 2,
    display: "flex",
    alignItems: "flex-end",
    padding: 8,
    border: "1px solid rgba(228,211,168,0.45)",
    background,
    transform,
    backfaceVisibility: "hidden",
    color: light ? "#e4d3a8" : "#1c1915",
    fontFamily: "var(--font-serif), serif",
    ...extra,
  });
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      <div style={face(w, h, front, `translateZ(${d / 2}px)`)}>{label}</div>
      <div style={face(w, h, front, `rotateY(180deg) translateZ(${d / 2}px)`, { filter: "brightness(0.7)" })} />
      <div style={face(d, h, side, `rotateY(90deg) translateZ(${w / 2}px)`)} />
      <div style={face(d, h, side, `rotateY(-90deg) translateZ(${w / 2}px)`, { filter: "brightness(0.85)" })} />
      <div style={face(w, d, top, `rotateX(90deg) translateZ(${h / 2}px)`)} />
      <div style={face(w, d, "#241e18", `rotateX(-90deg) translateZ(${h / 2}px)`)} />
    </div>
  );
}

function TryOn({ worn, onToggle }: { worn: string[]; onToggle: (id: string) => void }) {
  const holly = worn.includes("holly");
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="border border-[#d9d1c3] bg-[#f7f4ee] px-4 py-4">
        <Croquis worn={new Set(worn)} />
      </div>
      <div>
        <p className="max-w-xl text-sm leading-7 text-[#3c342c]">样衣台只用图样。不打开摄像头，也不出佩戴视频。</p>
        <ul className="mt-4 divide-y divide-[#d9d1c3] border border-[#d9d1c3]">
          {TRY_ON.map((item) => {
            const product = products.find((entry) => entry.id === item.id);
            if (!product) return null;
            const on = worn.includes(item.id);
            return (
              <li key={item.id}>
                <button type="button" aria-pressed={on} className="flex w-full items-baseline justify-between gap-3 px-3 py-3 text-left hover:bg-[#ebe4d6]" onClick={() => onToggle(item.id)}>
                  <span>
                    <span className="font-serif text-xl">{product.name}</span>
                    <span className="mt-1 block text-xs text-[#6d645b]">{item.slot} · {product.wear}</span>
                  </span>
                  <span className="text-[13px]">{on ? "取下" : "放上"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {holly ? <p className="mt-3 text-sm leading-7 text-[#8c734b]">冬青不拍佩戴。图样可以留，影像不要出。</p> : null}
      </div>
    </div>
  );
}

function Croquis({ worn }: { worn: Set<string> }) {
  return (
    <svg viewBox="0 0 220 460" className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label="样衣图样">
      <ellipse cx="110" cy="52" rx="28" ry="34" fill="#f7f4ee" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M110 86 V124" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M68 156 Q110 132 152 156 L160 258 Q110 276 60 258 Z" fill="#f7f4ee" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M70 162 L34 258" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M150 162 L186 258" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M86 270 L76 408" stroke="#1c1915" strokeWidth="1.4" />
      <path d="M134 270 L144 408" stroke="#1c1915" strokeWidth="1.4" />
      {worn.has("path-silk") ? <path d="M74 118 Q110 168 146 118 Q110 146 74 118" fill="#8c734b" /> : null}
      {worn.has("holly") ? (
        <>
          <circle cx="82" cy="62" r="3.5" fill="#145c3a" />
          <circle cx="138" cy="62" r="3.5" fill="#145c3a" />
          <path d="M82 66 V84" stroke="#8c734b" strokeWidth="1.4" />
          <path d="M138 66 V84" stroke="#8c734b" strokeWidth="1.4" />
        </>
      ) : null}
      {worn.has("quiet-water") ? <rect x="156" y="176" width="48" height="38" fill="#c4b49a" stroke="#1c1915" /> : null}
      {worn.has("night-voyage") ? <circle cx="30" cy="254" r="6" fill="none" stroke="#8c734b" strokeWidth="2.4" /> : null}
      {worn.has("traveler") ? <rect x="172" y="246" width="24" height="9" fill="#3c342c" /> : null}
      {worn.has("old-letter") ? <rect x="94" y="214" width="30" height="18" fill="#e7e1d6" stroke="#1c1915" /> : null}
      <text x="110" y="444" textAnchor="middle" fill="#6d645b" fontSize="12">
        样衣，不是真人
      </text>
    </svg>
  );
}

function Culture({ scene, exhibitId, onOpen }: { scene: VirtualScene; exhibitId: string; onOpen: (id: string) => void }) {
  const exhibit = scene.exhibits.find((item) => item.id === exhibitId) ?? scene.exhibits[0];
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-4">
        {scene.exhibits.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === exhibit.id}
            className={cn("border px-3 py-4 text-left", item.id === exhibit.id ? "border-[#1c1915] bg-[#161411] text-[#f3efe6]" : "border-[#d9d1c3]")}
            onClick={() => onOpen(item.id)}
          >
            <span className="font-display text-sm tracking-[0.14em] text-[#8c734b]">0{index + 1}</span>
            <span className="mt-2 block font-serif text-xl">{item.title}</span>
            {item.id === scene.exhibitNow ? <span className="mt-2 block text-[11px] tracking-[0.14em]">这一分钟开着</span> : null}
          </button>
        ))}
      </div>
      <article className="mt-4 border border-[#d9d1c3] px-5 py-6">
        <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">{exhibit.kicker}</p>
        <h3 className="mt-2 font-serif text-3xl">{exhibit.title}</h3>
        <p className="mt-4 max-w-2xl text-[16px] leading-8">{exhibit.body}</p>
      </article>
    </div>
  );
}

function HeatMap({ scene, station, onPick }: { scene: VirtualScene; station: Station; onPick: (id: string) => void }) {
  const max = Math.max(...scene.stations.map((item) => item.people), 1);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_18rem]">
      <div>
        <Plate stations={scene.stations} activeId={station.id} max={max} onPick={onPick} />
        <p className="mt-2 text-xs leading-5 text-[#6d645b]">赤色是停留。上面的店内平面还有通道上的热力，这里按柜位收成一块。</p>
      </div>
      <aside className="border border-[#d9d1c3] px-4 py-4">
        <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">这一块</p>
        <h3 className="mt-2 font-serif text-2xl">{station.label}</h3>
        <p className="mt-3 font-display text-4xl">{station.people}</p>
        <p className="text-xs text-[#6d645b]">人停在这里</p>
        <p className="mt-3 text-sm leading-7">{scene.pathNote}</p>
      </aside>
    </div>
  );
}

function Paths({ scene, pathId, onPick }: { scene: VirtualScene; pathId: string | null; onPick: (id: string) => void }) {
  const active = scene.paths.find((path) => path.id === pathId) ?? scene.paths[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_18rem]">
      <div>
        <svg viewBox="0 0 100 80" className="h-auto w-full border border-[#1c1915] bg-[#ebe4d6]" role="img" aria-label="店内动线">
          <rect x="8" y="8" width="84" height="64" fill="none" stroke="#8c734b" strokeWidth="0.4" />
          {scene.paths.map((path) => (
            <polyline
              key={path.id}
              points={path.points.map((point) => point.join(",")).join(" ")}
              fill="none"
              stroke={path.id === active.id ? "#8c3a32" : "#1c1915"}
              strokeWidth={path.id === active.id ? 1.1 : 0.45}
              className="path-flow"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <p className="mt-2 text-sm leading-7">{scene.pathNote}</p>
      </div>
      <ul className="border border-[#d9d1c3]">
        {scene.paths.map((path) => (
          <li key={path.id} className="border-b border-[#d9d1c3] last:border-b-0">
            <button
              type="button"
              aria-pressed={path.id === active.id}
              className={cn("w-full px-3 py-3 text-left", path.id === active.id ? "bg-[#ebe4d6]" : "hover:bg-[#ebe4d6]/70")}
              onClick={() => onPick(path.id)}
            >
              <span className="font-serif text-xl">{path.name}</span>
              <span className="mt-1 block text-xs text-[#6d645b]">
                {path.meters.toFixed(1)} 米 · {path.buyers} 笔 · {path.category} · 占 {formatRate(path.share)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Advisors({ advisors, activeId, onPick }: { advisors: Advisor[]; activeId: string | null; onPick: (id: string) => void }) {
  const rows = ranked(advisors);
  const active = rows.find((advisor) => advisor.id === activeId) ?? rows[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="overflow-x-auto border border-[#d9d1c3]">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-[11px] tracking-[0.14em] text-[#6d645b]">
            <tr className="border-b border-[#d9d1c3]">
              <th className="px-3 py-2 font-normal">顾问</th>
              <th className="px-3 py-2 font-normal">状态</th>
              <th className="px-3 py-2 font-normal">手头</th>
              <th className="px-3 py-2 font-normal">接待</th>
              <th className="px-3 py-2 font-normal">成交</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((advisor) => (
              <tr key={advisor.id} className={advisor.id === active.id ? "bg-[#ebe4d6]" : undefined}>
                <td className="px-3 py-3">
                  <button type="button" className="font-serif text-lg" onClick={() => onPick(advisor.id)}>
                    {advisor.name}
                  </button>
                </td>
                <td className="px-3 py-3">{advisor.status}</td>
                <td className="px-3 py-3">{advisor.withGuest ?? "—"}</td>
                <td className="px-3 py-3">{advisor.served} 位 · {advisor.minutes} 分钟</td>
                <td className="px-3 py-3">{formatRate(advisor.converted / Math.max(1, advisor.served))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {active ? (
        <aside className="border border-[#d9d1c3] px-4 py-4">
          <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">{active.focus}</p>
          <h3 className="mt-2 font-serif text-2xl">{active.name}</h3>
          <p className="mt-3 text-sm leading-7">
            {active.status === "空闲"
              ? "这一分钟没有人在手里。"
              : active.status === "远程"
                ? `正在远程陪${active.withGuest}，已 ${active.minutes} 分钟。`
                : active.status === "送客"
                  ? `在送${active.withGuest}，已 ${active.minutes} 分钟。`
                  : `在店里陪${active.withGuest}，已 ${active.minutes} 分钟。`}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6d645b]">
            样本里的接待 {active.served} 位，成交 {active.converted} 位。效率是成交除以接待，不是考核排名。
          </p>
        </aside>
      ) : null}
    </div>
  );
}

function QueueDesk({ scene }: { scene: VirtualScene }) {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-7">{scene.queueNote}</p>
      {scene.queue.length === 0 ? (
        <p className="mt-4 border border-[#d9d1c3] px-4 py-8 text-sm text-[#6d645b]">队列是空的。</p>
      ) : (
        <ol className="mt-4 border border-[#d9d1c3]">
          {scene.queue.map((ticket, index) => (
            <li key={ticket.id} className="flex items-baseline justify-between gap-3 border-b border-[#d9d1c3] px-3 py-3 last:border-b-0">
              <span>
                <span className="font-display text-[#8c734b]">{String(index + 1).padStart(2, "0")}</span>
                <span className="ml-3 font-serif text-xl">{ticket.label}</span>
                <span className="ml-3 text-xs text-[#6d645b]">{ticket.kind} · 交给{ticket.advisor}</span>
              </span>
              <span className="text-sm">等 {ticket.wait} 分钟</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Devices({
  devices,
  activeId,
  onlyWatch,
  onFilter,
  onPick,
}: {
  devices: Device[];
  activeId: string | null;
  onlyWatch: boolean;
  onFilter: (value: boolean) => void;
  onPick: (id: string) => void;
}) {
  const visible = onlyWatch ? devices.filter((device) => device.state !== "正常") : devices;
  const active = visible.find((device) => device.id === activeId) ?? visible[0] ?? null;
  return (
    <div>
      <div className="flex gap-2">
        <Button type="button" variant={onlyWatch ? "outline" : "default"} className="h-9 rounded-none" onClick={() => onFilter(false)}>
          全部
        </Button>
        <Button type="button" variant={onlyWatch ? "default" : "outline"} className="h-9 rounded-none" onClick={() => onFilter(true)}>
          只看要处理的
        </Button>
      </div>
      {visible.length === 0 ? (
        <p className="mt-4 border border-[#d9d1c3] px-4 py-8 text-sm text-[#6d645b]">这一分钟没有要处理的设备。</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((device) => (
            <button
              key={device.id}
              type="button"
              aria-pressed={active?.id === device.id}
              className={cn("border px-3 py-3 text-left", active?.id === device.id ? "border-[#1c1915]" : "border-[#d9d1c3]")}
              onClick={() => onPick(device.id)}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-xl">{device.name}</span>
                <span className={device.state === "正常" ? "text-xs text-[#8c734b]" : "text-xs text-[#8c3a32]"}>{device.state}</span>
              </span>
              <span className="mt-2 block text-xs text-[#6d645b]">{device.zone}</span>
              <span className="mt-2 block text-sm leading-6">{device.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stockouts({ fixtures, activeId, onPick }: { fixtures: Fixture[]; activeId: string | null; onPick: (id: string) => void }) {
  const empty = fixtures.filter((fixture) => fixture.onHand === 0);
  const low = fixtures.filter((fixture) => fixture.onHand > 0 && fixture.issues.some((issue) => issue.includes("零星")));
  const active = fixtures.find((fixture) => fixture.id === activeId);
  return (
    <div>
      {empty.length === 0 && low.length === 0 ? (
        <p className="border border-[#d9d1c3] px-4 py-8 text-sm leading-7 text-[#6d645b]">这一分钟没有空柜，也没有远看像空的柜子。</p>
      ) : (
        <ul className="border border-[#d9d1c3]">
          {[...empty, ...low].map((fixture) => (
            <li key={fixture.id} className="border-b border-[#d9d1c3] last:border-b-0">
              <button
                type="button"
                className={cn("w-full px-3 py-3 text-left", active?.id === fixture.id ? "bg-[#ebe4d6]" : "hover:bg-[#ebe4d6]/70")}
                onClick={() => onPick(fixture.id)}
              >
                <span className="font-serif text-xl">{fixture.label}</span>
                <span className="ml-3 text-xs text-[#8c3a32]">{fixture.onHand === 0 ? "空柜" : "零星"}</span>
                <span className="mt-1 block text-sm leading-6">{fixture.issues[0]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {active ? <SkuLine fixture={active} /> : null}
    </div>
  );
}

function SkuLine({ fixture }: { fixture: Fixture }) {
  return (
    <p className="mt-3 text-sm leading-7">
      {fixture.label}容量 {fixture.capacity}，在柜 {fixture.onHand}。
      {fixture.skus.map((sku) => `${sku.name} ${sku.qty}`).join("，")}。
    </p>
  );
}

function Compliance({ fixtures }: { fixtures: Fixture[] }) {
  const bad = fixtures.filter((fixture) => fixture.issues.length > 0);
  return (
    <div>
      <p className="text-sm leading-7">
        {fixtures.length} 个柜位里，{bad.length} 个和图纸不一致。
        {bad.length === 0 ? "这一分钟陈列是齐的。" : ""}
      </p>
      {bad.length === 0 ? (
        <p className="mt-4 border border-[#d9d1c3] px-4 py-8 text-sm text-[#6d645b]">没有要改的陈列。</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {bad.map((fixture) => (
            <li key={fixture.id} className="border border-[#d9d1c3] px-3 py-3">
              <p className="font-serif text-xl">
                {fixture.label}
                <span className="ml-2 text-xs text-[#6d645b]">{fixture.category}</span>
              </p>
              <ul className="mt-2 space-y-1 text-sm leading-6">
                {fixture.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Inventory({ fixtures, activeId, onPick }: { fixtures: Fixture[]; activeId: string | null; onPick: (id: string) => void }) {
  const active = fixtures.find((fixture) => fixture.id === activeId) ?? fixtures[0];
  return (
    <div>
      <ul className="space-y-3">
        {fixtures.map((fixture) => (
          <li key={fixture.id}>
            <button type="button" className="grid w-full grid-cols-[5rem_1fr_auto] items-center gap-3 text-left" onClick={() => onPick(fixture.id)}>
              <span className="text-sm">{fixture.label}</span>
              <span className="relative h-2 bg-[#ebe4d6]">
                <span
                  className={fixture.onHand === 0 ? "absolute inset-y-0 left-0 bg-[#8c3a32]" : "absolute inset-y-0 left-0 bg-[#1c1915]"}
                  style={{ width: `${Math.max(fixture.onHand === 0 ? 0 : 4, (fixture.onHand / fixture.capacity) * 100)}%` }}
                />
              </span>
              <span className="text-xs text-[#6d645b]">
                {fixture.onHand}/{fixture.capacity}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {active ? <SkuLine fixture={active} /> : null}
    </div>
  );
}

function Plans({ plans, adopted, onAdopt }: { plans: [DisplayPlan, DisplayPlan]; adopted: "A" | "B"; onAdopt: (id: "A" | "B") => void }) {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-7">两套陈列对着同一分钟的人流。放到柜上只改这台浏览器里的样本，不改上面的平面图。</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className={cn("border px-4 py-4", adopted === plan.id ? "border-[#8c734b] bg-[#f7f1e4]" : "border-[#d9d1c3]")}>
            <p className="font-display text-sm tracking-[0.16em] text-[#8c734b]">方案 {plan.id}</p>
            <h3 className="mt-2 font-serif text-2xl">{plan.name}</h3>
            <p className="mt-2 text-sm leading-7">{plan.move}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-[#6d645b]">进店占比</dt>
                <dd className="mt-1 font-display text-2xl">{formatRate(plan.capture)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#6d645b]">客单价</dt>
                <dd className="mt-1 font-display text-2xl">{twinYuan(plan.aov)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#6d645b]">客单量</dt>
                <dd className="mt-1 font-display text-2xl">{plan.units.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#6d645b]">主柜停留</dt>
                <dd className="mt-1 font-display text-2xl">{formatRate(plan.dwell)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-7">{plan.note}</p>
            <Button type="button" className="mt-4 h-9 rounded-none" variant={adopted === plan.id ? "secondary" : "default"} onClick={() => onAdopt(plan.id)}>
              {adopted === plan.id ? "柜上就是这一套" : "放到柜上"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Tour({ scene, city, onPick }: { scene: VirtualScene; city: string | null; onPick: (city: string) => void }) {
  const stop = scene.tour.find((item) => item.city === city) ?? scene.tour[0];
  const showing = scene.tour.some((item) => item.status === "在展");
  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <ol className="border border-[#d9d1c3]">
        {scene.tour.map((item, index) => (
          <li key={item.city} className="border-b border-[#d9d1c3] last:border-b-0">
            <button
              type="button"
              className={cn("w-full px-3 py-3 text-left", item.city === stop.city ? "bg-[#ebe4d6]" : "hover:bg-[#ebe4d6]/70")}
              onClick={() => onPick(item.city)}
            >
              <span className="font-display text-[#8c734b]">{String(index + 1).padStart(2, "0")}</span>
              <span className="ml-3 font-serif text-xl">{item.city}</span>
              <span className="mt-1 block text-xs text-[#6d645b]">
                {item.title} · {item.status}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <article className="border border-[#d9d1c3] px-5 py-5">
        <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">{stop.status}</p>
        <h3 className="mt-2 font-serif text-3xl">
          {stop.city} · {stop.title}
        </h3>
        <p className="mt-2 text-xs text-[#6d645b]">{stop.storeName}</p>
        <p className="mt-4 max-w-xl text-[16px] leading-8">{stop.chapter}</p>
        {showing ? null : <p className="mt-4 text-sm leading-7 text-[#6d645b]">这一家不在巡展线路上。六站仍按上海、北京、成都、杭州、深圳、西安走。</p>}
      </article>
    </div>
  );
}

function Launch({ scene, store }: { scene: VirtualScene; store: StoreTwin }) {
  const here = scene.editions.filter((piece) => piece.storeId === store.id);
  return (
    <article>
      <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">{scene.launch.line}</p>
      <h3 className="mt-2 font-serif text-4xl md:text-5xl">{scene.launch.name}</h3>
      <p className="mt-4 max-w-2xl text-[16px] leading-8">{scene.launch.story}</p>
      <p className="mt-3 max-w-2xl text-sm leading-7">{scene.launch.craft}</p>
      <p className="mt-4 text-sm leading-7">
        十二只里，这一家在柜 {scene.launch.heldHere} 只。
        {here.length === 0 ? "编号不在这家。" : `落在这里的编号：${here.map((piece) => `${piece.serial}（${piece.state}）`).join("、")}。`}
      </p>
    </article>
  );
}

function Craft({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  const product = products.find((item) => item.id === activeId) ?? products[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <ul className="border border-[#d9d1c3]">
        {products.map((item) => (
          <li key={item.id} className="border-b border-[#d9d1c3] last:border-b-0">
            <button
              type="button"
              className={cn("w-full px-3 py-3 text-left", item.id === product.id ? "bg-[#ebe4d6]" : "hover:bg-[#ebe4d6]/70")}
              onClick={() => onPick(item.id)}
            >
              <span className="font-serif text-xl">{item.name}</span>
              <span className="mt-1 block text-xs text-[#6d645b]">{item.family}</span>
            </button>
          </li>
        ))}
      </ul>
      <article className="border border-[#d9d1c3] px-5 py-5">
        <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">{product.family}</p>
        <h3 className="mt-2 font-serif text-3xl">{product.name}</h3>
        <p className="mt-4 text-[16px] leading-8">{product.story}</p>
        <p className="mt-3 text-sm leading-7">{product.craft}</p>
        <p className="mt-3 text-sm leading-7 text-[#6d645b]">{product.material}</p>
      </article>
    </div>
  );
}

function Limited({
  edition,
  editions,
  beat,
  onPick,
  onBeat,
}: {
  edition: EditionPiece;
  editions: EditionPiece[];
  beat: number;
  onPick: (serial: string) => void;
  onBeat: (beat: number) => void;
}) {
  const script = editionScript(edition);
  const step = script[Math.min(beat, script.length - 1)];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {editions.map((piece) => (
          <button
            key={piece.serial}
            type="button"
            aria-pressed={piece.serial === edition.serial}
            className={cn(
              "border px-2 py-3 text-left",
              piece.serial === edition.serial ? "border-[#1c1915] bg-[#161411] text-[#f3efe6]" : "border-[#d9d1c3]",
            )}
            onClick={() => onPick(piece.serial)}
          >
            <span className="font-display text-lg">{piece.serial}</span>
            <span className="mt-1 block text-[11px] text-[#8c734b]">{piece.state}</span>
          </button>
        ))}
      </div>
      <article className="mt-4 border border-[#d9d1c3] bg-[#161411] px-5 py-6 text-[#f3efe6]">
        <p className="text-[11px] tracking-[0.16em] text-[#c8b48a]">
          {edition.serial} · {edition.state} · {edition.place}
        </p>
        <h3 className="mt-3 font-serif text-3xl">{step.title}</h3>
        <p className="mt-3 max-w-xl text-[16px] leading-8">{step.text}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {script.map((item, index) => (
            <Button key={item.title} type="button" variant={index === beat ? "secondary" : "outline"} className="h-9 rounded-none bg-[#f3efe6] text-[#1c1915] hover:text-[#1c1915]" onClick={() => onBeat(index)}>
              {item.title}
            </Button>
          ))}
        </div>
      </article>
    </div>
  );
}
