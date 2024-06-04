import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }

  interface Session {
    user: {
      role?: string;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

interface Item {
  _id: string;
  name: string;
  __v: number;
}