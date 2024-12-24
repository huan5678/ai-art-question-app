import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { X } from 'lucide-react';

import { Button } from '../ui/button';
import { DialogHeader } from '../ui/dialog';
import { Input } from '../ui/input';

import useQuestStore from '@/stores/questStore';
import useConfigurationStore from '@/stores/setupStore';

// components/setup/TitleSettings.tsx
export const TitleSettings = () => {
  const { title, setTitle, drawCount, setDrawCount } = useConfigurationStore();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="header">大標題名稱</Label>
        <Input
          id="header"
          value={title.header}
          onChange={(e) => setTitle({ ...title, header: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mainTitle">主標題名稱</Label>
        <Input
          id="mainTitle"
          value={title.mainTitle}
          onChange={(e) => setTitle({ ...title, mainTitle: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subTitle">副標題名稱</Label>
        <Input
          id="subTitle"
          value={title.subTitle}
          onChange={(e) => setTitle({ ...title, subTitle: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="drawCount">設定一次抽選數量</Label>
        <Input
          id="drawCount"
          type="number"
          value={drawCount}
          onChange={(e) => setDrawCount(Number(e.target.value))}
          min={1}
        />
      </div>
    </div>
  );
};

// components/setup/QuestSelector.tsx
export const QuestSelector = () => {
  const { categories, getQuestsByCategory } = useQuestStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">選擇題組</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            onClick={() => getQuestsByCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

// components/setup/QuestDataDialog.tsx
export const QuestDataDialog = () => {
  const { setQuestsList } = useQuestStore();
  const questsList = useQuestStore((state) => state.questsList);

  const handleRemoveQuest = (id: string) => {
    setQuestsList(questsList.filter((quest) => quest.id !== id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">顯示題庫資料集</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>題庫資料集</DialogTitle>
          <DialogDescription>目前題庫資料集的項目:</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <ul className="space-y-2">
            {questsList.map((quest) => (
              <li
                key={quest.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span>{quest.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleRemoveQuest(quest.id);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
