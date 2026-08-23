import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Credentials + JWT sessions. We deliberately do NOT attach the Prisma adapter:
 * the schema is credentials-only (no Account/Session/VerificationToken tables,
 * no `emailVerified`), so there is nothing for the adapter to manage. The
 * Credentials provider also requires the JWT session strategy — database
 * sessions are not supported for it. User lookup happens directly against
 * Prisma in `authorize`.
 *
 * `AUTH_SECRET` (in .env) is picked up automatically to sign the session JWT.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the host header. Auth.js auto-trusts in dev and on Vercel, but a
  // self-hosted production server (`next start`, Docker, etc.) needs this
  // explicitly or every /api/auth/* call fails with UntrustedHost.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Returned object becomes the JWT payload seed (id lands on token.sub).
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // Surface the user id (stored as token.sub) on the session object.
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
