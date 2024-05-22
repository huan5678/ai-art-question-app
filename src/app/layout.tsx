import '@/styles/globals.css';

import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/lib/constant';
import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import ClientProvider from '@/provider/clientProvider';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';
import { ThemeProvider } from '@/provider/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.svg',
    shortcut: '/favicon/favicon.svg',
    apple: '/favicon/favicon.svg',
  },
  verification: {
    google: siteConfig.googleSiteVerificationId,
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: '/opengraph-image.png',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: '/opengraph-image.png',
  },
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('bg-[var(--n7)] font-sans dark:bg-[var(--n2)]', fonts)}
      >
        <ReactQueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <ClientProvider />
            {children}
            <Toaster />
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
