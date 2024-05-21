import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { env } from '@/env.mjs';

const SECRET_KEY = env.NEXTAUTH_SECRET as string;

interface SessionPayload {
  id: string;
  role: string;
}

function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as SessionPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token')?.value;
  console.log('Session token:', sessionToken);

  if (!sessionToken) {
    console.log('No session token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const session = verifyToken(sessionToken);
  console.log('Session:', session);

  if (!session || session.role !== 'admin') {
    console.log('Session invalid or not admin, redirecting to home');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'], // 更新這裡來匹配需要應用 middleware 的路由
};
