'use client'

import Link from "next/link";
import {useSidebar} from "@/components/ui/sidebar";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

type SidebarProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function AppSideBarLink({href, children, className}: SidebarProps) {
    const {setOpenMobile,} = useSidebar();
    const currentPath = usePathname();
    const isActive = currentPath === href;
    return (
        <Link className={cn(className, !isActive ? "text-black" : "text-primary")} href={href} onClick={() => {
            setOpenMobile(false)
        }}>
            {children}
        </Link>
    )
}