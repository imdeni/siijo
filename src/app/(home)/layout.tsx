import Container from '@/components/layouts/container/page'
import Navbar from '@/components/layouts/navbar/page'
import React from 'react'

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Navbar />
            <Container>
                {children}
            </Container>
            <footer className='p-3'>
                <p className='text-center text-xs lg:text-sm'>{`Copyright © ${new Date().getFullYear()} Sinau Jogja. All Rights Reserved`}</p>
            </footer>
        </div>
    )
}
