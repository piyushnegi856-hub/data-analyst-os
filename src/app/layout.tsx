import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Open_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "next-themes";

// Body / reading text — Barlow at 400/500/600/700
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

// Sidebar chrome / labels — condensed, tight
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

// UI chrome — buttons, inputs, topbar
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DA Sprint OS | Data Analyst Job-Search Command Center",
  description:
    "Your 30-day data analyst sprint tracker. Log tasks, track job applications, visualise skill growth, and ship your portfolio — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full h-full flex flex-col m-0 p-0 overflow-hidden text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
