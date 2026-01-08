import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  
  // const queryClient = new QueryClient()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <Suspense>
      <html lang="en" className="overflow-hidden">
        <body className="flex flex-col justify-start items-start w-screen h-screen bg-white m-0">
          {children}
        </body>
      </html>
    // </Suspense>
  );
}
