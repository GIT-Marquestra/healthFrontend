"use client";

import { HealthProvider } from '@/context/HealthContext';
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HealthProvider>
          {children}
        </HealthProvider>
      </body>
    </html>
  );
}