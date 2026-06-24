import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI \u5de5\u5177\u96c6 \u2014 \u591a\u529f\u80fd\u667a\u80fd\u52a9\u624b\u5e73\u53f0",
  description: "\u5305\u542b PDF \u6982\u62ec\u3001\u6587\u6848\u751f\u6210\u7b49\u591a\u79cd AI \u5de5\u5177\u7684\u6f14\u793a\u5e73\u53f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
