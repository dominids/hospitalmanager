import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    location?: string;
  }

  interface Session {
    user: {
      role?: string;
      location?: string;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    location?: string;
  }
}

interface Item {
  _id: string;
  name: string;
  __v?: number;
}

interface Appliance extends Item {
  inventoryNumber: number;
  model: string;
  appliance: string;
  notes: string;
  event: {
    name?: string;
    endDate?: Date;
    eventDescription?: string;
  };
}

interface Appliance2 extends Item {
  createdAt: Date;
  updatedAt: Date;
  buyDate: Date;
  guaranteeDate: Date;
  reviewDate: Date;
  serialNumber: string;
  location: string;
  manufacturer: string;
  provider: string;
  worth: string;
}

interface ApplianceExtended extends Appliance, Appliance2 {}
