import NextAuth, { DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            provider?: string;
            name?: string;
            email?: string;
            image?: string;
        } & DefaultSession["user"];
    }

    interface User {
        _id?: string;
        provider?: string;
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
