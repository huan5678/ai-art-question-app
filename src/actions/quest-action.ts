'use server';

import prisma from '@/lib/prisma';

export async function createQuest(input: {
  title: string;
  description: string;
  categoryId: string;
  userId: string;
}) {
  const quest = await prisma.quest.create({
    data: input,
  });
  return quest;
}

export async function getQuests() {
  const quests = await prisma.quest.findMany();
  return quests;
}

export async function getQuestById(id: string) {
  const quest = await prisma.quest.findUnique({
    where: { id },
  });
  return quest;
}

export async function getQuestsByCategoryId(categoryId: string) {
  const quests = await prisma.quest.findMany({
    where: { categoryId },
  });
  return quests;
}

export async function updateQuest(input: {
  id: string;
  title: string;
  description: string;
  categoryId: string;
}) {
  const quest = await prisma.quest.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
    },
  });
  return quest;
}

export async function deleteQuest(id: string) {
  const quest = await prisma.quest.delete({
    where: { id },
  });
  return quest;
}
