// global.d.ts
import { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface User extends NextAuthUser {
    role: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
