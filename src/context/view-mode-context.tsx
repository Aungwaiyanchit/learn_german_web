// context/view-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ViewModeType = "grid" | "list";

type ViewModeContextType = {
    viewMode: ViewModeType;
    setViewMode: (view: ViewModeType) => void;
    toggleViewMode: () => void;
};

const ViewContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
    const [viewMode, setViewMode] = useState<ViewModeType>("grid");

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    };

    return (
        <ViewContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
            {children}
        </ViewContext.Provider>
    );
}

export function useViewMode() {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView must be used inside a ViewProvider");
    }
    return context;
}
