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
  const sessionToken = req.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/auth/signup', req.url));
  }

  const session = verifyToken(sessionToken);

  if (!session || session.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/*'], // 更新這裡來匹配需要應用 middleware 的路由
};
