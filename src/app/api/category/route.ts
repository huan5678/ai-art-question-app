import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/category
export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

// POST /api/category
export async function POST(request: NextRequest) {
  const data = await request.json();
  const category = await prisma.category.create({ data });
  return NextResponse.json(category);
}

// PUT /api/category/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/category');
  }
  const data = await request.json();
  const category = await prisma.category.update({
    where: { id: String(id) },
    data,
  });
  return NextResponse.json(category);
}

// DELETE /api/category/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/category');
  }
  await prisma.category.delete({ where: { id: String(id) } });
  return NextResponse.json({ message: 'Category deleted' });
}
