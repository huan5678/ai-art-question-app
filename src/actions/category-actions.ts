'use server';

import prisma from '@/lib/prisma';

export async function createCategory(name: string) {
  if (name.trim() === '') {
    return Error('Category name cannot be empty');
  }
  await prisma.category.create({
    data: { name },
  });
  const categoriesResult = await getCategories();
  const { categories } = categoriesResult.result;
  return {
    state: true,
    message: 'Category created',
    result: { categories },
  };
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });
  return {
    state: true,
    message: 'Categories fetched',
    result: { categories },
  };
}

export async function updateCategory(id: string, name: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    return Error('Category not found');
  }
  await prisma.category.update({
    where: { id },
    data: { name },
  });
  const categoriesResult = await getCategories();
  const { categories } = categoriesResult.result;
  return {
    state: true,
    message: 'Category updated',
    result: { categories },
  };
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    return Error('Category not found');
  }
  await prisma.category.delete({
    where: { id },
  });
  await prisma.quest.updateMany({
    where: { categoryId: id },
    data: { categoryId: 'unCategory' },
  });
  const categoriesResult = await getCategories();
  const { categories } = categoriesResult.result;
  return {
    state: true,
    message: 'Category deleted',
    result: { categories },
  };
}
