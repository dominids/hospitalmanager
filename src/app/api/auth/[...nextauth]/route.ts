import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const {email, password} = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({email});

                    if(!user){
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if(!passwordsMatch){
                        return null
                    }
                    
                    const sUser ={
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                    return sUser;
                } catch (error) {
                    console.log("Error ", error);
                }
            },
        }),
    ]
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }