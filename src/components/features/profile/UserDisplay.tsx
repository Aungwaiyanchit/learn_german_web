
import { auth } from "@/auth";

const UserDisplay = async () => {
    const  session = await auth();
    return (
        <>
            {session?.user?.email}
            {session?.user?.username}
        </>
    )
}

export default UserDisplay
