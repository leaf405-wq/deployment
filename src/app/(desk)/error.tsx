"use client";

import { Button } from "@/components/ui/button";

export default function DeskError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-lg py-16">
      <p className="text-[11px] tracking-[0.18em] text-[#8c734b]">没有展开</p>
      <h1 className="mt-3 font-serif text-4xl font-medium">这一页停住了</h1>
      <p className="mt-4 text-sm leading-7 text-[#3c342c]">名册还在。再试一次即可，不必重新开始今天的决定。</p>
      <Button className="mt-6 h-10 rounded-none px-4" onClick={() => reset()}>
        再试一次
      </Button>
    </div>
  );
}
