import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Familjen_Grotesk } from "next/font/google";
import "./globals.css";

// variable font with an optical-size axis: big headlines get the condensed display cut
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-brasa-display",
  display: "swap",
});

const body = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-brasa-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brasa — Fire-roasted sauces",
  description:
    "Small-batch sauces charred over oak, fermented for 21 days and poured by hand. Habanero Ash, Black Garlic Chipotle and Ghost Saffron.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
