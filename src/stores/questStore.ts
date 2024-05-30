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
  getQuestsByCategoryId,
  updateQuest,
} from '@/actions/quest-actions';
import type {
  IQuestInputState,
  IQuestState,
  IQuestUpdateState,
  QueryStatus,
} from '@/types/quest';
import type { TResponse } from '@/types/response';

const questStore = (
  set: (args: Partial<IQuestState>) => void,
  get: () => IQuestState
) => ({
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
      if (response.result.quests) {
        set({ quests: response.result.quests, questsStatus: 'success' });
      } else {
        set({ questsStatus: 'error' });
      }
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  getQuestsByCategory: async (categoryId: string) => {
    set({ questsStatus: 'pending' });
    try {
      const response = (await getQuestsByCategoryId(
        categoryId
      )) as unknown as TResponse<{
        quests: Quest[];
      }>;
      if (response.result.quests) {
        set({ questsList: response.result.quests, questsStatus: 'success' });
      } else {
        set({ questsStatus: 'error' });
      }
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  getCategories: async () => {
    set({ categoriesStatus: 'pending' });
    try {
      const response = await getCategories();
      if (response.result.categories) {
        set({
          categories: response.result.categories,
          categoriesStatus: 'success',
        });
      } else {
        set({ categoriesStatus: 'error' });
      }
    } catch (error) {
      console.error(error);
      set({ categoriesStatus: 'error' });
    }
  },

  createCategory: async (name: string) => {
    try {
      set({ categoriesStatus: 'pending' });
      const response = (await createCategory(name)) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({
        categories: response.result.categories,
        categoriesStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ categoriesStatus: 'error' });
    }
  },

  updateCategory: async (id: string, name: string) => {
    try {
      set({ categoriesStatus: 'pending' });
      const response = (await updateCategory(
        id,
        name
      )) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({
        categories: response.result.categories,
        categoriesStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ categoriesStatus: 'error' });
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ categoriesStatus: 'pending' });
      const response = (await deleteCategory(id)) as unknown as TResponse<{
        categories: Category[];
      }>;
      set({
        categories: response.result.categories,
        categoriesStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ categoriesStatus: 'error' });
    }
  },

  createQuest: async (data: IQuestInputState[], userId: string) => {
    try {
      set({ questsStatus: 'pending' });
      const resultData = data.map((d) => ({ ...d, userId }));
      const response = await createQuest(resultData);
      if (response.state === false) {
        throw new Error(response.message);
      }
      set({
        quests: response.result?.quests,
        questsStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  updateQuest: async (data: IQuestUpdateState) => {
    try {
      set({ questsStatus: 'pending' });
      const quest = get().quests.find((q) => q.id === data.id);
      if (!quest) {
        throw new Error('Quest not found');
      }
      const updatedQuest = { ...quest, ...data, title: data.title ?? '' };
      await updateQuest(updatedQuest as Quest);
      set({
        quests: get().quests.map((q) =>
          q.id === data.id ? { ...q, ...data, title: data.title ?? '' } : q
        ),
        questsStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  updateQuestCategory: async ({
    questId,
    categoryId,
  }: {
    questId: string;
    categoryId: string | null;
  }) => {
    try {
      set({ questsStatus: 'pending' });
      const quest = get().quests.find((q) => q.id === questId);
      if (!quest) {
        throw new Error('Quest not found');
      }
      quest.categoryId = categoryId;
      (await updateQuest(quest)) as unknown as TResponse<{
        quest: Quest;
      }>;
      set({
        quests: get().quests.map((q) =>
          q.id === quest.id ? { ...q, ...quest } : q
        ),
        questsStatus: 'success',
      });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  deleteQuest: async (id: string) => {
    try {
      set({ questsStatus: 'pending' });
      const response = (await deleteQuest(id)) as unknown as TResponse<{
        quests: Quest[];
      }>;
      set({ quests: response.result.quests, questsStatus: 'success' });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },
});

const useQuestStore = create(questStore);

export default useQuestStore;
