import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar-view";

export const metadata: Metadata = { title: "体验" };

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#6d645b]">席位展开中</p>}>
      <CalendarView />
    </Suspense>
  );
}
