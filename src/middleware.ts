/*
問題出在 Next.js 的 Edge Runtime 不支持 Node.js 的 crypto 模組，所以我們需要使用 jose 這個套件來取代。
middleware.ts 是在 Edge Runtime 中運行的，而 Edge Runtime 不支持某些 Node.js 的模組，比如 crypto。
*/
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { env } from '@/env.mjs';

const SECRET_KEY = new TextEncoder().encode(env.NEXTAUTH_SECRET);

interface SessionPayload {
  id: string;
  role: string;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log('Decoded:', payload);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token')?.value;
  console.log('Session token:', sessionToken);

  if (!sessionToken) {
    console.log('No session token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const session = await verifyToken(sessionToken);
  if (!session) {
    console.log('Session invalid, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  req.headers.set('X-User-Id', session.id);

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // 更新這裡來匹配需要應用 middleware 的路由
};
