import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/lib/intro-context";
import { NavigationProvider } from "@/lib/navigation";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreFooterContact from "@/components/PreFooterContact";
import PageEnter from "@/components/PageEnter";
import Curtain from "@/components/Curtain";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Menschen verbinden. Berlin bewegen.`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: SITE.name,
    title: `${SITE.name} — Menschen verbinden. Berlin bewegen.`,
    description: SITE.description,
    images: [{ url: "/img/kosti.jpg", width: 2560, height: 1707, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" id="top">
      <body className={archivo.variable}>
        <IntroProvider>
          <NavigationProvider>
            <Preloader />
            <SmoothScroll />
            <Header />
            <PageEnter>{children}</PageEnter>
            <div className="footer-reveal">
              <PreFooterContact />
              <Footer />
            </div>
            <Curtain />
          </NavigationProvider>
        </IntroProvider>
      </body>
    </html>
  );
}
