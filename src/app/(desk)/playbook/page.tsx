import type { Metadata } from "next";
import { PlaybookView } from "@/components/playbook-view";

export const metadata: Metadata = { title: "方法" };

export default function Page() {
  return <PlaybookView />;
}
