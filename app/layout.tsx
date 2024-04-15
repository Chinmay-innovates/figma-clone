import { Work_Sans } from "next/font/google";
import { Metadata } from "next";
import { Room } from "./Room";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figma Clone",
  description:
    "A minimalist Figma clone using fabric.js and Liveblocks for realtime collaboration",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} bg-primary-grey-200`}>
        <Room >
          {children}
        </Room>
      </body>
    </html>
  );
}
