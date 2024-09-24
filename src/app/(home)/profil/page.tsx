'use client'

import { Avatar, Badge, Button, Card, CardBody, Input, Skeleton, Spinner } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React, { use } from 'react'
import { useFormStatus } from 'react-dom'
import Compressor from 'compressorjs';
import axios from '@/lib/axios'
import toast from 'react-hot-toast'
import CardProfile from '@/components/pages/profil/card-profile/page'
import CardPassword from '@/components/pages/profil/card-password/page'


export default function Profil() {
    return (
        <div>
            <h1 className='mb-5 font-semibold text-default-500 text-xl'>Profil</h1>
            <div className="items-start gap-5 grid md:grid-cols-2">
                <CardProfile />
                <CardPassword />
            </div>
        </div>
    )
}
