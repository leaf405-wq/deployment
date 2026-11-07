"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { copyText } from "@/components/copy-text";
import { useDesk } from "@/lib/desk-state";
import { adviseAll, pieceName, type AdviceKind } from "@/lib/engine";
import { clientById, daysSince, yuan, type Client } from "@/lib/maison";

const filters: { id: "today" | AdviceKind | "all"; label: string }[] = [
  { id: "today", label: "今日该联系" },
  { id: "silence", label: "沉默" },
  { id: "salon", label: "沙龙" },
  { id: "nurture", label: "初识" },
  { id: "occasion", label: "场合" },
  { id: "all", label: "全部" },
];

function when(iso: string | null, empty: string) {
  if (!iso) return empty;
  const days = daysSince(iso);
  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  return `${days} 天前`;
}

export function ClientsView() {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("id");
  const desk = useDesk();
  const advice = useMemo(() => adviseAll(), []);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("today");
  const [query, setQuery] = useState("");
  const [formal, setFormal] = useState(false);

  const visible = advice.filter((item) => {
    const client = clientById(item.clientId);
    const haystack = `${client.name}${client.city}${client.store}${item.title}`;
    if (query.trim() && !haystack.includes(query.trim())) return false;
    if (filter === "all") return true;
    if (filter === "today") return item.priority >= 60;
    return item.kind === filter;
  });

  const opened = requested ? advice.find((item) => item.clientId === requested) : undefined;
  const openedClient = opened ? clientById(opened.clientId) : undefined;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">名册 · 下一步</p>
      <h1 className="mt-3 font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">先写明不做什么</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        排序看场合、沉默、城市和禁忌，不看谁花得最多。每条都有一句不该说的话。样本人物均为虚构。
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="名册筛选">
          {filters.map((item) => (
            <Button
              key={item.id}
              role="tab"
              aria-selected={filter === item.id}
              variant={filter === item.id ? "default" : "outline"}
              className="h-9 rounded-none px-3"
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="找姓名或城市"
          aria-label="搜索名册"
          className="h-10 rounded-none bg-transparent md:w-56"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-[#d9d1c3] px-5 py-10 text-sm leading-7 text-[#6d645b]">
          {query.trim()
            ? `名册里没有「${query.trim().slice(0, 20)}」。`
            : "这一栏今天是空的。空着就空着，不要从别的栏里拉人来填。"}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-[#d9d1c3] border-y border-[#d9d1c3]">
          {visible.map((item) => {
            const client = clientById(item.clientId);
            const contacted = Boolean(desk.contacted[client.id]);
            return (
              <li key={client.id}>
                <button
                  type="button"
                  onClick={() => {
                    setFormal(false);
                    router.replace(`/clients?id=${client.id}`);
                  }}
                  className="grid w-full gap-2 py-4 text-left transition-colors hover:bg-[#ebe4d6]/60 md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-6"
                >
                  <span>
                    <span className="block font-serif text-xl font-medium">{client.name}</span>
                    <span className="mt-1 block text-xs text-[#6d645b]">
                      {client.tier} · {client.city} · {client.store}
                    </span>
                  </span>
                  <span>
                    <span className="block text-sm leading-6">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#6d645b]">{item.dont}</span>
                  </span>
                  <span className="text-xs text-[#8c734b]">{contacted ? "今日已记联系" : "写短信"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet
        open={Boolean(opened && openedClient)}
        onOpenChange={(open) => {
          if (!open) router.replace("/clients");
        }}
      >
        {opened && openedClient ? (
          <ClientSheet
            client={openedClient}
            advice={opened}
            formal={formal}
            setFormal={setFormal}
            contacted={Boolean(desk.contacted[opened.clientId])}
            onToggleContact={() => desk.toggleContact(opened.clientId)}
          />
        ) : null}
      </Sheet>
    </div>
  );
}

function ClientSheet({
  client,
  advice,
  formal,
  setFormal,
  contacted,
  onToggleContact,
}: {
  client: Client;
  advice: ReturnType<typeof adviseAll>[number];
  formal: boolean;
  setFormal: (value: boolean) => void;
  contacted: boolean;
  onToggleContact: () => void;
}) {
  const script = formal ? advice.scripts.formal : advice.scripts.short;
  return (
    <SheetContent className="w-full overflow-y-auto bg-[#f7f4ee] sm:max-w-md">
      <SheetHeader className="pr-10">
        <SheetTitle className="font-serif text-3xl font-medium">{client.name}</SheetTitle>
        <SheetDescription>
          {client.tier} · {client.city} · {client.store} · 自 {client.since}
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-6 px-4 pb-8">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#6d645b]">往来</dt>
            <dd className="mt-1">{client.lifetime > 0 ? yuan(client.lifetime) : "尚未购买"}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-[#6d645b]">上次</dt>
            <dd className="mt-1">
              到店 {when(client.lastVisit, "尚未到店")}
              <span className="block text-[#6d645b]">联系 {when(client.lastTouch, "无")}</span>
            </dd>
          </div>
        </dl>

        {client.occasion ? (
          <p className="text-sm leading-6">
            {client.occasion.label} · {client.occasion.date.slice(5).replace("-", "月")}日 ·{" "}
            {pieceName(client.occasion.pieceId)}
          </p>
        ) : null}

        <p className="text-sm leading-7 text-[#3c342c]">{client.notes}</p>

        <div>
          <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">不要</p>
          <ul className="mt-2 space-y-1 text-sm">
            {client.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.16em] text-[#8c734b]">为什么是现在</p>
          <ul className="mt-2 space-y-1 text-sm leading-6">
            {advice.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-6">{advice.dont}</p>
        </div>

        <div className="border border-[#d9d1c3] bg-[#f3efe6] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] tracking-[0.16em] text-[#6d645b]">{formal ? "正式" : "短笺"}</p>
            <button
              type="button"
              className="text-[12px] text-[#8c734b] underline-offset-4 hover:underline"
              onClick={() => setFormal(!formal)}
            >
              {formal ? "改成短笺" : "改成正式"}
            </button>
          </div>
          <p className="mt-3 font-serif text-[15px] leading-8 whitespace-pre-wrap">{script}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="h-10 rounded-none px-4" onClick={() => copyText(script)}>
            抄下这封
          </Button>
          <Button variant="outline" className="h-10 rounded-none px-4" onClick={onToggleContact}>
            {contacted ? "撤销已联系" : "记为今日已联系"}
          </Button>
        </div>
        <p className="text-xs leading-5 text-[#6d645b]">来源：{client.source}。这封短信不会自动发出。</p>
      </div>
    </SheetContent>
  );
}
