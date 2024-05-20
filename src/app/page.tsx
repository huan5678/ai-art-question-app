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
  const [quests] = useQuestStore((state) => [state.quests]);
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
    () => quests.filter((quest) => !isSelected.some((q) => q.id === quest.id)),
    [quests, isSelected]
  );

  const animationFrameId = useRef<number | null>(null);

  const getQuestion = async () => {
    try {
      const response = await fetch('/api/notion');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      setLocalStorageSelectedQuests(JSON.stringify(newSelectedQuests));
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
      <section className="py-24 space-y-4">
        <h1 className="text-3xl font-bold tracking-wide text-center text-white">
          {title.mainTitle}
        </h1>
        <h2 className="text-2xl font-bold text-center text-white">
          {title.subTitle}
        </h2>
      </section>
      <section className="container flex flex-col justify-between gap-4 p-8 bg-background rounded-2xl">
        {selectedQuests.length === 0 && (
          <div className="flex flex-col items-end gap-2">
            <p>
              目前題目數:{' '}
              {
                quests.filter(
                  (quest) => !isSelected.some((q) => q.id === quest.id)
                ).length
              }
            </p>
            <Button
              type="button"
              onClick={startPickup}
              disabled={quests.length <= drawCount || isSpinning}
            >
              <Icons.pickup className="mr-2 size-6" />
              隨機抽選
            </Button>
          </div>
        )}
        {isSpinning && <StringSpinner strings={quests} />}
        <div className="flex flex-col w-full gap-4 mx-auto">
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
              <h3 className="mb-2 text-2xl text-center">本次獲選的是</h3>
              <ul className="flex flex-col max-w-screen-lg gap-4 mx-auto mb-2">
                <motion.li className="px-6 py-4 text-lg text-center bg-primary rounded-xl md:text-6xl">
                  {selectedQuests[0].title}
                </motion.li>
              </ul>
              <div className="flex justify-end w-full">
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
        <Button type="button" variant="outline" onClick={getQuestion}>
          Call API
        </Button>
        {isSelected.length > 0 && (
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
