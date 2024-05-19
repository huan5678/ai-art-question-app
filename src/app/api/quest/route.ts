import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../auth/[...nextauth]/auth-options';

import prisma from '@/lib/prisma';

export async function GET() {
  const quests = await prisma.quest.findMany();
  return NextResponse.json(quests);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { title, description, categoryId } = await request.json();

  // 查找預設 Category，如果不存在，則創建
  let defaultCategory = await prisma.category.findUnique({
    where: { name: 'unCategory' },
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: { name: 'unCategory' },
    });
  }

  const quest = await prisma.quest.create({
    data: {
      title,
      description,
      userId,
      categoryId: categoryId || defaultCategory.id,
    },
  });

  return NextResponse.json(quest);
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const { title, description, categoryId } = await request.json();
  const quest = await prisma.quest.update({
    where: { id: String(id) },
    data: {
      title,
      description,
      categoryId,
    },
  });
  return NextResponse.json(quest);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  await prisma.quest.delete({ where: { id: String(id) } });
  return NextResponse.json({ message: 'Quest deleted' });
}
