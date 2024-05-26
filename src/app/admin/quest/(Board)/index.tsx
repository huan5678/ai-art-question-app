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
    <div className="flex gap-3 p-12 overflow-x-scroll overflow-y-auto size-full">
      <Column
        title="未指定題庫"
        categoryId={null}
        quests={quests}
        setQuests={updateQuest}
        showMenu={false}
      >
        <AddQuestCard categoryId={null} createQuest={createQuest} />
      </Column>
      {categories?.map((category) => (
        <Column
          title={category.name}
          key={category.id}
          categoryId={category.id}
          quests={quests}
          setQuests={updateQuest}
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
  setQuests: IQuestState['updateQuest'];
  children?: ReactNode;
  title: string;
  showMenu: boolean;
  category?: Category;
};

const Column = ({
  title,
  quests,
  categoryId,
  setQuests,
  showMenu = false,
  children,
  category,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const filteredQuests = (categoryId: string | null) =>
    quests?.filter((q) => q.categoryId === categoryId);

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
      await setQuests({
        ...questToUpdate,
        categoryId: categoryId ? categoryId : null,
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
          <div className="flex gap-4">
            <span>{title}</span>
            <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-[var(--n6)] dark:bg-[var(--n3)]">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[var(--n3)] dark:text-[var(--n6)]">
                {filteredQuests(categoryId)?.length}
              </span>
            </span>
          </div>
          {showMenu && <QuestColumnMenu category={category as Category} />}
        </div>
      </CardHeader>
      <CardContent className="w-56 p-4 space-y-2 shrink-0 md:space-y-4">
        {filteredQuests(categoryId)?.map((q: Quest) => {
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
