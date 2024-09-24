'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { setDefaultOptions } from 'date-fns';
import { id } from 'date-fns/locale'

export function Providers({ children }: { children: React.ReactNode }, { session }: { session: any }) {
    setDefaultOptions({
        locale: id
    })

    return (
        <SessionProvider session={session}>
            <NextUIProvider>
                <NextThemesProvider attribute='class' defaultTheme='system'>
                    <Toaster />
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </SessionProvider>
    )
}