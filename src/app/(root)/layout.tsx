import AppSideBar from '@/components/shared/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ViewModeProvider } from '@/context/view-mode-context'
import { publicRoutes } from '@/lib/routes'
import React from 'react'

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className='flex'>
            <SidebarProvider>
                <ViewModeProvider>
                    <AppSideBar items={publicRoutes} />
                    <main className="p-2 mt-10 md:mt-0 w-full">
                        {children}
                    </main>
                </ViewModeProvider>
            </SidebarProvider>
        </section>
    )
}

export default RootLayout