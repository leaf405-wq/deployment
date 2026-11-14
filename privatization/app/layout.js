import "./globals.css";

export const metadata = {
  title: {
    default: "私有化底座",
  },
  description: "边界、值守、顾问、审阅、口径五张画面。样本数据留在这台浏览器里。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
