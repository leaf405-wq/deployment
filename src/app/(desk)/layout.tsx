import { Suspense } from "react";
import { DeskShell } from "@/components/desk-shell";

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#f3efe6]" />}>
      <DeskShell>{children}</DeskShell>
    </Suspense>
  );
}
