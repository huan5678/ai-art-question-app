'use server';

import prisma from '@/lib/prisma';

export async function createCategory(name: string) {
  const category = await prisma.category.create({
    data: { name },
  });
  return category;
}

export async function updateCategory(id: string, name: string) {
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  return category;
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({
    where: { id },
  });
  await prisma.quest.updateMany({
    where: { categoryId: id },
    data: { categoryId: 'unCategory' },
  });
  return category;
}
