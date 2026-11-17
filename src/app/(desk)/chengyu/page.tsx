import type { Metadata } from "next";

export const metadata: Metadata = { title: "成语接龙" };

export default function Page() {
  return (
    <iframe
      title="成语接龙"
      src="/chengyu/index.html"
      className="h-[calc(100dvh-9.5rem)] w-full border-0 bg-[#03040c]"
    />
  );
}
