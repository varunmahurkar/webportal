/**
 * Nurav AI Core Pages Layout
 *
 * Layout wrapper for core design system pages (typography, icons, colors).
 * Includes the header navigation for these documentation pages.
 */

import { Header } from "@/components/layout";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </>
  );
}
