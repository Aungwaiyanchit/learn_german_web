"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

type Props = {
    children?: React.ReactNode;
    session: SessionProviderProps["session"];
};

const AuthProvider = ({ children, session  }: Props) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>  
    )
}

export default AuthProvider