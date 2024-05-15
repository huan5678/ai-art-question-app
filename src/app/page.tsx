'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import Confetti from '@/components/Confetti';
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import type { IConfig, IQuest } from '@/types/quest';

const Home = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState({
    mainTitle: '出題系統',
    subTitle: '隨機抽選問題',
  });
  const [config, setConfig] = useState<IConfig>({
    drawCount: 1,
    selectedStrings: [],
  });
  const [quests, setQuests] = useState<IQuest[]>([]);
  const [input, setInput] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const animationFrameId = useRef<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleOnKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddString();
  };

  const addQuest = async (questName: string) => {
    try {
      const questNameArr = questName.split(',');

      const newQuests = questNameArr.map((name) => ({
        _id: crypto.randomUUID(),
        name,
        selected: false,
      }));

      setQuests((prevQuests) => [...prevQuests, ...newQuests]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearSelectStrings = () => {
    setConfig({ ...config, selectedStrings: [] });
  };

  const handleAddString = () => {
    if (input.trim() !== '') {
      addQuest(input.trim());
      setInput('');
      toast({
        title: '新增成功',
        description: `已新增 "${input.trim()}" 到資料集`,
      });
    } else {
      toast({
        title: '新增失敗',
        description: '請輸入字串',
        variant: 'destructive',
      });
    }
  };

  const animate = () => {
    const update = () => {
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);
  };

  const startAnimation = () => {
    if (quests.length === 0) return;
    setShowConfetti(false);
    setIsSpinning(true);
    animate();

    // 過濾出未選中的問題
    const unselectedQuests = quests.filter((quest) => !quest.selected);

    // 預先選擇指定數量的隨機索引
    const selectedIndexes: number[] = [];
    while (
      selectedIndexes.length < config.drawCount &&
      selectedIndexes.length < unselectedQuests.length
    ) {
      const randomIndex = Math.floor(Math.random() * unselectedQuests.length);
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex);
      }
    }

    // 更新選中的問題
    setQuests((prevQuests) => {
      const newQuests = [...prevQuests];
      return newQuests;
    });
  };
  useEffect(() => {
    // 當組件卸載時，清除動畫
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
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
        {config.selectedStrings.length === 0 && (
          <div className="flex flex-col items-end gap-2">
            <p>目前題目數: {quests.filter((q) => !q.selected).length}</p>
            <Button
              type="button"
              onClick={startAnimation}
              disabled={quests.length <= config.drawCount || isSpinning}
            >
              隨機抽選
            </Button>
          </div>
        )}
        {isSpinning && <StringSpinner strings={quests} />}
        <div className="mx-auto flex w-full flex-col gap-4">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-4xl">抽選結果</DialogTitle>
              </DialogHeader>
              <DialogDescription>獲選的是:</DialogDescription>
              <ul>
                {config.selectedStrings.map((item) => (
                  <li className="text-2xl" key={item.name}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
          {config.selectedStrings.length > 0 && (
            <div>
              <h3 className="mb-2 text-center text-2xl">本次獲選的是</h3>
              <ul className="mx-auto mb-2 flex max-w-screen-lg flex-col gap-4">
                <motion.li className="bg-primary rounded-xl px-6 py-4 text-center text-lg md:text-6xl">
                  {config.selectedStrings[0].name}
                </motion.li>
              </ul>
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClearSelectStrings()}
                >
                  清空
                </Button>
              </div>
            </div>
          )}
          {showConfetti && <Confetti />}
        </div>
        {quests.filter((q) => q.selected).length > 0 && (
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
                  {quests
                    .filter((q) => q.selected)
                    .map((item) => (
                      <li className="text-2xl" key={item.name}>
                        {item.name}
                      </li>
                    ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>
      <div className="absolute bottom-0 right-0 mb-2 flex w-full -translate-x-4 -translate-y-4 items-center justify-end gap-4 text-white opacity-25">
        <Drawer>
          <DrawerTrigger>設定</DrawerTrigger>
          <DrawerContent className="max-w-screen container">
            <DrawerHeader>
              <DrawerTitle>輸入模式</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>App參數相關設定。</DrawerDescription>
            <div className="flex flex-col items-end justify-between gap-8 py-8 md:flex-row">
              <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Label htmlFor="mainTitle" className="block text-lg">
                    標題名稱
                  </Label>
                  <Input
                    id="mainTitle"
                    type="text"
                    value={title.mainTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTitle((prev) => ({
                        ...prev,
                        mainTitle: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <Label htmlFor="subTitle" className="block text-lg">
                    副標題名稱
                  </Label>
                  <Input
                    id="subTitle"
                    type="text"
                    value={title.subTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTitle((prev) => ({
                        ...prev,
                        subTitle: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-center text-lg">抽選數量</h3>
                  <Input
                    type="number"
                    value={config.drawCount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfig((prev) => ({
                        ...prev,
                        drawCount: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-4 md:flex md:w-auto md:justify-center">
                <Dialog>
                  <DialogTrigger className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    顯示資料集
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-4xl">資料集</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>目前資料集的項目:</DialogDescription>
                    <ul className="flex max-h-[75vh] flex-col gap-3 overflow-auto">
                      {quests.map((item, index) => (
                        <li
                          className={`flex items-center justify-between p-2 transition duration-300 ${
                            index === quests.length - 1
                              ? ''
                              : 'border-primary-foreground border-b-2'
                          }`}
                          key={item.name}
                        >
                          {item.name}
                          <div
                            className="group rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-red-500"
                            onClick={() =>
                              setQuests((prev) =>
                                prev.filter((q) => q._id !== item._id)
                              )
                            }
                            onKeyUp={(e) => {
                              if (e.key === 'Delete') {
                                setQuests((prev) =>
                                  prev.filter((q) => q._id !== item._id)
                                );
                              }
                            }}
                          >
                            <X className="size-6 text-red-500 transition duration-300 group-hover:text-white" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </DialogContent>
                </Dialog>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    type="button"
                    id="clearQuest"
                    className="w-full md:w-auto"
                    variant={'destructive'}
                    onClick={() => setQuests([])}
                  >
                    清空資料集
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="input" className="text-center text-lg">
                手動輸入題目名稱
              </Label>
              <div className="flex flex-wrap gap-4 md:flex-nowrap">
                <Input
                  id="input"
                  type="text"
                  placeholder="輸入字串，支援使用英文小寫逗號','進行多項目的新增。"
                  value={input}
                  onChange={handleInputChange}
                  onKeyUp={handleOnKeyEnter}
                />
                <Button className="w-full md:w-auto" onClick={handleAddString}>
                  新增選項
                </Button>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose>關閉</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
