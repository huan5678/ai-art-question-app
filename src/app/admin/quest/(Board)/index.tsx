'use client';

import {
  type DragEventHandler,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AddQuestCard, QuestCard } from '../(QuestCard)';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useQuestStore from '@/stores/questStore';
import type { Category, ColumnMapping, IQuestState } from '@/types/quest';

const QuestBoard = () => {
  const [quests, categories, createQuest, updateQuestCategory] = useQuestStore(
    (state) => [
      state.quests,
      state.categories,
      state.createQuest,
      state.updateQuestCategory,
    ]
  );

  const [showScroll, setShowScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleDragStart = (
    e: DragEvent,
    data: {
      title: string;
      id: string;
      category: string | null;
      description: string | null;
    }
  ) => {
    (e.dataTransfer as DataTransfer).setData('questId', data.id);
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex max-h-screen max-w-screen-xl justify-stretch gap-3 overflow-auto p-12 transition-all duration-300 ease-in-out',
        showScroll
          ? '[scrollbar-color:initial]'
          : '[scrollbar-color:transparent_transparent]'
      )}
    >
      <Card
        className={cn('relative h-full bg-[var(--n7)] dark:bg-[var(--n1)]')}
      >
        <CardContent className="w-56 shrink-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="allQuests">
              <AccordionTrigger className="w-full">
                <div className="flex gap-2">
                  <span>{'全部題目'}</span>
                  <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-[var(--n6)] dark:bg-[var(--n3)]">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-[var(--n3)] dark:text-[var(--n6)]">
                      {quests.length}
                    </span>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="w-full shrink-0 space-y-2 md:space-y-4">
                {quests.map((q: ColumnMapping) => {
                  return (
                    <QuestCard
                      id={q.id}
                      title={q.title}
                      description={q.description || ''}
                      category={q.category}
                      key={q.id}
                      handleDragStart={handleDragStart}
                      statute={true}
                    />
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <Column
        title="未指定題庫"
        category={null}
        quests={quests.filter((q) => !q.category)}
        updateQuestCategory={updateQuestCategory}
      >
        <AddQuestCard category={null} createQuest={createQuest} />
      </Column>
      {categories?.map((category) => (
        <Column
          title={`題庫 ${category.name}`}
          key={category.id}
          category={category}
          quests={quests.filter((q) => q.category === category.name)}
          updateQuestCategory={updateQuestCategory}
        >
          <AddQuestCard category={category.name} createQuest={createQuest} />
        </Column>
      ))}
    </div>
  );
};

type ColumnProps = {
  quests: ColumnMapping[];
  category: Category | null;
  updateQuestCategory: IQuestState['updateQuestCategory'];
  children?: ReactNode;
  title: string;
};

const Column = ({
  title,
  quests,
  updateQuestCategory,
  children,
  category,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (
    e: DragEvent,
    data: {
      title: string;
      id: string;
      category: string | null;
      description: string | null;
    }
  ) => {
    (e.dataTransfer as DataTransfer).setData('questId', data.id);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const questId = e.dataTransfer?.getData('questId');
    setActive(false);
    if (!questId) return;
    const quest = quests.find((q) => q.id === questId);
    if (quest?.category === category?.name) return;
    await updateQuestCategory({ questId, category: category?.name || null });
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
        'relative h-full bg-[var(--n7)] dark:bg-[var(--n1)]',
        active
          ? 'bg-[var(--n6)] dark:bg-[var(--n3)]'
          : 'bg-[var(--n7)] dark:bg-[var(--n1)]'
      )}
      onDrop={handleDrop as unknown as DragEventHandler}
      onDragOver={handleDragOver as unknown as DragEventHandler}
      onDragEnter={handleDragOver as unknown as DragEventHandler}
      onDragLeave={handleDragLeave}
    >
      <CardHeader
        className={cn('sticky top-0 z-10 bg-[var(--n7)] dark:bg-[var(--n1)]')}
      >
        <div className="flex items-center justify-between">
          <span>{title}</span>
          <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-[var(--n6)] dark:bg-[var(--n3)]">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-[var(--n3)] dark:text-[var(--n6)]">
              {quests.length}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="w-56 shrink-0 space-y-2 p-4 md:space-y-4">
        {quests.map((q: ColumnMapping) => {
          return (
            <QuestCard
              id={q.id}
              title={q.title}
              description={q.description || ''}
              category={q.category}
              key={q.id}
              handleDragStart={handleDragStart}
            />
          );
        })}
        {children}
      </CardContent>
    </Card>
  );
};

export default QuestBoard;
