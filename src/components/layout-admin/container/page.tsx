import React from 'react'

export default function Container({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='mx-auto p-6 max-w-5xl min-h-screen'>
            {children}
        </div>
    )
}
