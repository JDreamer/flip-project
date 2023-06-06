import NextAuth from 'next-auth';
import { MoralisNextAuthProvider } from '@moralisweb3/next';
//@ts-ignore
export default NextAuth({
  providers: [MoralisNextAuthProvider()],
  callbacks: {
    //@ts-ignore
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    //@ts-ignore
    async session({ session, token }) {
      (session as { user: unknown }).user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
});
