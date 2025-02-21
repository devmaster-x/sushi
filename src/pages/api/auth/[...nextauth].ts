import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Helps with session persistence on iOS
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Ensures session cookies work properly on iOS Safari
        secure: true // Required for iPhones in production
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production", // Ensures authentication works on iOS
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
});
