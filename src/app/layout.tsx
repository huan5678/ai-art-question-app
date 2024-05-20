import '@/styles/globals.css';

import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/lib/constant';
import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider';

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
      <body className={cn('font-sans', fonts)}>
        <ReactQueryClientProvider>
          <div
            className={cn(
              'relative min-h-screen bg-gradient-to-b from-black/90 via-black/10 to-black/90'
            )}
          >
            <Image
              src="/images/bg.jpg"
              fill
              layout="fill"
              objectFit="cover"
              alt="Background Image"
              className="z-[-1]"
            />
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </div>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
