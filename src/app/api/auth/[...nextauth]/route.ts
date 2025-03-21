import NextAuth, { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

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
    async signIn({ user, account, profile }) {
      if (account && profile) {
        // console.log("SignIn Callback:", {
        //   userId: profile.sub,
        //   email: profile.email,
        //   hasIdToken: !!account.id_token,
        //   hasAccessToken: !!account.access_token
        // });
        return true;
      }
      return false;
    },
    async jwt({ token, account, profile, user }) {
      // Initial sign in
      if (account && profile) {
        // console.log("JWT Callback - Initial sign in:", {
        //   sub: profile.sub,
        //   email: profile.email,
        //   hasIdToken: !!account.id_token,
        //   hasAccessToken: !!account.access_token
        // });
        
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
      // console.log("Session Callback - Token data:", {
      //   sub: token.sub,
      //   id: token.id,
      //   hasIdToken: !!token.idToken,
      //   hasAccessToken: !!token.accessToken,
      //   tokenKeys: Object.keys(token)
      // });

      // Always return a valid session with the user ID
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
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn(message) {
      // console.log("SignIn Event:", message);
    },
    async session(message) {
      // console.log("Session Event:", message);
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
