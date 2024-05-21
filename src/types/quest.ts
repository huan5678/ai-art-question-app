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
}

export interface IQuestInputState {
  title: string;
  description: string;
  categoryId: string;
}

export interface IQuestInputProps {
  quests: Quest[];
  categories: Category[];
  onCreateQuest: ({
    data,
    userId,
  }: {
    data: IQuestInputState[];
    userId: string;
  }) => void;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
}
