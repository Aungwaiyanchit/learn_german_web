import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { auth } from '@/auth'
import { SignOutButton } from '../features/auth/SignoutButton';

async function UserNav() {
    const session = await auth();
    const user = session?.user;
    return (
        <SidebarMenu>
            <SidebarMenuItem className='py-2'>
                <SidebarMenuButton>
                    <Avatar className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <AvatarFallback className="rounded-lg text-white">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.username}</span>
                        <span className="text-muted-foreground truncate text-xs">
                            {user?.email}
                        </span>
                    </div>
                    <SignOutButton />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default UserNav