"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { maison } from "@/lib/maison";

const nav = [
  { href: "/", label: "晨会", index: "01" },
  { href: "/clients", label: "名册", index: "02" },
  { href: "/studio", label: "内容", index: "03" },
  { href: "/calendar", label: "体验", index: "04" },
  { href: "/playbook", label: "方法", index: "05" },
  { href: "/twin", label: "孪生", index: "06" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function DeskShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh md:flex">
      <aside className="sticky top-0 hidden h-dvh w-[96px] shrink-0 flex-col bg-[#161411] text-[#f3efe6] md:flex">
        <div className="px-4 pt-7">
          <p className="font-display text-[2rem] leading-none font-medium italic text-[#f4efe4]">Soie</p>
          <p className="mt-2 text-[10px] tracking-[0.28em] text-[#c8b48a]">索瓦</p>
        </div>
        <nav className="mt-10 flex flex-col" aria-label="运营台">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-l px-4 py-3 text-[13px] transition-colors",
                  active
                    ? "border-[#e4d3a8] text-[#f4efe4]"
                    : "border-transparent text-[#b7aa9a] hover:text-[#f4efe4]",
                )}
              >
                <span className="block font-display text-[11px] tracking-[0.18em] text-[#8c734b]">
                  {item.index}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto px-4 pb-6 text-[11px] leading-5 text-[#9c9082]">
          名册留在
          <br />
          这台浏览器
        </p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 bg-[#161411] text-[#f3efe6] md:hidden">
          <div className="flex items-baseline justify-between px-4 pt-4">
            <p className="font-display text-[1.8rem] leading-none italic">Soie</p>
            <p className="text-[10px] tracking-[0.18em] text-[#c8b48a]">样本 · 不外发</p>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto px-3 pb-3" aria-label="运营台">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 px-3 py-2 text-[13px]",
                    active ? "bg-[#f3efe6] text-[#1c1915]" : "text-[#d9d0c4]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="hidden items-end justify-between gap-6 border-b border-[#d9d1c3] px-10 py-5 md:flex">
          <div>
            <p className="text-[12px] tracking-[0.16em] text-[#6d645b]">
              {maison.name} {maison.latin}
              <span className="px-2 text-[#c8b48a]">/</span>
              {maison.desk}
              <span className="px-2 text-[#c8b48a]">/</span>
              {maison.season}
            </p>
            <p className="mt-1 text-[12px] text-[#6d645b]">
              样本名册与样本单品，人物均为虚构。语气模型在这台浏览器里运行，不外发。
            </p>
          </div>
          <p className="shrink-0 text-right font-display text-xl tracking-wide text-[#1c1915]">
            {maison.dateLabel}
            <span className="mt-1 block font-sans text-[11px] tracking-[0.16em] text-[#6d645b]">
              {maison.weekday}
            </span>
          </p>
        </div>

        <main className="px-4 py-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
