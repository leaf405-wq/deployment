"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { copyText } from "@/components/copy-text";
import { useDesk } from "@/lib/desk-state";
import { planGuests, seatsLeft, yearEndLetter, type Placement } from "@/lib/engine";
import { salons, type Salon } from "@/lib/maison";

const visitGroups: { stance: Placement["stance"]; title: string }[] = [
  { stance: "invite", title: "可以请" },
  { stance: "hold", title: "故意不请" },
];

const letterGroups: { stance: Placement["stance"]; title: string }[] = [
  { stance: "personal", title: "单独写一行" },
  { stance: "standard", title: "可收同一封" },
  { stance: "skip", title: "不发这封" },
];

export function CalendarView() {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("id");
  const desk = useDesk();
  const salonId = requested && salons.some((salon) => salon.id === requested) ? requested : "quiet";
  const salon = salons.find((item) => item.id === salonId) ?? salons[0];
  const plan = planGuests(salon.id);
  const invited = desk.invited[salon.id] ?? [];
  const left = seatsLeft(salon.id, invited);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">体验 · 席位</p>
      <h1 className="mt-3 font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">空一席，好过坐错人</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
        嘉宾按城市、品类和禁忌来，不按消费排行。初识不进沙龙。护理场不陈列新品。
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
          {salons.map((item) => {
            const selected = item.id === salon.id;
            const itemLeft = seatsLeft(item.id, desk.invited[item.id] ?? []);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.replace(`/calendar?id=${item.id}`)}
                aria-pressed={selected}
                className={
                  selected
                    ? "min-w-[15rem] border border-[#1c1915] bg-[#f7f4ee] px-4 py-4 text-left lg:min-w-0"
                    : "min-w-[15rem] border border-[#d9d1c3] px-4 py-4 text-left lg:min-w-0"
                }
              >
                <span className="block font-display text-lg tracking-wide">{item.dateLabel}</span>
                <span className="mt-1 block font-serif text-xl">{item.title}</span>
                <span className="mt-2 block text-xs leading-5 text-[#6d645b]">
                  {item.time} · {item.place}
                  {itemLeft === null ? "" : ` · 余 ${itemLeft} 席`}
                </span>
              </button>
            );
          })}
        </div>

        <SalonPlan
          salon={salon}
          plan={plan}
          invited={invited}
          left={left}
          onToggle={(clientId) => desk.toggleInvite(salon.id, clientId, salon.seats, salon.held)}
        />
      </div>
    </div>
  );
}

function SalonPlan({
  salon,
  plan,
  invited,
  left,
  onToggle,
}: {
  salon: Salon;
  plan: Placement[];
  invited: string[];
  left: number | null;
  onToggle: (clientId: string) => void;
}) {
  const groups = salon.mode === "letter" ? letterGroups : visitGroups;
  const letter = yearEndLetter();

  return (
    <div>
      <p className="text-sm leading-7 text-[#3c342c]">{salon.note}</p>
      {left !== null ? (
        <p className="mt-3 text-sm">
          已确认 {salon.held} 位 · 今日拟增 {invited.length} 位 · 还空 {left} 席
        </p>
      ) : null}

      {salon.mode === "letter" ? (
        <div className="mt-5 border border-[#d9d1c3] bg-[#f7f4ee] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-medium">岁末信</h2>
            <Button variant="outline" className="h-8 rounded-none px-3" onClick={() => copyText(letter)}>
              抄下
            </Button>
          </div>
          <p className="mt-4 font-serif text-[16px] leading-8 whitespace-pre-wrap">{letter}</p>
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        {groups.map((group) => {
          const rows = plan.filter((row) => row.stance === group.stance);
          return (
            <section key={group.stance}>
              <h2 className="text-[11px] tracking-[0.16em] text-[#8c734b]">
                {group.title}
                <span className="ml-2 text-[#6d645b]">{rows.length}</span>
              </h2>
              {rows.length === 0 ? (
                <p className="mt-3 text-sm text-[#6d645b]">这一栏是空的。</p>
              ) : (
                <ul className="mt-2 divide-y divide-[#d9d1c3] border-y border-[#d9d1c3]">
                  {rows.map((row) => {
                    const added = invited.includes(row.clientId);
                    const full = left === 0 && !added;
                    return (
                      <li key={row.clientId} className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{row.name}</p>
                          <p className="mt-1 text-sm leading-6 text-[#3c342c]">{row.reason}</p>
                        </div>
                        {row.stance === "invite" ? (
                          <Button
                            variant={added ? "outline" : "default"}
                            className="h-9 shrink-0 rounded-none px-3"
                            disabled={full}
                            onClick={() => onToggle(row.clientId)}
                          >
                            {added ? "撤回" : full ? "已满" : "留席"}
                          </Button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
              {group.stance === "invite" && salon.mode !== "letter" ? (
                <p className="mt-3 text-xs leading-5 text-[#6d645b]">
                  配得上的人就这些。不要为了满席改标准。
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
