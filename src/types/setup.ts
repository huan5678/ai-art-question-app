import type { Quest } from '@/types/quest';

export type IConfigurationState = {
  title: {
    mainTitle: string;
    subTitle: string;
  };
  drawCount: number;
  selectedQuests: Quest[];
  setTitle: (title: { mainTitle?: string; subTitle?: string }) => void;
  setDrawCount: (drawCount: number) => void;
  setSelectedQuests: (selectedQuests: Quest[]) => void;
};
