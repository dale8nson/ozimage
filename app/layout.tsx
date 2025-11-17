'use client'
import type { Metadata } from "next";
import "./globals.css";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  
  const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
    <html lang="en">
      <body className="flex flex-row justify-center items-center w-screen h-screen bg-black m-0">
        {children}
      </body>
    </html>
    </QueryClientProvider>
  );
}
