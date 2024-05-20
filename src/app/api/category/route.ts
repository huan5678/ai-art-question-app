import { type NextRequest, NextResponse } from 'next/server';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/actions/category-actions';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    await createCategory(requestBody.name);
    return GET();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: (error as unknown as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(
      { message: 'Category id is missing' },
      { status: 400 }
    );
  }
  const { name } = await request.json();
  const category = await updateCategory(id, name);
  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { message: 'Category id is missing' },
        { status: 400 }
      );
    }
    await deleteCategory(id);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error deleting category' },
      { status: 500 }
    );
  }
}
