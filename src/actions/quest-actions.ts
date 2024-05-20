'use server';

import type { Quest } from '@prisma/client';

import prisma from '@/lib/prisma';
import type { TResponse } from '@/types/response';

export async function createQuest(input: {
  title: string;
  description?: string;
  categoryId?: string;
  userId: string;
}) {
  if (!input.title) {
    return Error('Quest title is required');
  }
  if (!input.userId) {
    return Error('User ID is required');
  }
  const quest = await prisma.quest.create({
    data: input,
  });
  return {
    state: true,
    message: 'Quest created',
    result: { quest },
  };
}

export async function getQuests() {
  const quests = await prisma.quest.findMany();
  return {
    state: true,
    message: 'Quests fetched',
    result: { quests },
  };
}

export async function getQuestById(id: string) {
  if (!id) {
    return Error('Quest ID is required');
  }
  const quest = await prisma.quest.findUnique({
    where: { id },
  });
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
  const quests = await prisma.quest.findMany({
    where: { categoryId },
  });
  return {
    state: true,
    message: 'Quests fetched',
    result: { quests },
  };
}

export async function updateQuest(input: {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
}) {
  if (!input.id) {
    return Error('Quest ID is required');
  }
  if (!input.title) {
    return Error('Quest title is required');
  }
  const quest = await prisma.quest.findUnique({
    where: { id: input.id },
  });
  if (!quest) {
    return Error('Quest not found');
  }
  await prisma.quest.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description || quest.description,
      categoryId: input.categoryId || quest.categoryId,
    },
  });
  const { result } = await ((await getQuestById(
    input.id
  )) as unknown as Promise<TResponse<{ quest: Quest }>>);
  return {
    state: true,
    message: 'Quest updated',
    result,
  };
}

export async function deleteQuest(id: string) {
  if (!id) {
    return Error('Quest ID is required');
  }

  const quest = await prisma.quest.findUnique({
    where: { id },
  });
  if (!quest) {
    return Error('Quest not found');
  }
  await prisma.quest.delete({
    where: { id },
  });
  const { result } = await getQuests();
  return {
    state: true,
    message: 'Quest deleted',
    result,
  };
}
