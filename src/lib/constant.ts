import { env } from '@/env.mjs';

export const siteConfig = {
  title: 'AI Art Question App',
  description:
    'AI Art Question App is a full-stack app built with Next.js, React, Tailwind CSS, TypeScript, Shadcn/ui, Next-auth, Prisma, MongoDB, and Google Sheets.',
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'TypeScript',
    'Shadcn/ui',
    'Next-auth',
    'Prisma',
    'MongoDB',
    'Google Sheets',
  ],
  url: env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  googleSiteVerificationId: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID || '',
};
