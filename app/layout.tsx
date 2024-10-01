import type { Metadata } from "next";
import { Inter,JetBrains_Mono,Quicksand,Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });
const josefinSans = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Counselor",
  description: "Counselor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={josefinSans.className}
      >
        <div>
        {children}
        </div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      </body>
    </html>
  );
}
