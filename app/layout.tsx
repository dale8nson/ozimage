import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-row justify-center items-center w-screen h-screen bg-white m-0">
        {children}
      </body>
    </html>
  );
}
