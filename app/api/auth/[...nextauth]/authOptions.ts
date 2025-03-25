import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { params: { scope: "read:org" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account }) {
      if (!account?.access_token) {
        return false;
      }

      try {
        const orgsResponse = await fetch("https://api.github.com/user/orgs", {
          headers: {
            Authorization: `token ${account.access_token}`,
          },
        });

        if (!orgsResponse.ok) {
          console.error("Failed to fetch user organizations");
          return false;
        }

        const orgs: Array<{ login: string }> = await orgsResponse.json();
        const isMember = orgs.some(
          (org) => org.login.toLowerCase() === "appkom",
        );

        return isMember;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const orgsResponse = await fetch("https://api.github.com/user/orgs", {
            headers: {
              Authorization: `token ${account.access_token}`,
            },
          });

          if (orgsResponse.ok) {
            const orgs: Array<{ login: string }> = await orgsResponse.json();
            token.isAdmin = orgs.some(
              (org) => org.login.toLowerCase() === "appkom",
            );
          } else {
            token.isAdmin = false;
          }
        } catch (error) {
          console.error("Error fetching orgs in jwt callback:", error);
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
};
