import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/quest
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (id) {
    const quest = await prisma.quest.findUnique({ where: { id } });
    return NextResponse.json(quest);
  }
  const quests = await prisma.quest.findMany();
  return NextResponse.json(quests);
}

// POST /api/quest
export async function POST(request: NextRequest) {
  const data = await request.json();
  const quest = await prisma.quest.create({ data });
  return NextResponse.json(quest);
}

// PUT /api/quest/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/quest');
  }
  const data = await request.json();
  const quest = await prisma.quest.update({
    where: { id: String(id) },
    data,
  });
  return NextResponse.json(quest);
}

// DELETE /api/quest/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/quest');
  }
  await prisma.quest.delete({ where: { id: String(id) } });
  return NextResponse.json({ message: 'Quest deleted' });
}
