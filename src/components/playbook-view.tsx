"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { chapters } from "@/lib/playbook";

export function PlaybookView() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
      <nav className="lg:sticky lg:top-8 lg:self-start" aria-label="方法目录">
        <p className="text-[11px] tracking-[0.18em] text-[#8c734b]">六件事</p>
        <ol className="mt-3 flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="block min-w-max text-sm leading-7 text-[#3c342c] hover:text-[#8c734b] lg:min-w-0"
              >
                <span className="mr-2 font-display text-[#8c734b]">{chapter.index}</span>
                {chapter.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div>
        <p className="text-[11px] tracking-[0.22em] text-[#8c734b]">方法 · 奢品运营</p>
        <h1 className="mt-3 font-serif text-[2.1rem] leading-tight font-medium md:text-5xl">
          守住价格，再谈这一天
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#3c342c]">
          大众品牌的运营台帮你多卖一件。奢侈品的运营台先告诉你哪一件不该卖、哪一个人不该被打扰。下面六条是之之风速每天在用的顺序。
        </p>

        {chapters.map((chapter) => (
          <article key={chapter.id} id={chapter.id} className="scroll-mt-24 border-t border-[#d9d1c3] py-10">
            <p className="font-display text-xl tracking-[0.14em] text-[#8c734b]">{chapter.index}</p>
            <h2 className="mt-2 font-serif text-3xl leading-snug font-medium">{chapter.title}</h2>
            <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-8">
              {chapter.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="border border-[#d9d1c3] bg-[#f7f4ee] p-4">
                <h3 className="text-[11px] tracking-[0.16em] text-[#8c734b]">这一周</h3>
                <p className="mt-2 text-sm leading-7">{chapter.week}</p>
              </section>
              <section className="border border-[#d9d1c3] p-4">
                <h3 className="text-[11px] tracking-[0.16em] text-[#8c734b]">模型只做这些</h3>
                <p className="mt-2 text-sm leading-7">{chapter.model}</p>
              </section>
            </div>
            <Button
              variant="outline"
              className="mt-5 h-10 rounded-none px-4"
              nativeButton={false}
              render={<Link href={chapter.href} />}
            >
              {chapter.hrefLabel}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
