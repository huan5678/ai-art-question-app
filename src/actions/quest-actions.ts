'use server';

import { v4 as uuidv4 } from 'uuid';

import { getSheetData, updateSheetData } from '@/lib/google';
import type {
  ColumnMapping,
  IQuestCreateProps,
  IQuestUpdateState,
} from '@/types/quest';

export async function createQuest(
  props: IQuestCreateProps | IQuestCreateProps[]
) {
  try {
    const data: IQuestCreateProps[] = Array.isArray(props) ? props : [props];

    const resultData: ColumnMapping[] = [];

    // Validation
    for (const d of data) {
      if (!d.title) {
        throw new Error('Quest title is required');
      }
    }

    const sheetDataResponse = await getSheetData();
    if (!sheetDataResponse.state) {
      throw new Error(sheetDataResponse.message);
    }

    const sheetData = sheetDataResponse.result;
    if (sheetData) {
      const existingTitles = sheetData.map((row) => row.title);
      for (const d of data) {
        if (existingTitles.includes(d.title)) {
          throw new Error(`Quest with title "${d.title}" already exists`);
        }
      }
      const newRows = data.map((d) => {
        return {
          id: uuidv4(),
          title: d.title,
          description: d.description || '',
          category: d.category || '',
        };
      });

      resultData.push(...sheetData, ...newRows);
    } else {
      const newRows = data.map((d) => {
        return {
          id: uuidv4(),
          title: d.title,
          description: d.description || '',
          category: d.category || '',
        };
      });

      resultData.push(...newRows);
    }
    await updateSheetData(resultData);

    return {
      state: true,
      message: 'Quest created',
      result: { quests: resultData },
    };
  } catch (error) {
    return {
      state: false,
      message: (error as Error).message,
      result: null,
    };
  }
}

export async function getQuests() {
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }
  return {
    state: true,
    message: 'Quests fetched',
    result: { quests: sheetDataResponse.result },
  };
}

export async function getQuestById(id: string) {
  if (!id) {
    return Error('Quest ID is required');
  }
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  const quest = sheetDataResponse.result?.find((row) => row.id === id);
  if (!quest) {
    return Error('Quest not found');
  }
  return {
    state: true,
    message: 'Quest fetched',
    result: { quest },
  };
}

export async function getQuestsByCategoryId(categoryId: string) {
  if (!categoryId) {
    return Error('Category ID is required');
  }
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  const quests = sheetDataResponse.result?.filter(
    (row) => row.categoryId === categoryId
  );
  return {
    state: true,
    message: 'Quests fetched',
    result: { quests },
  };
}

export async function updateQuest(data: IQuestUpdateState) {
  const { id } = data;
  if (!id) {
    return Error('Quest ID is required');
  }
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  const quests = sheetDataResponse.result;
  if (!quests) {
    return Error('Quests not found');
  }

  const index = quests.findIndex((row) => row.id === id);
  if (index === -1) {
    return Error('Quest not found');
  }

  quests[index] = {
    ...quests[index],
    title: data.title as string,
    description: data.description as string,
    categoryId: data.category as string,
  };

  await updateSheetData(quests);
  return {
    state: true,
    message: 'Quest updated',
    result: { quest: quests[index] },
  };
}

export async function deleteQuest(id: string) {
  if (!id) {
    return Error('Quest ID is required');
  }

  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  const quests = sheetDataResponse.result;
  if (!quests) {
    return Error('Quests not found');
  }
  const updatedQuests = quests.filter((row) => row.id !== id);

  await updateSheetData(updatedQuests);
  return {
    state: true,
    message: 'Quest deleted',
    result: { quests: updatedQuests },
  };
}
