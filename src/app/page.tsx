'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Quest } from '@prisma/client';
import { motion } from 'framer-motion';
import { useLocalStorage } from 'usehooks-ts';

import Confetti from '@/components/Confetti';
import { Icons } from '@/components/icons';
import Setup from '@/components/setup';
import StringSpinner from '@/components/StringSpinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useQuestStore from '@/stores/questStore';
import useConfigurationStore from '@/stores/setupStore';

const Home = () => {
  const [title, drawCount, selectedQuests, setSelectedQuests] =
    useConfigurationStore((state) => [
      state.title,
      state.drawCount,
      state.selectedQuests,
      state.setSelectedQuests,
    ]);
  const [quests, questsList] = useQuestStore((state) => [
    state.quests,
    state.questsList,
  ]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [localStorageSelectedQuests, setLocalStorageSelectedQuests] =
    useLocalStorage('selectedQuests', [] as Quest[]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<Quest[]>(
    localStorageSelectedQuests || []
  );
  // 過濾出未選中的項目
  const unselectedData = useMemo(
    () =>
      questsList?.filter((quest) => !isSelected.some((q) => q.id === quest.id)),
    [questsList, isSelected]
  );

  const animationFrameId = useRef<number | null>(null);

  const animate = () => {
    const update = () => {
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);
  };

  const stopPickup = useCallback(
    (selectedIndexes: number[]) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setIsSpinning(false);
      setShowConfetti(true);
      const newSelectedQuests = [...selectedQuests];
      for (const index of selectedIndexes) {
        const selectedData = quests[index];
        newSelectedQuests.push(selectedData);
      }
      setSelectedQuests(newSelectedQuests);
      setLocalStorageSelectedQuests(newSelectedQuests);
      setOpenDialog(true);
    },
    [quests, selectedQuests, setSelectedQuests, setLocalStorageSelectedQuests]
  );

  const startPickup = () => {
    if (quests.length === 0) return;
    setShowConfetti(false);
    setIsSpinning(true);
    animate();
    // 預先選擇指定數量的隨機索引
    const selectedIndexes: number[] = [];
    while (
      selectedIndexes.length < drawCount &&
      selectedIndexes.length < unselectedData.length
    ) {
      const randomIndex = Math.floor(Math.random() * unselectedData.length);
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex);
      }
    }

    // 更新選中的項目狀態
    const newSelected = [...isSelected];
    for (const index of selectedIndexes) {
      const selectedData = unselectedData[index];
      newSelected.push(selectedData);
    }
    setIsSelected(newSelected);

    // 在2秒後停止動畫,並一次性顯示所有選擇的結果
    setTimeout(() => {
      stopPickup(selectedIndexes);
    }, 2000);
  };
  useEffect(() => {
    // 當組件卸載時，清除動畫
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedQuests', JSON.stringify(isSelected));
  }, [isSelected]);
  return (
    <div>
      <section className="space-y-4 py-24">
        <h1 className="text-center text-3xl font-bold tracking-wide text-white">
          {title.mainTitle}
        </h1>
        <h2 className="text-center text-2xl font-bold text-white">
          {title.subTitle}
        </h2>
      </section>
      <section className="bg-background container flex flex-col justify-between gap-4 rounded-2xl p-8">
        {selectedQuests.length === 0 && (
          <div className="flex flex-col items-end gap-2">
            <p>
              目前題目數:{' '}
              {
                quests?.filter(
                  (quest) => !isSelected.some((q) => q.id === quest.id)
                ).length
              }
            </p>
            <Button
              type="button"
              onClick={startPickup}
              disabled={unselectedData?.length <= drawCount || isSpinning}
            >
              <Icons.pickup className="mr-2 size-6" />
              隨機抽選
            </Button>
          </div>
        )}
        {isSpinning && <StringSpinner strings={unselectedData} />}
        <div className="mx-auto flex w-full flex-col gap-4">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-4xl">抽選結果</DialogTitle>
              </DialogHeader>
              <DialogDescription>獲選的是:</DialogDescription>
              <ul>
                {selectedQuests.map((item) => (
                  <li className="text-2xl" key={item.id}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
          {selectedQuests.length > 0 && (
            <div>
              <h3 className="mb-2 text-center text-2xl">本次獲選的是</h3>
              <ul className="mx-auto mb-2 flex max-w-screen-lg flex-col gap-4">
                <motion.li className="bg-primary rounded-xl px-6 py-4 text-center text-lg md:text-6xl">
                  {selectedQuests[0].title}
                </motion.li>
              </ul>
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedQuests([])}
                >
                  清空
                </Button>
              </div>
            </div>
          )}
          {showConfetti && <Confetti />}
        </div>
        {isSelected.length > 0 && (
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <div className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  察看歷史項目
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-4xl">已選擇的項目</DialogTitle>
                </DialogHeader>
                <DialogDescription>目前已抽選過的項目:</DialogDescription>
                <ul className="space-y-2">
                  {isSelected.map((item) => (
                    <li className="text-2xl" key={item.id}>
                      {item.title}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
        )}
        <Setup />
      </section>
    </div>
  );
};

export default Home;
