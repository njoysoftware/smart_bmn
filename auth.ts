import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts"
import { LoginSchema } from "./lib/zod"

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/(auth)/login",
  },
  providers: [CredentialsProvider
    ({
    name: "Credentials",
    credentials: {
      email: {},
      password: {}
    },
    async authorize(credentials) {
      const result = LoginSchema.safeParse(credentials);

      if (!result.success) {
       return null;
     }

      const { email , password } = result.data;
      const User = await prisma.user.findUnique({
        where: {email}
      });

      if (!User || !User.password) {
          return null;
      }

      const isMatch = compareSync(password as string, User.password);
      if (!isMatch) {
        return null;
      }
     return {
          id: User.id,
          name: User.name,
          email: User.email,
          role: User.role,
        };
    }
  })
],
  callbacks: {
    authorized({ auth, request:{nextUrl} }) {
      const isAuth = !!auth?.user;
      const protetedRoutes = ["/dashboard","/barang","/settings"];

      if (protetedRoutes.includes(nextUrl.pathname) && !isAuth) {
        return Response.redirect(new URL("/login", nextUrl.origin));
      }
      
      if (isAuth && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      } 
      return session;
    }
  },
});