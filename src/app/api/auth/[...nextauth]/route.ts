/**
 * @fileoverview This file configures NextAuth for authentication using AWS Cognito.
 * It defines providers, callbacks, and session handling for the application.
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

/**
 * The authentication options for NextAuth.
 *
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account && profile) {
        return true;
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          id: profile.sub,
          sub: profile.sub,
          idToken: account.id_token,
          accessToken: account.access_token,
          email: profile.email,
        };
      }

      // Return previous token if it exists
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || token.id,
        },
        idToken: token.idToken,
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  events: {
    async signIn() {
      // No-op
    },
    async session() {
      // No-op
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
