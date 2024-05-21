import type { Category, Quest } from '@prisma/client';
import { create } from 'zustand';

import type { IQuestState, QueryStatus } from '@/types/quest';

const questStore = (set: (args: Partial<IQuestState>) => void) => ({
  quests: [] as Quest[],
  setQuests: (quests: Quest[]) => set({ quests }),
  questsStatus: 'pending' as QueryStatus,
  setQuestsStatus: (status: QueryStatus) => set({ questsStatus: status }),
  categories: [] as Category[],
  setCategories: (categories: Category[]) => set({ categories }),
  setCategoriesStatus: (status: QueryStatus) =>
    set({ categoriesStatus: status }),
  categoriesStatus: 'pending' as QueryStatus,
  questsList: [] as Quest[],
  setQuestsList: (quests: Quest[]) => set({ quests }),
});

const useQuestStore = create(questStore);

export default useQuestStore;
