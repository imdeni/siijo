'use client'

import ButtonSubmit from '@/components/elements/button-submit/page'
import axios from '@/lib/axios'
import { Button, Card, CardBody, Image, Input, Link } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFormStatus } from 'react-dom'
import toast from 'react-hot-toast'

export default function PendaftaranUmum() {
    const { push } = useRouter()
    const { pending } = useFormStatus()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
    
        // Log form data entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await axios.post('/pendaftaran_umum', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            toast.success('Pendaftaran berhasil, terima kasih!');
            push('/login'); // Redirect to a success page
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Pendaftaran gagal, coba lagi!');
        }
    };
    const gotoInstansi = () => {
        push('/pendaftaran2')
    }
    const gotologin = () => {
        push('/login')
    }
    return (
        <div className='flex flex-col justify-center items-center space-y-5 p-5 min-h-screen'>
            <Image src='/images/logo.png' className='h-28 w-28' alt='logo' />
            <Card className='p-2 md:p-5 w-full sm:max-w-md'>
                <CardBody>
                    <div className="mb-5">
                        <h1 className='font-semibold text-2xl text-center text-default-600'>Pendaftaran Umum</h1>
                        <p className='text-center text-default-400' onClick={gotoInstansi}>Klik disini untuk pendaftaran instansi..</p>
                    </div>
                    <form className="grid grid-cols-2 gap-5 mb-2" onSubmit={handleSubmit}>
                        <Input
                            name='nama_peserta'
                            className='text-xl'
                            type="text"
                            label="Nama Peserta"
                            required
                        />
                        <Input
                            name='email'
                            className='text-xl'
                            type="email"
                            label="Email"
                            required
                        />
                        <Input
                            name='nomor_hp'
                            className='text-xl'
                            type="text"
                            label="Nomor HP"
                            required
                        />
                        <Input
                            name='alamat_peserta'
                            className='text-xl'
                            type="text"
                            label="Alamat Peserta"
                            required
                        />
                        <Input
                            name='nomor_ktp'
                            className='text-xl'
                            type="text"
                            label="Nomor KTP"
                            required
                        />
                        <Input
                            name='pendidikan_terakhir'
                            className='text-xl'
                            type="text"
                            label="Pendidikan Terakhir"
                            required
                        />
                        <Input
                            name='materi'
                            className='text-xl'
                            type="text"
                            label="Materi"
                            required
                        />
                        <Input
                            name='periode'
                            className='text-xl'
                            type="text"
                            label="Periode"
                            required
                        />
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <Button onClick={gotologin}>Login</Button>
                            <ButtonSubmit label='Simpan' />
                        </div>
                    </form>
                </CardBody>
            </Card>
            <p className='text-xs lg:text-sm'>{`Copyright © ${new Date().getFullYear()} Sinau Jogja. All Rights Reserved`}</p>
        </div>
    )
}
