'use client'

import axios from '@/lib/axios'
import { Avatar, Badge, Card, CardBody, Input, Link, Spinner } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import toast from 'react-hot-toast'
import Compressor from 'compressorjs'
import ButtonSubmit from '@/components/elements/button-submit/page'

export default function CardProfile() {
    const { data: session, status, update } = useSession()
    const [avatar, setAvatar] = React.useState<string | null>(null)
    const inputAvatar = React.useRef<HTMLInputElement>(null)
    const [changedAvatar, setChangedAvatar] = React.useState<File | null>(null)

    React.useEffect(() => {
        if (status === 'authenticated') {
            setAvatar(session?.user?.avatar)
        }
    }, [status])

    const handleChangeAvatar = (event: any) => {
        let reader = new FileReader()
        let file = event.target.files[0]

        new Compressor(file, {
            maxHeight: 800,
            maxWidth: 800,
            success: (compressedResult) => {
                reader.onloadend = () => {
                    setAvatar(reader.result)
                    const newFile = new File([compressedResult], compressedResult.name, { type: compressedResult.type })
                    setChangedAvatar(newFile)
                }
                reader.readAsDataURL(file)
            },
        });
    }

    const handleUpdateProfile = async (formData: FormData) => {
        changedAvatar && formData.append('avatar', changedAvatar)
        await axios.post('/participant/account/update_profile', formData)
            .then((response) => {
                update(response?.data?.data_customer)
                toast.success(response?.meta?.message)
            }).catch((error) => {
                toast.error(error?.response?.data?.meta?.message)
            })
    }

    return (
        <Card>
            <CardBody className='p-5'>
                {status === 'authenticated' ? (
                    <form action={handleUpdateProfile}>
                        <input type="file" ref={inputAvatar} hidden accept='image/*' onChange={handleChangeAvatar} />
                        <h1 className='mx-auto mb-2 font-medium text-default-600 text-lg'>Ubah Profil</h1>
                        <div className='space-y-5 mb-5'>
                            <div className="text-center">
                                <Badge placement='bottom-right' className='bg-warning-400 m-1' content={<Link onClick={() => inputAvatar?.current?.click()}><span className='text-background cursor-pointer mdi mdi-pencil'></span></Link>}>
                                    <Avatar
                                        isBordered
                                        className="w-24 h-24 transition-transform"
                                        color="default"
                                        src={avatar}
                                    />
                                </Badge>
                            </div>
                            <Input name='email' readOnly label='Email' defaultValue={session?.user?.email} />
                            <Input name='name' label='Nama' defaultValue={session?.user?.name} />
                            <Input name='phone_number' label='Nomor Telepom' defaultValue={session?.user?.phone_nummber} />
                        </div>
                        <ButtonSubmit label='Update Profile' />
                    </form>) : (
                    <Spinner className='m-auto' />
                )}
            </CardBody>
        </Card>
    )
}