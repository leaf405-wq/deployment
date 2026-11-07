"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DeskProvider } from "@/lib/desk-state";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={280}>
      <DeskProvider>
        {children}
        <Toaster position="top-center" />
      </DeskProvider>
    </TooltipProvider>
  );
}
