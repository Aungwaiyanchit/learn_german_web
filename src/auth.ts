import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./app/lib/prisma";
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { signInSchema } from "./lib/definitions";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        email: string;
        profile_image: string;
    }

    interface Session {
        user: User & DefaultSession["user"];
    }
}

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials) {
                let user = null;
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)
                    user = await prisma.user.findUnique({
                        where: { email: email },
                    });

                    if (!user) {
                        return null;
                    }

                    const isValidPassword = user.password && await bcrypt.compare(password as string, user.password);

                    if (!isValidPassword) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        username: user.username ?? "",
                        profile_image: user.profile_image ?? "",
                    };

                } catch (error) {
                    throw error;
                }
            },
        })
    ]
})
