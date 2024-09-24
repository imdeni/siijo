'use client'

import ButtonSubmit from '@/components/elements/button-submit/page'
import axios from '@/lib/axios'
import { Button, Card, CardBody, Image, Input, Link } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFormStatus } from 'react-dom'
import toast from 'react-hot-toast'

export default function Register() {
    const { push } = useRouter()
    const { pending } = useFormStatus()
    const [showPassword, setShowPassword] = React.useState(false)

    const handleSubmit = async (formData: FormData) => {
        await axios.post('/auth/register-participant', formData)
            .then((response: any) => {
                toast.success('Registrasi berhasil, silakan login')
                push('/login')
            }).catch((error: any) => {
                toast.error(error?.response?.data?.meta?.message)
            })
    }

    return (
        <div className='flex flex-col justify-center items-center space-y-5 p-5 min-h-screen'>
            <Image src='/images/logo.png' className='h-2w-28 w-28' alt='logo' />
            <Card className='p-2 md:p-5 w-full sm:max-w-md'>
                <CardBody>
                    <div className="mb-5">
                        <h1 className='font-semibold text-2xl text-center text-default-600'>Selamat datang</h1>
                        <p className='text-center text-default-400'>Silakan daftar untuk melanjutkan</p>
                    </div>
                    <form className="flex flex-col gap-y-5 mb-2" action={handleSubmit}>
                        <Input
                            name='email'
                            className='text-xl'
                            type="email"
                            label="Email"
                        />
                        <Input
                            name='class_code'
                            className='text-xl'
                            type="text"
                            label="Kode Kelas"
                        />
                        <Input
                            name='password'
                            className='text-xl'
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <span className="text-default-400 text-xl mdi mdi-eye-off"></span>
                                    ) : (
                                        <span className="text-default-400 text-xl mdi mdi-eye"></span>
                                    )}
                                </button>
                            }
                        />
                        <ButtonSubmit label='Daftar' />
                    </form>
                    <p className='text-center text-default-500 text-sm'>Sudah punya akun? <Link href='/login' className='text-sm'>Masuk Disini</Link> </p>
                </CardBody>
            </Card>
            <p className='text-xs lg:text-sm'>{`Copyright © ${new Date().getFullYear()} Sinau Jogja. All Rights Reserved`}</p>
        </div>
    )
}
