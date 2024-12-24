import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Quest } from '@/types/quest';
import type { IConfigurationState } from '@/types/setup';

const DEFAULT_CONFIG = {
  title: {
    header: '2024 台灣 AI 生成大賽',
    mainTitle: '出題系統',
    subTitle: '隨機抽選問題',
  },
  drawCount: 1,
  selectedQuests: [] as Quest[],
  showIndex: false,
};

const configurationStore = (
  set: (
    fn:
      | IConfigurationState
      | Partial<IConfigurationState>
      | ((
          state: IConfigurationState
        ) => IConfigurationState | Partial<IConfigurationState>)
  ) => void
): IConfigurationState => ({
  ...DEFAULT_CONFIG,
  setTitle: (title: { header: string; mainTitle: string; subTitle: string }) =>
    set((state) => ({
      ...state,
      title: {
        header: title.header,
        mainTitle: title.mainTitle,
        subTitle: title.subTitle,
      },
    })),
  setDrawCount: (count: number) =>
    set((state) => ({
      ...state,
      drawCount: count,
    })),
  setSelectedQuests: (quests: Quest[]) =>
    set((state) => ({
      ...state,
      selectedQuests: quests,
    })),
  setShowIndex: (showIndex: boolean) =>
    set((state) => ({
      ...state,
      showIndex,
    })),
});

const useConfigurationStore = create<IConfigurationState>()(
  persist(configurationStore, {
    name: 'configuration-storage',
    partialize: (state) => ({
      title: state.title,
      drawCount: state.drawCount,
      selectedQuests: state.selectedQuests,
    }),
  })
);

export default useConfigurationStore;
