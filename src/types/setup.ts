import type { Quest } from '@/types/quest';

export type IConfigurationState = {
  title: {
    header: string;
    mainTitle: string;
    subTitle: string;
  };
  drawCount: number;
  showIndex: boolean;
  selectedQuests: Quest[];
  setTitle: (title: {
    header: string;
    mainTitle: string;
    subTitle: string;
  }) => void;
  setDrawCount: (drawCount: number) => void;
  setSelectedQuests: (selectedQuests: Quest[]) => void;
  setShowIndex: (showIndex: boolean) => void;
};
