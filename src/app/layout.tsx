import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin Dashboard | Salah",
  description: "Secure administrative dashboard for portfolio management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-black`} suppressHydrationWarning>
        <Toaster theme="dark" position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
