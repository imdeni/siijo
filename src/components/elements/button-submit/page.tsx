import { Button, ButtonProps } from '@nextui-org/react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export default function ButtonSubmit({ label }: { label: string } & ButtonProps) {
    const { pending } = useFormStatus()
    return (
        <Button className='bg-sky-600 mt-auto w-full text-background' type='submit' isLoading={pending}>{label}</Button>
    )
}
