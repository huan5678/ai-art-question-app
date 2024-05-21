import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';

const SECRET_KEY = env.NEXTAUTH_SECRET as string;
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET as string;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error('Invalid credentials');
        }
        if (!user.hashedPassword) {
          throw new Error('User has not set a password');
        }
        if (user && bcrypt.compareSync(password, user.hashedPassword)) {
          const sessionToken = jwt.sign(
            { id: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: '30d' }
          );
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            sessionToken,
          };
        }
        throw new Error('Invalid credentials');
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: SECRET_KEY,
  jwt: {
    encode: async ({ secret, token }) => {
      const jwtClaims = {
        id: token?.id,
        sub: token?.sub,
        role: token?.role,
        email: token?.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      };
      return jwt.sign(jwtClaims, secret);
    },
    decode: async ({ token, secret }) => {
      try {
        if (!token) return null;
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        return {
          id: decoded.id,
          sub: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        } as jwt.JwtPayload & { id: string; role: string };
      } catch (error) {
        console.error('JWT decoding failed:', error);
        return null;
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
  },
};
