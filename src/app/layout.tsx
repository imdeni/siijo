import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM SIJO",
  description: "CRM for Sinau Jogja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
