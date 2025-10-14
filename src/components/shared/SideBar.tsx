import { RouteItem } from '@/lib/routes';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger
} from '../ui/sidebar'
import { AppSideBarLink } from "@/components/shared/AppSideBarLink";
import UserNav from './UserNav';


const AppSideBar = ({ items }: { items: RouteItem[] }) => {
    return (
        <>
            {/*Desktop Sidebar*/}
            <Sidebar className='hidden md:block'>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Learn German</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <AppSideBarLink href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </AppSideBarLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <UserNav />
                </SidebarFooter>
            </Sidebar>

            {/*Mobile Topbar*/}
            <nav
                className="fixed md:hidden top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-sm">
                <div className="text-lg font-semibold">Learn German</div>
                <SidebarTrigger className="md:hidden" />
            </nav>
        </>

    )
}

export default AppSideBar