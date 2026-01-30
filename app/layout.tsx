import type { Metadata } from "next";
import { Oxanium, Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/app-shell";

const fontOxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const fontMerriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const fontFiraCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Quiz.win",
  description: "Master your knowledge through adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontOxanium.variable} ${fontMerriweather.variable} ${fontFiraCode.variable}`}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
