import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// GET /api/account
export async function GET() {
  const accounts = await prisma.account.findMany();
  return NextResponse.json(accounts);
}

// POST /api/account
export async function POST(request: NextRequest) {
  const data = await request.json();
  const account = await prisma.account.create({ data });
  return NextResponse.json(account);
}

// PUT /api/account/:id
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/account');
  }
  const data = await request.json();
  const account = await prisma.account.update({
    where: { id },
    data,
  });
  return NextResponse.json(account);
}

// DELETE /api/account/:id
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.redirect('/api/account');
  }
  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ message: 'Account deleted' });
}
