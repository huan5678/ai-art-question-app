import { type NextRequest, NextResponse } from 'next/server';

import { registerUser } from '@/actions/account-actions';

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  try {
    const user = await registerUser(email, password, name);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as unknown as Error).message },
      { status: 400 }
    );
  }
}
