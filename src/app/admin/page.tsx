'use client';

import { useEffect } from 'react';
import type { Category, Quest } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [quests, categories, setQuests, setCategories] = useQuestStore(
    (state) => [
      state.quests,
      state.categories,
      state.setQuests,
      state.setCategories,
    ]
  );

  console.log(session);
  console.log(quests);

  const handleCreateQuest = useMutationHandler<
    { title: string; description: string; categoryId: string }[],
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
        setQuests((prev: Quest[]) =>
          prev.map((q) => (q.id === data.id ? data : q))
        );
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
        setQuests((prev: Quest[]) => prev.filter((q) => q.id !== data.id));
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
        setCategories((prev: Category[]) =>
          prev.map((c) => (c.id === data.id ? data : c))
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
        setCategories((prev: Category[]) =>
          prev.filter((c) => c.id !== data.id)
        );
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const { data: questsData, status: questsStatus } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await fetch('/api/quest');
      return response.json();
    },
  });

  const { data: categoriesData, status: categoriesStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      return response.json();
    },
  });

  useEffect(() => {
    setQuests(questsData);
    setCategories(categoriesData);
  }, [questsData, categoriesData, setQuests, setCategories]);

  return (
    <section className="container max-w-2xl space-y-4 pt-12 md:max-w-6xl">
      <div className="bg-background rounded-lg p-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="md:text-lg">題目設定</span>
            </AccordionTrigger>
            {questsStatus === 'success' && (
              <AccordionContent className="p-4">
                <QuestInput
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
              <AccordionContent className="p-4">
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
      </div>
    </section>
  );
};

export default Page;
