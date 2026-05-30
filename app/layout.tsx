import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
