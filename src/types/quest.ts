import type { Category, Quest } from '@prisma/client';

export type QueryStatus = 'success' | 'error' | 'pending';

export interface IQuestState {
  quests: Quest[];
  categories: Category[];
  setQuests: (quests: Quest[]) => void;
  setCategories: (categories: Category[]) => void;
  questsList: Quest[];
  setQuestsList: (quests: Quest[]) => void;
  questsStatus: QueryStatus;
  categoriesStatus: QueryStatus;
  setQuestsStatus: (status: QueryStatus) => void;
  setCategoriesStatus: (status: QueryStatus) => void;
  getQuests: () => void;
  getQuestsByCategory: (categoryId: string) => Promise<void>;
  getCategories: () => void;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createQuest: (quest: IQuestInputState[], userId: string) => Promise<void>;
  updateQuest: (quest: IQuestInputState & { id: string }) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
}

export interface IQuestInputState {
  title: string;
  description?: string | null;
  categoryId: string | null;
}

export interface IQuestInputProps {
  questCount: number;
  categories: Category[];
  onCreateQuest: ({
    data,
    userId,
  }: {
    data: IQuestInputState[];
    userId: string;
  }) => void;
  status: boolean;
}

export type QuestType = {
  title: string;
  id: string;
  categoryId: string | null;
};

export type CategoryType = {
  id: string;
  name: string;
};

export type TQuestInput = IQuestInputState & { userId: string };

export type TEditMenuOnEditProps = TQuestInput | CategoryType;
