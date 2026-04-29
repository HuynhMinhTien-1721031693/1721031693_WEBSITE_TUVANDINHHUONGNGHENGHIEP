import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Career Guidance Platform",
  description: "Nen tang tu van dinh huong nghe nghiep cho hoc sinh va sinh vien.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm md:px-6">
            <Link href="/" className="mr-2 font-bold text-blue-700">
              Career Guidance
            </Link>
            <Link href="/careers" className="hover:text-blue-700">
              Nganh nghe
            </Link>
            <Link href="/quiz" className="hover:text-blue-700">
              Quiz
            </Link>
            <Link href="/dashboard" className="hover:text-blue-700">
              Dashboard
            </Link>
            <Link href="/booking" className="hover:text-blue-700">
              Tu van 1-1
            </Link>
            <Link href="/blog" className="hover:text-blue-700">
              Blog
            </Link>
            <Link href="/auth" className="hover:text-blue-700">
              Dang nhap
            </Link>
            <Link href="/admin" className="hover:text-blue-700">
              Admin
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
