import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["cyrillic", "latin"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["cyrillic", "latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og-kbs.png`;
  const title = "Мягкий старт — как подготовить ребёнка к школе";
  const description = "Практический интерактивный план возвращения в учебный ритм без давления и аврала.";

  return {
    title,
    description,
    icons: { icon: "/brand/kbs-mark.jpg", shortcut: "/brand/kbs-mark.jpg" },
    openGraph: { title, description, type: "website", locale: "ru_RU", images: [{ url: socialImage, width: 1200, height: 630, alt: "Мягкий старт" }] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${manrope.variable} ${unbounded.variable}`}>{children}</body></html>;
}
