import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    image: string | null;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            await connectDB();

            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });
            }
            (user as UserProfile)._id = (existingUser!._id as mongoose.Types.ObjectId).toString();
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const userProfile = user as UserProfile;

                token.id = userProfile._id;
                token.name = userProfile.name;
                token.email = userProfile.email;
                token.image = userProfile.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
};
