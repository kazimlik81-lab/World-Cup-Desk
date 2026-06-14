import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "World Cup Desk",
  description: "Локальная лента новостей и отчетов чемпионата мира"
};

type RootLayoutProperties = {
  children: ReactNode;
};

export default function RootLayout(properties: RootLayoutProperties): ReactNode {
  return (
    <html lang="ru">
      <body>{properties.children}</body>
    </html>
  );
}
