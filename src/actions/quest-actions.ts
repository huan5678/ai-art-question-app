'use server';

import type { Quest } from '@prisma/client';

import prisma from '@/lib/prisma';
import type { TQuestCreateProps } from '@/types/quest';
import type { TResponse } from '@/types/response';

export async function createQuest(
  props: TQuestCreateProps | TQuestCreateProps[]
) {
  try {
    let data = props;
    if (!Array.isArray(props)) {
      data = props as TQuestCreateProps;
      if (!data.title) {
        throw new Error('Quest title is required');
      }
      if (!data.userId) {
        throw new Error('User ID is required');
      }
      await prisma.quest.create({
        data: {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          userId: data.userId,
        },
      });
    }
    if (Array.isArray(data)) {
      for (const d of data) {
        if (!d.title) {
          throw new Error('Quest title is required');
        }

        if (!d.userId) {
          throw new Error('User ID is required');
        }
        await prisma.quest.createMany({
          data: data.map((d) => ({
            title: d.title as string,
            description: d.description,
            categoryId: d.categoryId,
            userId: d.userId,
          })),
        });
      }
    }
    const quests = await prisma.quest.findMany();
    return {
      state: true,
      message: 'Quest created',
      result: { quests },
    };
  } catch (error) {
    return {
      state: false,
      message: (error as unknown as Error).message,
      result: null,
    };
  }
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

export async function updateQuest(data: Quest) {
  console.log('updateQuest input:', data);
  const { id } = data;
  if (!id) {
    return Error('Quest ID is required');
  }
  const quest = await prisma.quest.findUnique({
    where: { id },
  });
  if (!quest) {
    return Error('Quest not found');
  }
  await prisma.quest.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
    },
  });
  const { result } = await ((await getQuestById(id)) as unknown as Promise<
    TResponse<{ quest: Quest }>
  >);
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
