import { type NextRequest, NextResponse } from 'next/server';

import {
  createQuest,
  deleteQuest,
  getQuests,
  updateQuest,
} from '@/actions/quest-actions';

export async function GET() {
  const quests = await getQuests();
  return NextResponse.json(quests);
}

export async function POST(request: NextRequest) {
  const input = await request.json();
  const quest = await createQuest(input);
  return NextResponse.json(quest);
}

export async function PATCH(request: NextRequest) {
  const input = await request.json();
  const quest = await updateQuest(input);
  return NextResponse.json(quest);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const quest = await deleteQuest(id);
  return NextResponse.json(quest);
}
