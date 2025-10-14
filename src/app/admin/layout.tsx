import AppSideBar from '@/components/shared/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { adminRoutes } from '@/lib/routes'
import React from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className='flex'>
            <SidebarProvider>
                <AppSideBar items={adminRoutes} />
                <main className="p-4 mt-10 md:mt-0 w-full">
                    {children}
                </main>
            </SidebarProvider>
        </section>
    )
}

export default AdminLayout