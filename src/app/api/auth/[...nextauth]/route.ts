import NextAuth, { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID as string,
      clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        url: `${process.env.COGNITO_DOMAIN}/oauth2/authorize`,
        params: {
          scope: 'openid profile email',
          response_type: 'code',
          grant_type: 'authorization_code'
        }
      },
      token: {
        url: `${process.env.COGNITO_DOMAIN}/oauth2/token`
      },
      userinfo: {
        url: `${process.env.COGNITO_DOMAIN}/oauth2/userInfo`
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
