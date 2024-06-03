'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

import Board from './(Board)';

import { Icons } from '@/components/icons';
import useQuestStore from '@/stores/questStore';

const Page = () => {
  const [questsStatus, categoriesStatus, getQuests, getCategories] =
    useQuestStore((state) => [
      state.questsStatus,
      state.categoriesStatus,
      state.getQuests,
      state.getCategories,
    ]);

  useEffect(() => {
    getQuests();
    getCategories();
  }, [getQuests, getCategories]);

  return (
    <section className="bg-background max-h-screen overflow-hidden rounded-lg p-8">
      <div className="w-full border-b pb-6">
        <div className="relative flex items-center justify-end">
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg md:text-2xl">
            題目管理看板
          </h1>
        </div>
      </div>
      {categoriesStatus === 'pending' || questsStatus === 'pending' ? (
        <motion.div layout className="grid place-content-center p-12">
          <Icons.load className="size-24 animate-spin" />
        </motion.div>
      ) : categoriesStatus === 'success' && questsStatus === 'success' ? (
        <Board />
      ) : null}
    </section>
  );
};

export default Page;
