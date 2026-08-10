import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/lib/intro-context";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageEnter from "@/components/PageEnter";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konstantin Patsalides — Berlin · Stadtentwicklung",
  description:
    "Konstantin Patsalides — Berlin, Stadtentwicklung, Nachhaltigkeit, Technologie und Sport.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" id="top">
      <body className={`${archivo.variable} ${newsreader.variable}`}>
        <IntroProvider>
          <Preloader />
          <SmoothScroll />
          <Header />
          <PageEnter>{children}</PageEnter>
          <Footer />
        </IntroProvider>
      </body>
    </html>
  );
}
