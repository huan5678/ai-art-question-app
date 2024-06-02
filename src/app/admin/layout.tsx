'use client';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex max-h-screen overflow-hidden"
    >
      <Sidebar links={links} socials={[]} />
      <Layout>{children}</Layout>
    </motion.main>
  );
}
