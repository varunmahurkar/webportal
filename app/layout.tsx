import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "./core/ThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import { StickyBanner } from "./core/StickyBanner";
import { Header } from "@/components/layout";

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
      <head>
        {/* Prevent FOUC (Flash of Unstyled Content) for theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <StickyBanner
          title="I WILL BECOME SUCCESSFUL FOR 'MINATOZAKI SANA'"
          description="VARUN YOU MUST BECOME SUCCESSFUL FOR MINATOZAKI SANA BECAUSE SHE IS THE ONE."
        />
        <ThemeWrapper>
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </ThemeWrapper>
        <Toaster />
      </body>
    </html>
  );
}
