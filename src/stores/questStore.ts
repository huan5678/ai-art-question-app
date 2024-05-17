import type { Category, Quest } from '@prisma/client';
import { create } from 'zustand';

import type { IQuestState } from '@/types/quest';

const questStore = (set: (args: Partial<IQuestState>) => void) => ({
  quests: [] as Quest[],
  setQuests: (quests: Quest[]) => set({ quests }),
  categories: [] as Category[],
  setCategories: (categories: Category[]) => set({ categories }),
});

const useQuestStore = create(questStore);

export default useQuestStore;
