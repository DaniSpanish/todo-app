import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToDo アプリ",
  description: "シンプルなToDo管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#f8f7f4]">{children}</body>
    </html>
  );
}
