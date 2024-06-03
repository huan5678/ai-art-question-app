// 定義泛型 ColumnMapping，默認值為 { [key: string]: string }
export type ColumnMapping<T = { [key: string]: string }> = {
  [K in keyof T]: string;
};

// 定義 Quest 類型
export type Quest = {
  id: string;
  title: string;
  description: string;
  category: string; // 題庫直接作為 category
};

// 定義 Category 類型
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
  quests: ColumnMapping<Quest>[];
  categories: ColumnMapping<Category>[];
  setQuests: (quests: ColumnMapping<Quest>[]) => void;
  setCategories: (categories: ColumnMapping<Category>[]) => void;
  questsList: ColumnMapping<Quest>[];
  setQuestsList: (quests: ColumnMapping<Quest>[]) => void;
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
