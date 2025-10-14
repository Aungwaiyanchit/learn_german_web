"use client";

import { useSession } from "next-auth/react";

const UserDisplay = () => {
    const { data: session } = useSession();
    console.log(session);
    return (
        <>
            {session?.user?.email}
            {session?.user?.username}
        </>
    )
}

export default UserDisplay