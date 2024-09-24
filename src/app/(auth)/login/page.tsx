'use client'

import ButtonSubmit from '@/components/elements/button-submit/page'
import axios from '@/lib/axios'
import { Button, Card, CardBody, Image, Input, Link } from '@nextui-org/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFormStatus } from 'react-dom'
import toast from 'react-hot-toast'

export default function Login() {
    const { data: session, status } = useSession()
    const { push } = useRouter()
    const { pending } = useFormStatus()
    const [showPassword, setShowPassword] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleSubmit = async (formData: FormData) => {

        const response = await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            device_id: navigator.userAgent,
            callbackUrl: '/',
            redirect: false
        })
        // console.log(response);

        if (response?.ok) {
            const userRole = await fetchUserRole() 
            handleRoleBasedRedirect(userRole)
            toast.success('Login berhasil')
        } else {
            toast.error('Username atau password salah')
        }
    }

    const fetchUserRole = async () => {
        try {
            const response = await fetch('https://sijo.vercel.app/sijo/api/auth/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
    
            const data = await response.json();
            console.log(data.user.role)
            return data.user.role; // Adjust based on the actual structure of the response
        } catch (error) {
            console.error('Error fetching user role:', error);
            return null;
        }
    }
    
    

    const handleRoleBasedRedirect = (role: number ) => {
        console.log(role)
        switch (role) {
            case 1:
                push('/admin')
                break
            case 0:
                push('/')
                break
            // default:
            //     push('/')
            //     break
        }
    }

    return (
        <div className='flex flex-col justify-center items-center space-y-5 p-5 min-h-screen'>
            <Image src='/images/logo.png' className='h-2w-28 w-28' alt='logo' />
            <Card className='p-2 md:p-5 w-full sm:max-w-md'>
                <CardBody>
                    <div className="mb-5">
                        <h1 className='font-semibold text-2xl text-center text-default-600'>Selamat datang</h1>
                        <p className='text-center text-default-400'>Silakan masuk untuk melanjutkan</p>
                    </div>
                    <form className="flex flex-col gap-y-5 mb-2" action={handleSubmit}>
                        <Input
                            name='email'
                            className='text-xl'
                            type="email"
                            label="Email"
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
                        <ButtonSubmit label='Masuk' />
                    </form>
                    <p className='text-center text-default-500 text-sm'>Belum punya akun? <Link href='/register' className='text-sm'>Daftar Disini</Link> </p>
                    <p className='text-center text-default-500 text-sm'>Ingin daftar pelatihan? <Link href='/pendaftaran' className='text-sm'>Daftar Disini</Link> </p>
                </CardBody>
            </Card>
            <p className='text-xs lg:text-sm'>{`Copyright © ${new Date().getFullYear()} Sinau Jogja. All Rights Reserved`}</p>
        </div>
    )
}
