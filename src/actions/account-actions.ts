'use server';

import prisma from '@/lib/prisma';

interface AccountInput {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export async function createAccount(input: AccountInput) {
  const account = await prisma.account.create({
    data: input,
  });
  return account;
}

export async function updateAccount(id: string, input: AccountInput) {
  const account = await prisma.account.update({
    where: { id },
    data: input,
  });
  return account;
}

export async function deleteAccount(id: string) {
  const account = await prisma.account.delete({
    where: { id },
  });
  return account;
}
