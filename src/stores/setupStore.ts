import { create } from 'zustand';

import type { Quest } from '@/types/quest';
import type { IConfigurationState } from '@/types/setup';

const configurationStore = (
  set: (args: Partial<IConfigurationState>) => void
) => ({
  title: {
    mainTitle: '出題系統',
    subTitle: '隨機抽選問題',
  },
  setTitle: (title: { mainTitle?: string; subTitle?: string } = {}) =>
    set({
      title: {
        mainTitle: title.mainTitle || '出題系統',
        subTitle: title.subTitle || '隨機抽選問題',
      },
    }),
  drawCount: 1,
  setDrawCount: (count: number) => set({ drawCount: count }),
  selectedQuests: [] as Quest[],
  setSelectedQuests: (quests: Quest[]) => set({ selectedQuests: quests }),
});

const useConfigurationStore = create<IConfigurationState>(configurationStore);

export default useConfigurationStore;
