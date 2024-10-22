import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/../../lib/mongodb";
import User from "@/../../models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });
                    console.log(user);

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.log("Error ", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.location = user.location;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.location = token.location;
            }
            return session;
        },
    },
};