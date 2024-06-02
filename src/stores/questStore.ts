import { create } from 'zustand';

import {
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
  Category,
  ColumnMapping,
  IQuestCreateProps,
  IQuestState,
  IQuestUpdateState,
  QueryStatus,
  Quest,
} from '@/types/quest';
import type { TResponse } from '@/types/response';

const questStore = (
  set: (args: Partial<IQuestState>) => void,
  get: () => IQuestState
) => ({
  quests: [] as ColumnMapping[],
  setQuests: (quests: ColumnMapping[]) => set({ quests }),
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
      if (!response.result) {
        set({ questsStatus: 'error' });
        return;
      }
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

  getQuestsByCategory: async (category: string) => {
    set({ questsStatus: 'pending' });
    try {
      const response = (await getQuestsByCategoryId(
        category
      )) as unknown as TResponse<{
        quests: Quest[];
      }>;
      if (!response.result) {
        set({ questsStatus: 'error' });
        return;
      }
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
      if (!response.result) {
        set({ categoriesStatus: 'error' });
        return;
      }
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

  updateCategory: async (id: string, name: string) => {
    try {
      set({ categoriesStatus: 'pending' });
      const response = await updateCategory(id, name);

      if (!('result' in response) || !response.result) {
        throw new Error(response.message);
      }
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

  createQuest: async (data: IQuestCreateProps[]) => {
    try {
      set({ questsStatus: 'pending' });
      console.log('createQuest', data);
      const response = await createQuest(data);
      if (response.state === false || !response.result) {
        throw new Error(response.message);
      }
      set({
        quests: response.result.quests,
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
    category,
  }: {
    questId: string;
    category: string | null;
  }) => {
    try {
      set({ questsStatus: 'pending' });
      const quest = get().quests.find((q) => q.id === questId);
      if (!quest) {
        throw new Error('Quest not found');
      }
      const updatedQuest: IQuestUpdateState = {
        id: questId,
        title: quest.title,
        description: quest.description,
        category: category ?? '',
      };
      await updateQuest(updatedQuest);
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
