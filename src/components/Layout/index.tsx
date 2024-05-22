import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative m-0 flex w-full flex-col justify-between overflow-hidden md:my-6 md:ms-6 md:rounded-lg'
      )}
    >
      {children}
      <Footer />
    </div>
  );
}
