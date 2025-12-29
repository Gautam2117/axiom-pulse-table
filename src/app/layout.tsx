import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/toaster";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pulse Table Clone",
  description: "Token discovery table replica",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={[
          inter.variable,
          "min-h-dvh bg-[#0b0f14] text-white antialiased",
          "font-sans",
        ].join(" ")}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
