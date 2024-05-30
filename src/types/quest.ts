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
  createQuest: (data: IQuestInputState[], userId: string) => Promise<void>;
  updateQuest: (data: IQuestUpdateState) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  updateQuestCategory: ({
    questId,
    categoryId,
  }: {
    questId: string;
    categoryId: string | null;
  }) => Promise<void>;
}

export interface IQuestInputState {
  title: string | null;
  description: string | null;
  categoryId: string | null;
}

export type TQuestCreateProps = IQuestInputState & { userId: string };

export interface IQuestInputProps {
  categories: Category[];
  onCreateQuest: (data: IQuestInputState[], userId: string) => void;
  status: boolean;
}

export interface IQuestUpdateState extends IQuestInputState {
  id: string;
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

export type TEditMenuOnEditProps = Quest | CategoryType;
