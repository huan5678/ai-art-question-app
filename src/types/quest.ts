// 定義 Quest 和 Category 的新型別
export type ColumnMapping = { [key: string]: string };

export type Quest = {
  id: string;
  title: string;
  description: string;
  category: string; // 題庫直接作為 category
};

export type Category = {
  id: string;
  name: string;
};

// 保持 QueryStatus 不變
export type QueryStatus = 'success' | 'error' | 'pending';

export interface IQuestCreateProps {
  title: string;
  description?: string;
  category?: string;
}

// 保持 IQuestUpdateState 不變
export interface IQuestUpdateState extends IQuestCreateProps {
  id: string;
}

// 更新 IQuestState 介面
export interface IQuestState {
  quests: ColumnMapping[];
  categories: Category[];
  setQuests: (quests: ColumnMapping[]) => void;
  setCategories: (categories: Category[]) => void;
  questsList: Quest[];
  setQuestsList: (quests: Quest[]) => void;
  questsStatus: QueryStatus;
  categoriesStatus: QueryStatus;
  setQuestsStatus: (status: QueryStatus) => void;
  setCategoriesStatus: (status: QueryStatus) => void;
  getQuests: () => void;
  getQuestsByCategory: (category: string) => Promise<void>;
  getCategories: () => void;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createQuest: (data: IQuestCreateProps[]) => Promise<void>;
  updateQuest: (data: IQuestUpdateState) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  updateQuestCategory: ({
    questId,
    category,
  }: {
    questId: string;
    category: string | null;
  }) => Promise<void>;
}

// 保持 IQuestInputProps 不變
export interface IQuestInputProps {
  categories: Category[];
  onCreateQuest: (data: IQuestCreateProps[]) => void;
  status: boolean;
}

// 保持 TEditMenuOnEditProps 不變
export type TEditMenuOnEditProps = ColumnMapping | Category;
