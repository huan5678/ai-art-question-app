'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SignInButton } from '@/components/navbar/sign-in-button';

export const Navbar = () => {
  const pathname = usePathname();

  const showNavbar = pathname.includes('/admin');

  return (
    showNavbar && (
      <header className="w-full border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-gray-300 decoration-transparent underline-offset-8 transition duration-300 ease-in-out hover:text-white hover:underline hover:decoration-white"
          >
            回抽選系統
          </Link>
          <h2 className="text-center text-3xl font-bold text-white">
            後台管理系統
          </h2>
          <div className="flex items-center gap-2">
            <SignInButton />
          </div>
        </div>
      </header>
    )
  );
};
