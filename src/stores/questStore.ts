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

  getQuests: async () => {
    set({ questsStatus: 'pending' });
    try {
      const response = await fetch('/api/quest');
      const data = await response.json();
      set({ quests: data, questsStatus: 'success' });
    } catch (error) {
      console.error(error);
      set({ questsStatus: 'error' });
    }
  },

  createCategory: async (name: string) => {
    try {
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      set((state) => ({ categories: [...state.categories, ...data] }));
    } catch (error) {
      console.error(error);
    }
  },

  updateCategory: async (id: string, name: string) => {
    try {
      const response = await fetch('/api/category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      const data = await response.json();
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = await fetch(`/api/category?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  createQuest: async (
    quests: { title: string; description: string; categoryId: string }[],
    userId: string
  ) => {
    try {
      const response = await fetch('/api/quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: quests, userId }),
      });
      const data = await response.json();
      set((state) => ({
        quests: [...state.quests, ...data],
      }));
    } catch (error) {
      console.error(error);
    }
  },

  updateQuest: async (quest: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
  }) => {
    try {
      const response = await fetch('/api/quest', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest),
      });
      const data = await response.json();
      set((state) => ({
        quests: state.quests.map((q) => (q.id === quest.id ? data : q)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteQuest: async (id: string) => {
    try {
      const response = await fetch(`/api/quest?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      set((state) => ({
        quests: state.quests.filter((q) => q.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
});

const useQuestStore = create(questStore);

export default useQuestStore;
