import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/session
export async function GET() {
  const sessions = await prisma.session.findMany();
  return NextResponse.json(sessions);
}

// POST /api/session
export async function POST(request: NextRequest) {
  const data = await request.json();
  const session = await prisma.session.create({ data });
  return NextResponse.json(session);
}

// PUT /api/session/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/session');
  }
  const data = await request.json();
  const session = await prisma.session.update({
    where: { id },
    data,
  });
  return NextResponse.json(session);
}

// DELETE /api/session/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/session');
  }
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ message: 'Session deleted' });
}
