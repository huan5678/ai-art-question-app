'use client';

import { useEffect, useState } from 'react';
import type { Category, Quest } from '@prisma/client';
import { motion } from 'framer-motion';

import { Icons } from '@/components/icons';
import CategoryInput from '@/components/input/categoryInput';
import QuestInput from '@/components/input/questInput';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import useMutationHandler from '@/hooks/useMutationHandler';
import useQuestStore from '@/stores/questStore';

const Page = () => {
  const [
    quests,
    categories,
    setQuests,
    setCategories,
    questsStatus,
    categoriesStatus,
  ] = useQuestStore((state) => [
    state.quests,
    state.categories,
    state.setQuests,
    state.setCategories,
    state.questsStatus,
    state.categoriesStatus,
  ]);

  const [isHydrated, setIsHydrated] = useState(false);

  const handleCreateQuest = useMutationHandler<
    {
      data: { title: string; description: string; categoryId: string | null }[];
      userId: string;
    },
    Quest[]
  >({
    url: '/api/quest',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        setQuests(data);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const handleUpdateQuest = useMutationHandler<
    { id: string; title: string; description: string; categoryId: string },
    Quest
  >({
    url: '/api/quest',
    method: 'PATCH',
    options: {
      onSuccess: (data) => {
        const currentQuests = quests;
        setQuests(currentQuests.map((q) => (q.id === data.id ? data : q)));
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const handleDeleteQuest = useMutationHandler<string, Quest>({
    url: '/api/quest',
    method: 'DELETE',
    options: {
      onSuccess: (data) => {
        const currentQuests = quests;
        setQuests(currentQuests.filter((q) => q.id !== data.id));
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const handleCreateCategory = useMutationHandler<string, Category[]>({
    url: '/api/category',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        setCategories(data);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const handleUpdateCategory = useMutationHandler<
    { id: string; name: string },
    Category
  >({
    url: '/api/category',
    method: 'PATCH',
    options: {
      onSuccess: (data) => {
        const currentCategories = categories;
        setCategories(
          currentCategories.map((c) => (c.id === data.id ? data : c))
        );
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const handleDeleteCategory = useMutationHandler<string, Category>({
    url: '/api/category',
    method: 'DELETE',
    options: {
      onSuccess: (data) => {
        const currentCategories = categories;
        setCategories(currentCategories.filter((c) => c.id !== data.id));
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  useEffect(() => {
    questsStatus === 'success' && setIsHydrated(true);
  }, [questsStatus]);

  return (
    <section className="max-h-screen p-8 overflow-y-auto rounded-lg bg-background">
      {!isHydrated ? (
        <motion.div
          layout
          className="container relative flex items-center justify-center h-screen bg-background"
        >
          <Icons.load className="size-24 animate-spin" />
        </motion.div>
      ) : (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="md:text-lg">題目設定</span>
            </AccordionTrigger>
            {questsStatus === 'success' && (
              <AccordionContent className="px-2">
                <QuestInput
                  quests={quests}
                  categories={categories}
                  onCreateQuest={handleCreateQuest.mutate}
                  isCreatePending={handleCreateQuest.isPending}
                  isUpdatePending={handleUpdateQuest.isPending}
                  isDeletePending={handleDeleteQuest.isPending}
                />
              </AccordionContent>
            )}
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="md:text-lg">題組設定</span>
            </AccordionTrigger>
            {categoriesStatus === 'success' && (
              <AccordionContent className="px-2">
                <CategoryInput
                  categories={categories}
                  onCreateCategory={handleCreateCategory.mutate}
                  onUpdateCategory={handleUpdateCategory.mutate}
                  onDeleteCategory={handleDeleteCategory.mutate}
                  isCreatePending={handleCreateCategory.isPending}
                  isUpdatePending={handleUpdateCategory.isPending}
                  isDeletePending={handleDeleteCategory.isPending}
                />
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </section>
  );
};

export default Page;
