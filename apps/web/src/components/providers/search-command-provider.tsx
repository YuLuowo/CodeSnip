"use client"

import * as React from "react"

interface SearchCommandContextValue {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchCommandContext = React.createContext<SearchCommandContextValue | undefined>(undefined);

export function SearchCommandProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    return (
        <SearchCommandContext.Provider value={{ open, setOpen }}>
            {children}
        </SearchCommandContext.Provider>
    )
}

export function useSearchCommand() {
    const context = React.useContext(SearchCommandContext);

    if (!context) {
        throw new Error("useSearchCommand must be used within a SearchCommandProvider");
    }

    return context;
}
