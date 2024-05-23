'use client';

import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Category, Quest } from '@prisma/client';
import { motion } from 'framer-motion';

import { Icons } from '@/components/icons';
import QuestInput from '@/components/input/questInput';
import useMutationHandler from '@/hooks/useMutationHandler';
import useQuestStore from '@/stores/questStore';

const QuestBoard = () => {
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

  const handleGetQuests = useMutationHandler<void, Quest[]>({
    url: '/api/quest',
    method: 'GET',
    options: {
      onSuccess: (data) => {
        setQuests(data);
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

  return (
    <div className="flex gap-3 p-12 overflow-auto size-full">
      {categories.map((category) => (
        <Column
          key={category.id}
          title={category.name}
          categoryId={category.id}
          headingColor="text-neutral-500"
          quests={quests}
          setQuests={setQuests}
          getQuests={handleGetQuests}
        />
      ))}
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  quests: Quest[];
  categoryId: string;
  setQuests: Dispatch<SetStateAction<Quest[]>>;
  getQuests: () => void;
};

const Column = ({
  title,
  headingColor,
  quests,
  categoryId,
  setQuests,
  getQuests,
}: ColumnProps) => {
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

      setQuests(copy);

      // Update the quest category in the database
      await fetch(`/api/quest`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...questToTransfer, categoryId }),
      });
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
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="text-sm rounded text-neutral-400">
          {filteredQuests.length}
        </span>
      </div>
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
            <Card
              key={q.id}
              {...q}
              handleDragStart={(e, quest) =>
                handleDragStart(e, { ...quest, categoryId })
              }
            />
          );
        })}
        <DropIndicator beforeId={null} categoryId={categoryId} />
        <AddCard getQuests={getQuests} setQuests={setQuests} />
      </div>
    </div>
  );
};

type CardProps = QuestType & {
  handleDragStart: (
    e: DragEvent,
    data: { title: string; id: string; categoryId: string }
  ) => void;
};

const Card = ({ title, id, categoryId, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} categoryId={categoryId} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: DragEvent) =>
          handleDragStart(e, { title, id, categoryId })
        }
        className="p-3 border rounded cursor-grab border-neutral-700 bg-neutral-800 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  categoryId: string;
};

const DropIndicator = ({ beforeId, categoryId }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || '-1'}
      data-column={categoryId}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

type AddCardProps = {
  getQuests: () => void;
  setQuests: (quests: Quest[]) => void;
};

const AddCard = ({ getQuests, setQuests }: AddCardProps) => {
  const [adding, setAdding] = useState(false);

  const [quests, categories, questsStatus] = useQuestStore((state) => [
    state.quests,
    state.categories,
    state.questsStatus,
  ]);

  const handleCreateQuest = useMutationHandler<
    {
      data: { title: string; description: string; categoryId: string }[];
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


  return (
    <>
      {adding && questsStatus === 'success' && (
            <QuestInput
              quests={quests}
              categories={categories}
              onCreateQuest={handleCreateQuest.mutate}
              isCreatePending={handleCreateQuest.isPending}
              isUpdatePending={handleUpdateQuest.isPending}
              isDeletePending={handleDeleteQuest.isPending}
            />
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <Icons.plus />
        </motion.button>
      )}
    </>
  );
};

type ColumnType = string; // Updated to string type
type QuestType = {
  title: string;
  id: string;
  categoryId: ColumnType;
};

export default QuestBoard;
