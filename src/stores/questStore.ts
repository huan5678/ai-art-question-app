import type { Category, Quest } from '@prisma/client';
import { create } from 'zustand';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/actions/category-actions';
import {
  createQuest,
  deleteQuest,
  getQuests,
  updateQuest,
} from '@/actions/quest-actions';
import type { IQuestState, QueryStatus } from '@/types/quest';
import type { TResponse } from '@/types/response';

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
  setQuestsList: (quests: Quest[]) => set({ questsList: quests }),

  getQuests: async () => {
    set({ questsStatus: 'pending' });
    try {
      const response = await getQuests();
      set({ quests: response.result.quests, questsStatus: 'success' });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  getCategories: async () => {
    set({ categoriesStatus: 'pending' });
    try {
      const response = await getCategories();
      set({
        categories: response.result.categories,
        categoriesStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ categoriesStatus: 'error' });
    }
  },

  createCategory: async (name: string) => {
    try {
      const response = (await createCategory(name)) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({ categories: response.result.categories });
    } catch (error) {
      console.error(error);
    }
  },

  updateCategory: async (id: string, name: string) => {
    try {
      const response = (await updateCategory(
        id,
        name
      )) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({ categories: response.result.categories });
    } catch (error) {
      console.error(error);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = (await deleteCategory(id)) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({ categories: response.result.categories });
    } catch (error) {
      console.error(error);
    }
  },

  createQuest: async (
    quest: { title: string; description?: string; categoryId?: string },
    userId: string
  ) => {
    try {
      const response = (await createQuest({
        ...quest,
        userId,
      })) as unknown as TResponse<{
        quests: Quest[];
      }>;
      set({ quests: response.result.quests });
    } catch (error) {
      console.error(error);
    }
  },

  updateQuest: async (quest: {
    id: string;
    title: string;
    description?: string;
    categoryId?: string;
  }) => {
    try {
      const response = (await updateQuest(quest)) as unknown as TResponse<{
        quest: Quest;
      }>;
      set({
        quests: useQuestStore
          .getState()
          .quests.map((q) =>
            q.id === response.result.quest.id ? response.result.quest : q
          ),
      });
    } catch (error) {
      console.error(error);
    }
  },

  deleteQuest: async (id: string) => {
    try {
      const response = (await deleteQuest(id)) as unknown as TResponse<{
        quests: Quest[];
      }>;
      set({ quests: response.result.quests });
    } catch (error) {
      console.error(error);
    }
  },
});

const useQuestStore = create(questStore);

export default useQuestStore;
