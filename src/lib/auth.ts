import NextAuth, { type NextAuthConfig, type Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import type { Role } from '@prisma/client'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// ── Role guard ─────────────────────────────────────────────────

const roleHierarchy: Record<Role, number> = {
  customer: 0,
  admin: 1,
  superadmin: 2,
}

export function requireRole(session: Session | null, minRole: Role) {
  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }
  const userLevel = roleHierarchy[session.user.role as Role] ?? -1
  const requiredLevel = roleHierarchy[minRole]
  if (userLevel < requiredLevel) {
    throw new Error('FORBIDDEN')
  }
}

// ── Type augmentation ──────────────────────────────────────────

declare module 'next-auth' {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: Role
    }
  }
}

declare module 'next-auth' {
  interface JWT {
    id: string
    role: Role
  }
}
