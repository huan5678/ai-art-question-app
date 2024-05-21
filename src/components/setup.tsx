'use client';
import { Bolt, X } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
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
import useQuestStore from '@/stores/questStore';
import useConfigurationStore from '@/stores/setupStore';

const Setup = () => {
  const [title, setTitle] = useConfigurationStore((state) => [
    state.title,
    state.setTitle,
  ]);
  const [drawCount, setDrawCount] = useConfigurationStore((state) => [
    state.drawCount,
    state.setDrawCount,
  ]);
  const [quests, questsList, categories, questsStatus, categoriesStatus] =
    useQuestStore((state) => [
      state.quests,
      state.questsList,
      state.categories,
      state.questsStatus,
      state.categoriesStatus,
    ]);

  const StatusSuccess =
    questsStatus === 'success' && categoriesStatus === 'success';
  console.log(
    'quests =',
    quests,
    'questsStatus =',
    questsStatus,
    'categoriesStatus =',
    categoriesStatus
  );
  return (
    StatusSuccess && (
      <div className="absolute bottom-0 right-0 mb-2 flex w-full -translate-x-4 -translate-y-4 items-center justify-end gap-4 text-white opacity-75">
        <Drawer>
          <DrawerTrigger className="grid place-content-center">
            <Bolt className="mx-auto size-8" />
            系統設定
          </DrawerTrigger>
          <DrawerContent className="max-w-screen container">
            <DrawerHeader>
              <DrawerTitle>輸入模式</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>App參數相關設定。</DrawerDescription>
            <div className="flex justify-between">
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
                        setTitle({ mainTitle: e.target.value })
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
                        setTitle({
                          subTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="drawCount" className="block text-lg">
                      設定一次抽選數量
                    </Label>
                    <Input
                      id="drawCount"
                      type="number"
                      value={drawCount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDrawCount(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-center text-lg">選擇題組</h3>
                    <div className="flex gap-4">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={'outline'}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4 md:flex md:w-auto md:justify-center">
                  <Dialog>
                    <DialogTrigger className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      顯示題庫資料集
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-4xl">
                          題庫資料集
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        目前題庫資料集的項目:
                      </DialogDescription>
                      <ul className="flex max-h-[75vh] flex-col gap-3 overflow-auto">
                        {questsList.map((quest, index) => (
                          <li
                            className={`flex items-center justify-between p-2 transition duration-300 ${
                              index === questsList.length - 1
                                ? ''
                                : 'border-primary-foreground border-b-2'
                            }`}
                            key={quest.id}
                          >
                            {quest.title}
                            <div className="group rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-red-500">
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
                    >
                      清空題庫資料集
                    </Button>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <DrawerFooter>
              <DrawerClose>關閉</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    )
  );
};
export default Setup;
