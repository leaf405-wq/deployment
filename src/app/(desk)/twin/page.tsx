import type { Metadata } from "next";
import { TwinView } from "@/components/twin-view";

export const metadata: Metadata = { title: "孪生" };

export default function Page() {
  return <TwinView />;
}