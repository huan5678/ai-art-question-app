import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'asc', // 這裡可以替換為你想排序的字段，例如 'createdAt' 或 'updatedAt'
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    await prisma.category.create({
      data: {
        name: requestBody,
      },
    });
    return GET();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error creating category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const { name } = await request.json();
  const category = await prisma.category.update({
    where: { id: String(id) },
    data: {
      name,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  await prisma.category.delete({ where: { id: String(id) } });
  await prisma.quest.updateMany({
    where: { categoryId: String(id) },
    data: { categoryId: 'unCategory' },
  });
  return NextResponse.json({ message: 'Category deleted' });
}
