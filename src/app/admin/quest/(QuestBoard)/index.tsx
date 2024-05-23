'use client';

import { useEffect, useState } from 'react';
import type { Quest } from '@prisma/client';

import DropIndicator from '../(DropIndicator)';
import { AddQuestCard, QuestCard } from '../(QuestCard)';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useQuestStore from '@/stores/questStore';
import type { IQuestState, QuestType } from '@/types/quest';

const QuestBoard = () => {
  const [
    quests,
    categories,
    getQuests,
    createQuest,
    updateQuest,
    categoriesStatus,
    questsStatus,
  ] = useQuestStore((state) => [
    state.quests,
    state.categories,
    state.getQuests,
    state.createQuest,
    state.updateQuest,
    state.categoriesStatus,
    state.questsStatus,
  ]);

  useEffect(() => {
    getQuests();
  }, [getQuests]);

  const filteredQuests = (categoryId: string) =>
    quests.filter((q) => q.categoryId === categoryId);

  return (
    <div className="flex gap-3 p-12 overflow-auto size-full">
      {categoriesStatus === 'success' &&
        questsStatus === 'success' &&
        categories.map((category) => (
          <Card key={category.id}>
            <CardHeader
            >
              <div
              className="flex items-center justify-between">
              <span>{category.name}</span>
              <span>{filteredQuests(category.id).length}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Column
                key={category.id}
                categoryId={category.id}
                quests={quests}
                setQuests={updateQuest}
              />
              <AddQuestCard
                categoryId={category.id}
                createQuest={createQuest}
              />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

type ColumnProps = {
  quests: Quest[];
  categoryId: string;
  setQuests: IQuestState['updateQuest'];
};

const Column = ({ quests, categoryId, setQuests }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, quest: QuestType) => {
    (e.dataTransfer as DataTransfer).setData('questId', quest.id);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const questId = e.dataTransfer?.getData('questId');
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || '-1';

    if (before !== questId) {
      let copy = [...quests];

      let questToTransfer = copy.find((q) => q.id === questId);
      if (!questToTransfer) return;
      questToTransfer = { ...questToTransfer, categoryId };

      copy = copy.filter((q) => q.id !== questId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(questToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, questToTransfer);
      }

      setQuests({ ...questToTransfer, categoryId });
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    for (const i of indicators) {
      i.style.opacity = '0';
    }
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = '1';
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${categoryId}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredQuests = quests.filter((q) => q.categoryId === categoryId);

  return (
    <div className="w-56 shrink-0">
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`size-full transition-colors ${
          active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
        }`}
      >
        {filteredQuests.map((q) => {
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
        <DropIndicator beforeId={null} categoryId={categoryId} />
      </div>
    </div>
  );
};

export default QuestBoard;
