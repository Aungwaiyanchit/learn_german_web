import { NextAuthConfig } from "next-auth";


export default {
    providers: [
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            const user = {
                id: token.id as string,
                username: token.username as string,
                email: session.user?.email || "", // keep email
                profile_image: session.user?.profile_image || "", // keep profile_image
            }
            return {
                ...session,
                user: user
            };
        }
    }
} satisfies NextAuthConfig;