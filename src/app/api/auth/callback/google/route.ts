import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  console.log('code:', code);
  console.log(searchParams.toString());
};
