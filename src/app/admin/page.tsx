'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

import QuestTable from './(QuestTable)';

import { Icons } from '@/components/icons';
import CategoryInput from '@/components/input/categoryInput';
import QuestInput from '@/components/input/questInput';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';

const Page = () => {
  const [
    createQuest,
    createCategory,
    updateCategory,
    deleteCategory,
    questsStatus,
    quests,
    categories,
    categoriesStatus,
  ] = useQuestStore((state) => [
    state.createQuest,
    state.createCategory,
    state.updateCategory,
    state.deleteCategory,
    state.questsStatus,
    state.quests,
    state.categories,
    state.categoriesStatus,
  ]);

  const [isHydrated, setIsHydrated] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCreateQuest = ({
    data,
  }: {
    data: {
      title: string;
      description: string | null;
      categoryId: string | null;
    }[];
  }) => {
    createQuest(data, session?.user?.id as string);
  };

  const handleCreateCategory = (name: string) => {
    createCategory(name);
  };

  const handleUpdateCategory = ({ id, name }: { id: string; name: string }) => {
    updateCategory(id, name);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  useEffect(() => {
    questsStatus === 'success' &&
      categoriesStatus === 'success' &&
      setIsHydrated(true);
  }, [questsStatus, categoriesStatus]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop } = scrollRef.current;
        if (scrollTop > 0) {
          setShowScroll(true);
        } else {
          setShowScroll(false);
        }

        // 清除之前的計時器
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // 設置新的計時器
        scrollTimeoutRef.current = setTimeout(() => {
          setShowScroll(false);
        }, 2000);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <section
      ref={scrollRef}
      className={cn(
        'bg-background max-h-screen overflow-y-auto rounded-lg p-8 transition-all duration-300 ease-in-out',
        showScroll
          ? '[scrollbar-color:initial]'
          : '[scrollbar-color:transparent_transparent]'
      )}
    >
      {!isHydrated ? (
        <motion.div
          layout
          className="bg-background container relative flex h-screen items-center justify-center"
        >
          <Icons.load className="size-16 animate-spin md:size-20" />
        </motion.div>
      ) : (
        <div className="space-y-2 md:space-y-4">
          <div className="w-full border-b pb-2">
            <h1 className="text-center text-lg md:text-2xl">管理頁面</h1>
          </div>
          <div className="border-b pb-4">
            <h2 className="md:text-lg">題組設定</h2>
            <CategoryInput
              categories={categories}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              status={isHydrated}
            />
          </div>
          <div className="border-b pb-4">
            <h2 className="md:text-lg">題目設定</h2>
            <QuestInput
              questCount={quests.length}
              categories={categories}
              onCreateQuest={() => handleCreateQuest}
              status={isHydrated}
            />
          </div>
          <QuestTable quests={quests} />
        </div>
      )}
    </section>
  );
};

export default Page;
