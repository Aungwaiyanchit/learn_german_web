import React from 'react'

export default function AlphabetContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-auto flex flex-col items-center m-3 lg:min-w-[calc(100vw-19rem)]  bg-gradient-to-br from-slate-50 to-primary/20 rounded-xl shadow-lg p-4">
            {children}
        </div>
    )
}
