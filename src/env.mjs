import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_GITHUB_ID: z.string().min(1).optional(),
    NEXT_PUBLIC_GITHUB_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    GOOGLE_REDIRECT_URL: z.string().url().optional(),
    GOOGLE_PROJECT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_EMAIL: z.string().min(1).optional(),
    GOOGLE_SERVICE_PRIVATE_KEY_ID: z.string().min(1).optional(),
    GOOGLE_SERVICE_PRIVATE_KEY: z.string().min(1).optional(),
    GOOGLE_SHEET_ID: z.string().min(1).optional(),
    GOOGLE_SPREADSHEET_ID: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_GITHUB_ID: process.env.NEXT_PUBLIC_GITHUB_ID,
    NEXT_PUBLIC_GITHUB_SECRET: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_SERVICE_PRIVATE_KEY_ID: process.env.GOOGLE_SERVICE_PRIVATE_KEY_ID,
    GOOGLE_SERVICE_PRIVATE_KEY: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
  },
});
