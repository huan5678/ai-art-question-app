'use server';

import { v4 as uuidv4 } from 'uuid';

import { getSheetData, updateSheetData } from '@/lib/google';
import type { Category } from '@/types/quest';

export async function getCategories() {
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }
  if (!sheetDataResponse.result) {
    return {
      state: false,
      message: 'Categories not found',
      result: null,
    };
  }

  const categoriesMap: { [key: string]: string } = {};
  for (const row of sheetDataResponse.result) {
    if (row.category) {
      if (!categoriesMap[row.category]) {
        categoriesMap[row.category] = uuidv4();
      }
    }
  }

  const categories: Category[] = Object.entries(categoriesMap).map(
    ([name, id]) => ({
      id,
      name,
    })
  );

  return {
    state: true,
    message: 'Categories fetched',
    result: { categories },
  };
}

export async function updateCategory(id: string, name: string) {
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  if (!sheetDataResponse.result) {
    return Error('Categories not found');
  }

  const resultCategories: Category[] = sheetDataResponse.result.map((row) => {
    if (row.category === id) {
      return {
        id: row.id,
        name,
      };
    }
    return {
      id: row.id,
      name: row.category,
    };
  });

  const resultData = sheetDataResponse.result.map((row) => {
    if (row.category === id) {
      return { ...row, category: name };
    }
    return row;
  });

  await updateSheetData(resultData);
  return {
    state: true,
    message: 'Category updated',
    result: { categories: resultCategories },
  };
}

export async function deleteCategory(id: string) {
  const sheetDataResponse = await getSheetData();
  if (!sheetDataResponse.state) {
    return {
      state: false,
      message: sheetDataResponse.message,
      result: null,
    };
  }

  if (!sheetDataResponse.result) {
    return Error('Categories not found');
  }
  const updatedCategories = sheetDataResponse.result.map((row) => {
    if (row.category === id) {
      return { ...row, category: '' };
    }
    return row;
  });

  await updateSheetData(updatedCategories);
  return {
    state: true,
    message: 'Category deleted',
    result: { categories: updatedCategories },
  };
}
