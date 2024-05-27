'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

import QuestTable from './(QuestTable)';

import { Icons } from '@/components/icons';
import CategoryInput from '@/components/input/categoryInput';
import QuestInput from '@/components/input/questInput';
import useQuestStore from '@/stores/questStore';

const Page = () => {
  const [
    createQuest,
    updateQuest,
    deleteQuest,
    createCategory,
    updateCategory,
    deleteCategory,
    questsStatus,
    quests,
    categories,
    categoriesStatus,
  ] = useQuestStore((state) => [
    state.createQuest,
    state.updateQuest,
    state.deleteQuest,
    state.createCategory,
    state.updateCategory,
    state.deleteCategory,
    state.questsStatus,
    state.quests,
    state.categories,
    state.categoriesStatus,
  ]);

  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();

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

  const handleUpdateQuest = ({
    id,
    title,
    description,
    categoryId,
  }: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
  }) => {
    updateQuest({ id, title, description, categoryId });
  };

  const handleDeleteQuest = (id: string) => {
    deleteQuest(id);
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

  return (
    <section className="bg-background max-h-screen overflow-y-auto rounded-lg p-8">
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
