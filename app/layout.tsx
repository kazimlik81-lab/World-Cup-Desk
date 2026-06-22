import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import "@/app/dashboard-layout.css";
import "@/app/dashboard-components.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "World Cup Desk",
  description: "Local World Cup news and match report desk"
};

type RootLayoutProperties = {
  children: ReactNode;
};

export default function RootLayout(properties: RootLayoutProperties): ReactNode {
  return (
    <html lang="ru">
      <body className={inter.variable}>{properties.children}</body>
    </html>
  );
}
