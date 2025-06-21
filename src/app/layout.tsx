import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/layout/app-layout';
import { LoadingProvider } from '@/contexts/loading-context';
import { PageLoader } from '@/components/layout/page-loader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mooney gateway',
  description: 'API Gateway & Orchestration Layer for Credit Fixer AI Agent',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <PageLoader />
          <Toaster />
        </LoadingProvider>
      </body>
    </html>
  );
}
