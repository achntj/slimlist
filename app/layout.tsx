import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { DarkModeProvider } from "@/contexts/dark-mode-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "List Manager",
  description: "A beautiful and minimal list management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-black transition-colors">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </DarkModeProvider>
      </body>
    </html>
  );
}
