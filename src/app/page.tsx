'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Quest } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocalStorage } from 'usehooks-ts';

import CircularAnimation from '@/components/CircularAnimation';
import Footer from '@/components/footer';
import { Icons } from '@/components/icons';
import Setup from '@/components/setup';
import StringSpinner from '@/components/StringSpinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useConfetti from '@/hooks/useConfetti';
import { cn } from '@/lib/utils';
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
  const [questsList, questsStatus] = useQuestStore((state) => [
    state.questsList,
    state.questsStatus,
  ]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false); // 新增hydration狀態
  const [localStorageSelectedQuests, setLocalStorageSelectedQuests] =
    useLocalStorage('selectedQuests', [] as Quest[]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // 過濾出未選中的項目
  const unselectedData = useMemo(
    () =>
      questsList?.filter(
        (quest) => !localStorageSelectedQuests.some((q) => q.id === quest.id)
      ),
    [questsList, localStorageSelectedQuests]
  );
  const { confettiAction } = useConfetti();
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
      confettiAction();
      const newSelectedQuests = selectedIndexes.map(
        (index) => unselectedData[index]
      );
      const historySelectedQuests = [
        ...localStorageSelectedQuests,
        ...newSelectedQuests,
      ];
      const updatedSelectedQuests = [...selectedQuests, ...newSelectedQuests];
      setSelectedQuests(updatedSelectedQuests);
      setLocalStorageSelectedQuests(historySelectedQuests);
      setOpenDialog(true);
    },
    [
      unselectedData,
      localStorageSelectedQuests,
      selectedQuests,
      setSelectedQuests,
      setLocalStorageSelectedQuests,
      confettiAction,
    ]
  );

  const startPickup = () => {
    if (unselectedData.length === 0) return;
    setIsSpinning(true);
    animate();

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
    questsStatus === 'success' && setIsHydrated(true);
  }, [questsStatus]);

  return (
    <div
      className={cn(
        'relative bg-gradient-to-b from-black/90 via-black/10 to-black/90'
      )}
    >
      <Image
        src="/images/bg.jpg"
        fill
        layout="fill"
        objectFit="cover"
        alt="Background Image"
        className="z-[-1]"
      />
      <main className="flex h-screen flex-col py-4 md:py-8">
        <h1 className="text-center text-[4vmax] font-black text-white/50 md:text-[8vmax] dark:text-white">
          2024 台灣 AI 生成大賽
        </h1>
        <div className="flex justify-center gap-4 text-lg text-white/50 md:-translate-y-6 md:text-6xl dark:text-white">
          <p>{title.mainTitle}</p>
          <p>{title.subTitle}</p>
        </div>
        <motion.section
          layout
          className="bg-background container relative z-10 flex flex-auto flex-col justify-between gap-4 rounded-2xl p-8"
        >
          {!isHydrated ? (
            <motion.div
              layout
              className="bg-background container relative flex h-screen items-center justify-center"
            >
              <Icons.load className="size-16 animate-spin md:size-20" />
            </motion.div>
          ) : (
            <>
              <p className="ms-auto">目前題目數: {unselectedData?.length}</p>
              {selectedQuests.length === 0 && !isSpinning && (
                <div className="flex flex-col items-end gap-2">
                  <CircularAnimation
                    title="隨機抽選"
                    onClick={startPickup}
                    disabled={unselectedData?.length <= drawCount}
                  >
                    <Icons.pickup
                      className={cn(
                        'size-16 origin-center',
                        unselectedData?.length <= drawCount
                          ? 'opacity-25'
                          : '-rotate-12'
                      )}
                    />
                  </CircularAnimation>
                </div>
              )}
              {isSpinning && <StringSpinner strings={unselectedData} />}
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-xl md:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl md:text-4xl">
                      抽選結果
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="w-full text-end text-base">
                    獲選的是
                  </DialogDescription>
                  <motion.ul
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-6"
                  >
                    {selectedQuests.map((item) => (
                      <motion.li
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-4xl md:text-8xl"
                        key={item.id}
                      >
                        {item.title}
                      </motion.li>
                    ))}
                  </motion.ul>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        className="w-full"
                        type="button"
                        variant="secondary"
                      >
                        關閉
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {selectedQuests.length > 0 && (
                <div>
                  <h3 className="mb-2 text-center text-2xl">本次獲選的是</h3>
                  <motion.ul
                    layout
                    className="mx-auto mb-2 flex max-w-screen-lg flex-col gap-4"
                  >
                    {selectedQuests.map((quest) => (
                      <motion.li
                        key={quest.id}
                        className="space-y-2 rounded-xl border px-6 py-4 shadow md:space-y-4"
                      >
                        <motion.h3
                          layout
                          className="text-center text-4xl md:text-8xl"
                        >
                          {quest.title}
                        </motion.h3>
                        <motion.span
                          layout
                          className="block text-center text-base font-light text-[var(--n5)] md:text-2xl"
                        >
                          {quest.description}
                        </motion.span>
                      </motion.li>
                    ))}
                  </motion.ul>
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
              <div className="relative flex justify-end gap-4">
                {localStorageSelectedQuests.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline">
                        察看歷史項目
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-4xl">
                          已選擇的項目
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>目前已抽選過的項目:</DialogDescription>
                      <ul className="space-y-2">
                        {localStorageSelectedQuests.map((item) => (
                          <li className="text-2xl" key={item.id}>
                            {item.title}
                          </li>
                        ))}
                      </ul>
                      <DialogFooter className="border-t pt-6">
                        <Button
                          type="button"
                          variant={'destructive'}
                          onClick={() => setLocalStorageSelectedQuests([])}
                        >
                          重置選擇
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Setup />
              </div>
            </>
          )}
        </motion.section>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
