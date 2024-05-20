import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { AuthOptions } from 'next-auth';
import type { JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
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
        if (user && bcrypt.compareSync(password, user.hashedPassword || '')) {
          const sessionToken = jwt.sign(
            { id: user.id, role: user.role },
            env.NEXTAUTH_SECRET as string,
            { expiresIn: '30d' }
          );
          return {
            id: user.id,
            name: user.name,
            email: user.email,
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
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    encode: async ({ secret, token }: JWTEncodeParams) => {
      const jwtClaims = {
        sub: token?.sub,
        name: token?.name,
        email: token?.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      };
      return jwt.sign(jwtClaims, secret);
    },
    decode: async ({ secret, token }: JWTDecodeParams) => {
      try {
        return jwt.verify(token || '', secret) as JwtPayload;
      } catch (error) {
        return null;
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (typeof user.email !== 'string') {
          throw new Error('Invalid user email');
        }
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          token.sub = existingUser.id;
          token.email = existingUser.email;
          token.name = existingUser.name;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
            },
          });

          token.sub = newUser.id;
          token.email = newUser.email;
          token.name = newUser.name;
        }
      } else if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
};
