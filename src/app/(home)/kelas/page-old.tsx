'use client'

import axios from '@/lib/axios'
import { formatDate } from '@/lib/helpers'
import { Card, CardBody, Image, Link, Skeleton } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function Kelas() {
    const { data: session, status } = useSession()
    const [activeClass, setActiveClass] = React.useState(null)
    const [historyClass, setHistoryClass] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (status === 'authenticated') {
            getClass()
        }
    }, [status])

    const getClass = async () => {
        setLoading(true)
        await axios.post('participant/training/get-active-classes', {
            participant_id: session?.user?.participant_id
        }).then((response: any) => {
            setActiveClass(response?.data?.active_training)
        }).catch((error: any) => {
            if (error?.response?.status === 404) {
                setActiveClass(null)
            }
        })
        await axios.post('/participant/training/get-finished-classes', {
            participant_id: session?.user?.participant_id
        }).then((response: any) => {
            setHistoryClass(response?.data?.training_list)
        }).catch((error: any) => {
        })
        setLoading(false)
    }

    return (
        <div className='space-y-5'>
            {loading ? (<Loading />) : (
                <div>
                 <a href="/images/Nanda_Ilham_Saputra.pdf" download className="pdf-download-link"></a>
                    {activeClass && (
                        <>
                            <h1 className='mb-2 font-medium text-default-600 text-xl'>Kelas Aktif</h1>
                            <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {loading ? (
                                    <Skeleton className='rounded-xl h-28' />
                                ) : (
                                    <Card as={Link} href={`/kelas/${activeClass?.training_schedule_code}`}>
                                        <Image
                                            alt="picture"
                                            className="rounded-b-none w-full h-full aspect-square object-cover"
                                            src={activeClass?.trx_training_schedule?.training_material?.picture || '/images/blank-image.jpg'}
                                        />
                                        <CardBody className='p-5'>
                                            <p className="mb-1 font-medium text-default-400 text-xs">{`${formatDate(activeClass?.trx_training_days?.[0]?.training_date, 'PPPP')} - ${formatDate(activeClass?.trx_training_days?.[activeClass?.trx_training_days?.length - 1]?.training_date, 'PPPP')}`}</p>
                                            <h4 className="font-medium">{activeClass?.trx_training_schedule?.training_material?.item_name}</h4>
                                        </CardBody>
                                    </Card>

                                )}
                            </div>
                        </>
                    )}
                    {historyClass.length > 0 && (
                        <>
                            <h1 className='mb-2 font-medium text-default-600 text-xl'>Riwayat Kelas</h1>
                            <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {loading ? (
                                    <Skeleton className='rounded-xl h-28' />
                                ) : (

                                    historyClass.map((item: any, index: number) => (
                                        <Card key={item?.id} as={Link} href={`/kelas/${item.training_schedule_code}`}>
                                            <Image
                                                alt="picture"
                                                className="rounded-b-none w-full h-full aspect-square object-cover"
                                                src={item?.trx_training_schedule?.training_material?.picture || '/images/blank-image.jpg'}
                                            />
                                            <CardBody className='p-5'>
                                                <p className="mb-1 font-medium text-default-400 text-xs">{`${formatDate(item.trx_training_days?.[0]?.training_date, 'PPPP')} - ${formatDate(item.trx_training_days?.[item.trx_training_days?.length - 1]?.training_date, 'PPPP')}`}</p>
                                                <h4 className="font-medium">{item.trx_training_schedule?.training_material?.item_name}</h4>
                                            </CardBody>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            )
            }
            
<style jsx>{`
.pdf-download-link {
    display: block;
    width: 200px;  /* Set the width of the image */
    height: 250px;  /* Set the height of the image */
    background-image: url('/images/Nanda_Ilham_Saputra.jpg'); /* Use an image to represent the PDF */
    background-size: cover;
    background-position: center;
    border-radius: 10px; /* Optional: add rounded corners */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    position: relative;
}

.pdf-download-link::before {
    content: "Download PDF"; /* Text overlay for accessibility */
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    font-size: 14px;
    border-radius: 0 0 10px 10px;
}

.pdf-download-link:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
}
`}</style>
        </div >
    )
}

const Loading = () => {
    return (
        <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
                <Card key={index}>
                    <Skeleton className='aspect-square' />
                    <CardBody className='space-y-3 p-5'>
                        <Skeleton className='rounded-lg h-6' />
                        <Skeleton className='rounded-lg h-12' />
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}
