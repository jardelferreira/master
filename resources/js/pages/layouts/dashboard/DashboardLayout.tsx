import { PropsWithChildren, useState } from 'react'
import Header from '@/pages/components/dashboard/Header'
import { LucideIcon, Home, Users } from 'lucide-react'
import { Sidebar } from '@/pages/components/dashboard/Sidebar'
import { usePage } from '@inertiajs/react'
import type {PageProps} from '@/types/inertia.d'
import { navigation } from '@/pages/config/SidebarDashboard'

export default function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-base-50 flex">

            <Sidebar navigation={navigation}/>
            {/* Main */}
            <div className="flex-1 flex flex-col">
                <Header />
                {children}
            </div>
        </div>
    )
}
