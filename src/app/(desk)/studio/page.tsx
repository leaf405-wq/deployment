import type { Metadata } from "next";
import { StudioView } from "@/components/studio-view";

export const metadata: Metadata = { title: "内容" };

export default function Page() {
  return <StudioView />;
}
