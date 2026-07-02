import Link from "next/link";
import { AppearanceControls } from "@/components/AppearanceControls";
import "./globals.css";

export const metadata = {
  title: "Grammar in Use Learning System",
  description: "Local-first grammar study dashboard for Units 33-43."
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/map", label: "Map" },
  { href: "/units/unit-33", label: "Units" },
  { href: "/practice", label: "Practice" },
  { href: "/wrong-answers", label: "Wrong Answers" },
  { href: "/reviews", label: "Review Tests" },
  { href: "/account", label: "帳號同步" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var a=JSON.parse(localStorage.getItem('grammar-appearance-v1')||'{}');var t=a.theme||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.font=a.font||'sans';document.documentElement.style.fontSize=(a.scale||100)+'%'}catch(e){}})()`
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-5 flex flex-wrap items-center gap-3 border-b border-ink/10 pb-4 md:mb-6">
            <Link href="/" className="mr-auto flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-leaf text-lg font-bold text-white">
                G
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
                  Grammar in Use
                </p>
                <h1 className="text-xl font-bold text-ink">Learning System</h1>
              </div>
            </Link>
            <AppearanceControls />
            <nav className="order-last flex w-full gap-1 overflow-x-auto pb-1 md:order-none md:w-auto md:flex-wrap md:items-center md:justify-end md:overflow-visible md:pb-0">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-10 shrink-0 rounded-md px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-ink hover:shadow-soft"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
