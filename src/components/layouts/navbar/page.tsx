'use client'

import React from 'react'
import { Button, Image, Navbar as NavbarContainer, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Link, Dropdown, DropdownTrigger, DropdownMenu, Avatar, DropdownItem } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import Logo from '@/components/elements/logo/page';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        { name: 'Dashboard', url: '/', is_active: pathname === '/' },
        { name: 'Kelas Saya', url: '/kelas', is_active: pathname.startsWith('/kelas') },
        { name: 'Uji Kompetensi', url: '/souvenir', is_active: pathname.startsWith('/souvenir') },
        { name: 'Feedback', url: '/feedback', is_active: pathname.startsWith('/feedback') },
    ]

    return (
        <NavbarContainer isBordered onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <Link href="/" className="">
                    <NavbarBrand>
                        <Logo className="rounded-none w-full h-8 object-cover" />
                    </NavbarBrand>
                </Link>
            </NavbarContent>
            <NavbarContent className="sm:flex gap-4 hidden" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item.name}-${index}`} >
                        <Link href={item.url} className={item.is_active ? 'text-cyan-600' : "text-default-500"}>{item.name}</Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="default"
                            name="Jason Hughes"
                            size="sm"
                            src={session?.user?.avatar || "/images/blank-avatar.jpg"}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings" href='/profil'>Profil</DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={() => signOut({ callbackUrl: "/login" })}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className={`w-full p-2 ${item.is_active ? 'text-primary-600' : 'text-default-600'}`}
                            href={item.url}
                        >
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </NavbarContainer>
    )
}
