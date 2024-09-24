'use client'
import ButtonSubmit from '@/components/elements/button-submit/page'
import axios from '@/lib/axios'
import { Button, Card, CardBody, Image, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default function Pendaftaran() {
    const { push } = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
    
        // Log form data entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await axios.post('/pendaftaran_instansi', formData, {
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

    const gotoUmum = () => {
        push('/pendaftaran')
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
                        <h1 className='font-semibold text-2xl text-center text-default-600'>Pendaftaran Instansi</h1>
                        <p className='text-center text-default-400' onClick={gotoUmum}>Klik disini untuk pendaftaran umum..</p>
                    </div>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5" onSubmit={handleSubmit}>
                        <Input
                            name='nama_instansi'
                            className='text-xl'
                            type="text"
                            label="Nama instansi"
                        />
                        <Input
                            name='alamat_instansi'
                            className='text-xl'
                            type="text"
                            label="Alamat instansi"
                        />
                        <Input
                            name='no_npwp_instansi'
                            className='text-xl'
                            type="text"
                            label="No NPWP Instansi"
                        />
                        <Input
                            name='nama_npwp'
                            className='text-xl'
                            type="text"
                            label="Nama NPWP"
                        />
                        <Input
                            name='alamat_npwp'
                            className='text-xl'
                            type="text"
                            label="Alamat NPWP"
                        />
                        <Input
                            name='nama_peserta'
                            className='text-xl'
                            type="text"
                            label="Nama peserta"
                        />
                        <Input
                            name='email'
                            className='text-xl'
                            type="email"
                            label="Email"
                        />
                        <Input
                            name='nomor_hp'
                            className='text-xl'
                            type="tel"
                            label="Nomor HP"
                        />
                        <Input
                            name='materi'
                            className='text-xl'
                            type="text"
                            label="Materi"
                        />
                        <Input
                            name='periode'
                            className='text-xl'
                            type="text"
                            label="Periode"
                        />
                        {/* Submit Button */}
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <Button onClick={gotologin}>Login</Button>
                            <ButtonSubmit label='Simpan' />
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}
