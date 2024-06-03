'use client';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Layout from '@/components/Layout';
import Sidebar from '@/components/Siderbar';
import links from '@/mocks/links';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <></>;
  }
  if (session.user.role !== 'admin') {
    router.push('/');
    return (
      <div className="flex items-center justify-center text-4xl font-bold">
        Redirecting...
      </div>
    );
  }
  return (
    <main className="flex max-h-screen overflow-hidden">
      <Sidebar links={links} socials={[]} />
      <Layout>{children}</Layout>
    </main>
  );
}
