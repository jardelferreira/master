// DashboardLayout.tsx
import { PropsWithChildren } from 'react';
import Header from '@/pages/components/dashboard/Header';
import { Sidebar } from '@/pages/components/dashboard/Sidebar';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';
import { usePage } from '@inertiajs/react';
import { buildNavigation } from '@/pages/config/buildSidebarNavgation';
import { DashboardModalsProvider, useDashboardModals } from '@/pages/context/DashboardModalsContext';
import CreateProjectModal from '@/pages/components/projects/CreateProjectModal'

// Componente interno para ter acesso ao contexto já injetado
function DashboardInner({ children }: PropsWithChildren) {
    const { props } = usePage();
    const { createProjectOpen, closeCreateProject, openCreateProject } = useDashboardModals();
    const navigation = buildNavigation(props?.projects || [] as any, openCreateProject);

    return (
        <div className="flex min-h-screen bg-gradient-to-b to-gray-100 from-gray-200">
            <Sidebar navigation={navigation} />

            <div className="flex flex-1 flex-col">
                <Header />
                <FlashMessage />
                {children}
            </div>

            {/* Modal montado uma vez no layout — disponível em qualquer página */}
            <CreateProjectModal
                open={createProjectOpen}
                onClose={closeCreateProject}
            />
        </div>
    );
}

export default function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <DashboardModalsProvider>
            <DashboardInner>{children}</DashboardInner>
        </DashboardModalsProvider>
    );
}