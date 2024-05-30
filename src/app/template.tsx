'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div>
      <motion.div
        id="banner-1"
        className="fixed left-0 top-0 z-50 min-h-screen w-1/4 bg-neutral-950"
        initial={{ y: 0 }}
        animate={{ y: `${100}%` }}
        transition={{ duration: 1, delay: 0 }}
      />
      <motion.div
        id="banner-2"
        className="fixed left-1/4 top-0 z-50 min-h-screen w-1/4 bg-neutral-950"
        initial={{ y: 0 }}
        animate={{ y: `${100}%` }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        id="banner-3"
        className="fixed left-2/4 top-0 z-50 min-h-screen w-1/4 bg-neutral-950"
        initial={{ y: 0 }}
        animate={{ y: `${100}%` }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.div
        id="banner-4"
        className="fixed left-3/4 top-0 z-50 min-h-screen w-1/4 bg-neutral-950"
        initial={{ y: 0 }}
        animate={{ y: `${100}%` }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      {children}
    </div>
  );
}
