import type { Metadata } from "next";
import { MorningView } from "@/components/morning-view";

export const metadata: Metadata = { title: "晨会" };

export default function Page() {
  return <MorningView />;
}
