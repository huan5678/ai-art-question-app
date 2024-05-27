'use client';

import { type DragEventHandler, type ReactNode, useState } from 'react';
import type { Category, Quest } from '@prisma/client';

import { AddQuestCard, QuestCard } from '../(QuestCard)';
import QuestColumnMenu from '../(QuestColumnMenu)';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';
import type { IQuestState, QuestType } from '@/types/quest';

const QuestBoard = () => {
  const [quests, categories, createQuest, updateQuest] = useQuestStore(
    (state) => [
      state.quests,
      state.categories,
      state.createQuest,
      state.updateQuest,
    ]
  );

  return (
    <div className="flex size-full gap-3 overflow-y-auto overflow-x-scroll p-12">
      <Column
        title="全部題目"
        categoryId={null}
        quests={quests}
        updateQuest={updateQuest}
        showMenu={false}
      />
      <Column
        title="未指定題庫"
        categoryId={null}
        quests={quests.filter((q) => !q.categoryId)}
        updateQuest={updateQuest}
        showMenu={false}
      >
        <AddQuestCard categoryId={null} createQuest={createQuest} />
      </Column>
      {categories?.map((category) => (
        <Column
          title={category.name}
          key={category.id}
          categoryId={category.id}
          quests={quests.filter((q) => q.categoryId === category.id)}
          updateQuest={updateQuest}
          showMenu={true}
          category={category}
        >
          <AddQuestCard categoryId={category.id} createQuest={createQuest} />
        </Column>
      ))}
    </div>
  );
};

type ColumnProps = {
  quests: Quest[];
  categoryId: string | null;
  updateQuest: IQuestState['updateQuest'];
  children?: ReactNode;
  title: string;
  showMenu: boolean;
  category?: Category;
};

const Column = ({
  title,
  quests,
  categoryId,
  updateQuest,
  showMenu = false,
  children,
  category,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const [updateCategory, deleteCategory] = useQuestStore((state) => [
    state.updateCategory,
    state.deleteCategory,
  ]);

  const handleDragStart = (e: DragEvent, quest: QuestType) => {
    (e.dataTransfer as DataTransfer).setData('questId', quest.id);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const questId = e.dataTransfer?.getData('questId');
    setActive(false);

    const questToUpdate = quests.find((q) => q.id === questId);
    if (!questToUpdate) return;

    if (questToUpdate.categoryId !== categoryId) {
      await updateQuest({
        ...questToUpdate,
        categoryId,
      });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  return (
    <Card
      className={cn(
        'bg-[var(--n7)] dark:bg-[var(--n1)]',
        active
          ? 'bg-[var(--n6)] dark:bg-[var(--n3)]'
          : 'bg-[var(--n7)] dark:bg-[var(--n1)]'
      )}
      onDrop={handleDrop as unknown as DragEventHandler}
      onDragOver={handleDragOver as unknown as DragEventHandler}
      onDragEnter={handleDragOver as unknown as DragEventHandler}
      onDragLeave={handleDragLeave}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span>{title}</span>
            <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-[var(--n6)] dark:bg-[var(--n3)]">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-[var(--n3)] dark:text-[var(--n6)]">
                {quests.length}
              </span>
            </span>
          </div>
          {showMenu && (
            <QuestColumnMenu
              category={category as Category}
              onEdit={(data) => updateCategory(data.id, data.name)}
              onDelete={(categoryId: string) => deleteCategory(categoryId)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="w-56 shrink-0 space-y-2 p-4 md:space-y-4">
        {quests.map((q: Quest) => {
          return (
            <QuestCard
              key={q.id}
              {...q}
              handleDragStart={(e, quest) =>
                handleDragStart(e, { ...quest, categoryId })
              }
            />
          );
        })}
        {children}
      </CardContent>
    </Card>
  );
};

export default QuestBoard;
