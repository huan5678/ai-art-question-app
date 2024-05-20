import { type NextRequest, NextResponse } from 'next/server';

import {
  createQuest,
  deleteQuest,
  getQuests,
  updateQuest,
} from '@/actions/quest-actions';
import type { IQuestInputState } from '@/types/quest';

export async function GET() {
  const quests = await getQuests();
  return NextResponse.json(quests);
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  console.log('requestBody', requestBody);
  const { data, userId } = requestBody;
  if (!data) {
    return NextResponse.json(
      { message: 'Quest data is missing' },
      { status: 400 }
    );
  }
  if (data.length > 1) {
    Promise.all(
      data.map(
        async (q: IQuestInputState) =>
          await createQuest({
            ...q,
            userId,
            categoryId: q.categoryId === '' ? undefined : q.categoryId,
          })
      )
    );
    GET();
  }
  const quest = await createQuest({
    ...data[0],
    categoryId: data[0].categoryId === '' ? undefined : data[0].categoryId,
    userId,
  });
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
