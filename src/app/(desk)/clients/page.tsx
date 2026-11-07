import { Suspense } from "react";
import type { Metadata } from "next";
import { ClientsView } from "@/components/clients-view";

export const metadata: Metadata = { title: "名册" };

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#6d645b]">名册展开中</p>}>
      <ClientsView />
    </Suspense>
  );
}
