"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    return (
        <LogOut onClick={() => signOut({ callbackUrl: "/" })} />
    );
}
