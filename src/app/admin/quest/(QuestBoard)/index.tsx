'use client';

import { useEffect, useState } from 'react';
import type { Category, Quest } from '@prisma/client';

import DropIndicator from '../(DropIndicator)';
import { AddQuestCard, QuestCard } from '../(QuestCard)';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
    updateCategory,
    deleteCategory,
  ] = useQuestStore((state) => [
    state.quests,
    state.categories,
    state.getQuests,
    state.createQuest,
    state.updateQuest,
    state.categoriesStatus,
    state.updateCategory,
    state.deleteCategory,
  ]);

  const [editCategory, setEditCategory] = useState<Category | null>();
  const [isOpenDropdown, setIsOpenDropdown] = useState<string>('');

  useEffect(() => {
    getQuests();
  }, [getQuests]);

  const filteredQuests = (categoryId: string) =>
    quests.filter((q) => q.categoryId === categoryId);

  const handleUpdateCategory = async () => {
    if (!editCategory) return;
    await updateCategory(editCategory.id, editCategory.name);
    setEditCategory(null);
  };

  const onDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  return (
    <div className="flex size-full gap-3 overflow-auto p-12">
      {categories?.map((category) => (
        <Card className="bg-[var(--n7)] dark:bg-[var(--n1)]" key={category.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <span>{category.name}</span>
                <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-[var(--n6)] dark:bg-[var(--n3)]">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[var(--n3)] dark:text-[var(--n6)]">
                    {filteredQuests(category.id).length}
                  </span>
                </span>
              </div>
              <DropdownMenu
                key={category.id}
                open={category.id === isOpenDropdown}
                onOpenChange={() => setIsOpenDropdown(category.id)}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant={'ghost'} size={'icon'}>
                    <Icons.menu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={cn('w-56')}>
                  <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-1">
                    <Dialog
                      onOpenChange={(isOpen) =>
                        !isOpen && setIsOpenDropdown('')
                      }
                    >
                      <DialogTrigger>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            setEditCategory(category);
                          }}
                        >
                          編輯
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{category.name}</DialogTitle>
                          <DialogClose />
                        </DialogHeader>
                        <DialogDescription>
                          請輸入新的題庫名稱
                        </DialogDescription>
                        <Label htmlFor={category.id}>編輯題庫名稱</Label>
                        <Input
                          id={category.id}
                          type="text"
                          defaultValue={category.name}
                          value={editCategory?.name}
                          className="disabled:pointer-events-none disabled:opacity-20"
                          disabled={categoriesStatus === 'pending'}
                          onChange={(e) => {
                            setEditCategory({
                              ...category,
                              name: e.target.value,
                            });
                          }}
                        />

                        <DialogFooter>
                          <Button type="button" onClick={handleUpdateCategory}>
                            送出
                          </Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              取消
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      onOpenChange={(isOpen) =>
                        !isOpen && setIsOpenDropdown('')
                      }
                    >
                      <DialogTrigger>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          刪除
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{category.name}</DialogTitle>
                          <DialogClose />
                        </DialogHeader>
                        <DialogDescription>
                          確定要刪除此題庫名稱？
                        </DialogDescription>
                        <DialogFooter>
                          <Button
                            type="submit"
                            variant="destructive"
                            onClick={() => onDeleteCategory(category.id)}
                          >
                            確定
                          </Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              取消
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-4 ">
            <Column
              key={category.id}
              categoryId={category.id}
              quests={quests}
              setQuests={updateQuest}
            />
            <AddQuestCard categoryId={category.id} createQuest={createQuest} />
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
        className={`size-full transition-colors ${
          active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
        }`}
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDropLeave={handleDragLeave}
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
