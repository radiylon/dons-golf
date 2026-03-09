import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import FloatingNav from "@/components/FloatingNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "USF Dons Golf",
  description:
    "Live scores and stats for USF Dons Women's Golf at TPC Harding Park",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dons Golf",
  },
};

export const viewport: Viewport = {
  themeColor: "#00543C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          {children}
          <FloatingNav />
        </Providers>
      </body>
    </html>
  );
}
