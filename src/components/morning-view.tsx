"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDesk } from "@/lib/desk-state";
import { morningDecisions, seatsLeft, silentClients } from "@/lib/engine";
import { stores } from "@/lib/maison";

export function MorningView() {
  const desk = useDesk();
  const decisions = morningDecisions(desk.invited);
  const silent = silentClients().length;
  const left = seatsLeft("quiet", desk.invited.quiet ?? []);
  const restrained = desk.adopted.includes("su-restraint");

  const lines = [
    "昨晚国金拒绝了两笔年末议价，全价占比停在 96.4%。这是今天所有动作的前提。",
    `名册上有 ${silent} 位终身往来较高、超过九十天没有消息的主顾。默认不向他们介绍新品。`,
    left === 0
      ? "十一月十二日的静水私享已经按标准补满。不要再从消费榜上加人。"
      : `十一月十二日的静水私享还空 ${left} 席。空着可以，用错的人坐进来不行。`,
    restrained
      ? "苏曼今天被确认不推销。若联系，只为旧信夹的边缘。"
      : "苏曼还留在「也许可以再推一件」的惯性里。今天先把她移出销售名单。",
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">晨会 · 十一月七日</p>
      <h1 className="mt-3 max-w-3xl font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">
        今天只决定三件事
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        奢品运营不是把流量做成成交，是把稀缺、关系和价格守成同一件事。模型负责压缩信号，发送仍要署顾问的名。
      </p>

      <div className="mt-8 border-l border-[#8c734b] pl-4 md:pl-5">
        {lines.map((line) => (
          <p key={line} className="max-w-3xl py-1.5 text-[15px] leading-7">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {decisions.map((decision) => {
          const done = desk.adopted.includes(decision.id);
          return (
            <article
              key={decision.id}
              className={
                decision.tone === "dont"
                  ? "flex flex-col border border-dashed border-[#8c734b] px-5 py-5"
                  : "flex flex-col border border-[#d9d1c3] bg-[#f7f4ee] px-5 py-5"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] tracking-[0.18em] text-[#8c734b]">{decision.kicker}</p>
                {done ? <p className="text-[11px] text-[#6d645b]">已列入今日</p> : null}
              </div>
              <h2 className="mt-3 font-serif text-[1.55rem] leading-snug font-medium">{decision.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#3c342c]">{decision.detail}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  className="h-10 rounded-none px-4"
                  disabled={done}
                  onClick={() => desk.adopt(decision.id)}
                >
                  {done ? "已确认" : decision.tone === "dont" ? "确认今天不做" : "列入今日"}
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-none px-4"
                  nativeButton={false}
                  render={<Link href={decision.href} />}
                >
                  {decision.action}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <dl className="mt-10 grid grid-cols-2 border border-[#d9d1c3] md:grid-cols-4">
        {[
          ["全价占比", "96.4%", "两笔议价被拒绝"],
          ["预约到店", "18 组", "成交 7，不为了填满"],
          ["沉默主顾", String(silent), "超过九十天，往来较高"],
          ["静水余席", left === null ? "—" : String(left), "留下空席也是决定"],
        ].map(([label, value, note]) => (
          <div key={label} className="border-[#d9d1c3] px-4 py-5 not-first:border-t md:not-first:border-t-0 md:not-first:border-l">
            <dt className="text-[11px] tracking-[0.16em] text-[#6d645b]">{label}</dt>
            <dd className="mt-2 font-display text-4xl tracking-wide text-[#1c1915]">{value}</dd>
            <p className="mt-2 text-xs leading-5 text-[#6d645b]">{note}</p>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-medium">四家店，昨天</h2>
          <span className="flex gap-4">
            <Link href="/twin" className="text-[13px] text-[#8c734b] underline-offset-4 hover:underline">
              五十家同刻
            </Link>
            <Link href="/playbook" className="text-[13px] text-[#8c734b] underline-offset-4 hover:underline">
              这套判断从哪来
            </Link>
          </span>
        </div>
        <div className="mt-4 divide-y divide-[#d9d1c3] border-y border-[#d9d1c3]">
          {stores.map((store) => (
            <div key={store.name} className="grid gap-1 py-4 md:grid-cols-[8rem_1fr] md:gap-6">
              <h3 className="text-sm font-medium">{store.name}</h3>
              <p className="text-sm leading-7 text-[#3c342c]">{store.line}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
