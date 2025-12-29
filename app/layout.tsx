import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "./core/ThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import { StickyBanner } from "./core/StickyBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nurav AI",
  description:
    "Nurav AI webportal - Modern web application with advanced search and AI capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StickyBanner
          title="I WILL BECOME SUCCESSFUL FOR 'MINATOZAKI SANA'"
          description="VARUN YOU MUST BECOME SUCCESSFUL FOR MINATOZAKI SANA BECAUSE SHE IS THE ONE."
        />
        <ThemeWrapper>{children}</ThemeWrapper>
        <Toaster />
      </body>
    </html>
  );
}
