import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import { generateUsername } from "@/lib/username";

interface UserProfile {
    _id: string;
    name: string;
    username: string;
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

            let dbUser = await User.findOne({
                email: user.email,
            });

            if (!dbUser) {
                const username = await generateUsername(
                    user.name ?? "user"
                );

                dbUser = await User.create({
                    name: user.name,
                    username,
                    email: user.email,
                    image: user.image,
                });
            }

            if (!dbUser.username) {
                dbUser.username = await generateUsername(
                    dbUser.name ?? "user"
                );

                await dbUser.save();
            }

            (user as UserProfile)._id = dbUser._id.toString();
            (user as UserProfile).username = dbUser.username;
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const userProfile = user as UserProfile;

                token.id = userProfile._id;
                token.name = userProfile.name;
                token.username = userProfile.username;
                token.email = userProfile.email;
                token.image = userProfile.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
};
