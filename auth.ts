import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    bandspaceSession?: any;
  }
  interface Session {
    bandspaceSession?: any;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Use id_token (JWT) instead of access_token for backend authentication
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/mobile`, {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/mobile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
              }),
            }
          );

          if (response.ok) {
            const session = await response.json();
            user.bandspaceSession = session;
            console.log("Backend authentication successful:", session);
            return true;
          } else {
            console.error(
              "Backend authentication failed:",
              response.status,
              response.statusText
            );
            const errorData = await response.text();
            console.error("Backend error response:", errorData);
            return false;
          }
        } catch (error) {
          console.error("Error authenticating with backend:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Add the bandspace session data to the NextAuth session
      if (token.bandspaceSession) {
        session.bandspaceSession = token.bandspaceSession;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Store the bandspace session in the JWT token
      if (user?.bandspaceSession) {
        token.bandspaceSession = user.bandspaceSession;
      }
      return token;
    },
  },
});
