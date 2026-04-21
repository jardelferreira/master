// contexto do modal
import { createContext, useContext, useState, ReactNode } from 'react';

type DashboardModalsContextType = {
    createProjectOpen: boolean;
    openCreateProject: () => void;
    closeCreateProject: () => void;
};

const DashboardModalsContext = createContext<DashboardModalsContextType | null>(null);

export function DashboardModalsProvider({ children }: { children: ReactNode }) {
    const [createProjectOpen, setCreateProjectOpen] = useState(false);

    return (
        <DashboardModalsContext.Provider value={{
            createProjectOpen,
            openCreateProject:  () => setCreateProjectOpen(true),
            closeCreateProject: () => setCreateProjectOpen(false),
        }}>
            {children}
        </DashboardModalsContext.Provider>
    );
}

export function useDashboardModals() {
    const ctx = useContext(DashboardModalsContext);
    if (!ctx) throw new Error('useDashboardModals deve ser usado dentro de DashboardModalsProvider');
    return ctx;
}