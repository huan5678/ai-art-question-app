'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const showNavbar = pathname.includes('/admin');

  return (
    showNavbar && (
      <header className="relative w-full border-b py-4">
        <Link
          href="/"
          className="absolute left-4 top-10 -translate-y-6 font-mono font-bold text-gray-300 decoration-transparent underline-offset-8 transition duration-300 ease-in-out hover:text-white hover:underline hover:decoration-white md:text-lg"
        >
          回抽選系統
        </Link>
        <div className="container flex items-center justify-between">
          <h2 className="mx-auto text-center text-lg font-bold text-white md:text-3xl">
            後台管理系統
          </h2>
        </div>
      </header>
    )
  );
};
