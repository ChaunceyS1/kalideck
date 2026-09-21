import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME } from "@/config";
import { PageBackdrop } from "@/components/PageBackdrop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Cybersecurity Copilot`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="relative min-h-dvh bg-bg font-sans text-ink antialiased">
        <PageBackdrop />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
