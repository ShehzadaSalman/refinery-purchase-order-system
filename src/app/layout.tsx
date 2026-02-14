import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PO Workflow System",
  description: "Catalog to PO draft and approval workflow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 text-sm font-medium text-zinc-900">
            <Link href="/catalog" className="rounded px-3 py-1 hover:bg-zinc-100">
              Catalog
            </Link>
            <Link href="/po/new" className="rounded px-3 py-1 hover:bg-zinc-100">
              New PO
            </Link>
            <Link href="/po-list" className="rounded px-3 py-1 hover:bg-zinc-100">
              PO List
            </Link>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
