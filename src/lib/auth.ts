/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

const globalForPrismaAuth = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

const prismaAuth = globalForPrismaAuth.prismaAuth ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaAuth.prismaAuth = prismaAuth;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaAuth),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prismaAuth.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token.sub) {
        const user = await prismaAuth.user.findUnique({
          where: { id: token.sub },
        });
        if (user) {
          session.user.role = user.role;
          session.user.id = user.id;
          session.user.phone = user.phone;
          session.user.name = user.name;
          session.user.email = user.email;
        }
      }
      return session;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: any;
      user: any;
      trigger?: any;
      session?: any;
    }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }

      if (trigger === "update" && session) {
        const freshUser = await prismaAuth.user.findUnique({
          where: { id: token.sub },
        });
        if (freshUser) {
          token.name = freshUser.name;
          token.phone = freshUser.phone;
        }
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
