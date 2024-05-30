import { Inter, JetBrains_Mono, Noto_Sans_TC } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const fontSans = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'arial'],
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['system-ui', 'arial'],
});

export const fonts = [inter.variable, fontSans.variable, fontMono.variable];
