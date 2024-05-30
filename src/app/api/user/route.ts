import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/user
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST /api/user
export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await prisma.user.create({ data });
  return NextResponse.json(user);
}

// PUT /api/user/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/user');
  }
  const data = await request.json();
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return NextResponse.json(user);
}

// DELETE /api/user/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/user');
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: 'User deleted' });
}
