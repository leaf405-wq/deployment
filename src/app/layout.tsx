import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "索瓦 · 奢品运营台",
    template: "%s · 索瓦",
  },
  description:
    "索伦邸中国区的运营台。晨会只留三件决定，名册写明不该做什么，内容工坊按品牌法典起草。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
