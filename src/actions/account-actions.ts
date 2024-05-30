'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@/env.mjs';

const prisma = new PrismaClient();
const SECRET_KEY = env.NEXTAUTH_SECRET as string;

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return {
    state: true,
    message: 'User registered',
    result: { user },
  };
}

export async function checkUserRole(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  return user.role;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword || '')) {
    throw new Error('Invalid credentials');
  }

  const sessionToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: '30d',
  });

  return {
    state: true,
    message: 'Login successful',
    result: { id: user.id, name: user.name, email: user.email, sessionToken },
  };
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }
  await prisma.user.delete({
    where: { id: userId },
    include: {
      accounts: true,
      sessions: true,
      quests: true,
    },
  });
  return { state: true, message: 'User deleted' };
}
