"use client"

import { Image, ImageProps } from '@nextui-org/react'
import React from 'react'

export default function Logo(props: ImageProps) {
    return (
        <Image src='/images/logo-new.png' alt="logo" {...props} />
    )
}
