'use client';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import Layout from '@/components/Layout';
import Sidebar from '@/components/Siderbar';
import links from '@/mocks/links';
import AuthProvider from '@/provider/authProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
