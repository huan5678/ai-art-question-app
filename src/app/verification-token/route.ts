import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/verification-token
export async function GET() {
  const tokens = await prisma.verificationToken.findMany();
  return NextResponse.json(tokens);
}

// POST /api/verification-token
export async function POST(request: NextRequest) {
  const data = await request.json();
  const token = await prisma.verificationToken.create({ data });
  return NextResponse.json(token);
}

// PUT /api/verification-token/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/verification-token');
  }
  const data = await request.json();
  const token = await prisma.verificationToken.update({
    where: { id },
    data,
  });
  return NextResponse.json(token);
}

// DELETE /api/verification-token/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/verification-token');
  }
  await prisma.verificationToken.delete({ where: { id } });
  return NextResponse.json({ message: 'Verification token deleted' });
}
