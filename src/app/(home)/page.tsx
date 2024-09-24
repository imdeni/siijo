'use client'

import Alert from '@/components/elements/alert/page'
import axios from '@/lib/axios'
import { formatDate, formatTime } from '@/lib/helpers'
import { Avatar, Card, CardBody, Link, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = React.useState(true)
    const [activeClass, setActiveClass] = React.useState<any>(null)

    React.useEffect(() => {
        if (status === 'authenticated') {
            getActiveClass()
        }
    }, [status])

    const getActiveClass = async () => {
        setLoading(true)
        await axios.post('participant/training/get-active-classes', {
            participant_id: session?.user?.participant_id
        }).then(async (response: any) => {
            setActiveClass(response?.data?.active_training)
        }).catch((error: any) => {
        })
        setLoading(false)
    }


    return loading ? (
        <Loading />
    ) : (
        <div className='space-y-5'>
            <Card>
                <CardBody className='flex flex-row justify-between items-center p-5'>
                    <div className="flex flex-col">
                        <h1 className="text-cyan-500 text-lg">Selamat Datang,</h1>
                        <h1 className="font-medium text-default-600 text-xl">{session?.user?.name}</h1>
                    </div>
                    <Avatar
                        isBordered
                        className="transition-transform"
                        color="default"
                        name={session?.user?.name}
                        size="lg"
                        src={session?.user?.avatar || "/images/blank-avatar.jpg"}
                    />
                </CardBody>
            </Card>
            {!activeClass ? (
                <Card className='mb-5'>
                    <CardBody className='p-5'>
                        <p className="mx-auto text-default-400 text-sm">Anda tidak tergabung dalam kelas manapun.</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-2">
                    <p className='font-medium text-default-500 text-xl'>Jadwal Pelatihan</p>
                    {loading ? (
                        <Skeleton className='rounded-xl h-32' />
                    ) : (
                        <div className="rounded-xl overflow-auto">
                            <Table removeWrapper>
                                <TableHeader>
                                    <TableColumn>No</TableColumn>
                                    <TableColumn>Pelatihan</TableColumn>
                                    <TableColumn>Trainer</TableColumn>
                                    <TableColumn>Tanggal</TableColumn>
                                    <TableColumn>Waktu</TableColumn>
                                    <TableColumn>Tempat</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"Tidak ada jadwal pelatihan."} items={activeClass?.trx_training_days}>
                                    {activeClass?.trx_training_days?.map((item: any, index: any) => (
                                        <TableRow className={`${item.training_date == formatDate(new Date(), 'yyyy-MM-dd') ? 'bg-success-100' : 'bg-transparent'}`} key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{activeClass?.trx_training_schedule?.training_material?.item_name}</TableCell>
                                            <TableCell>{item?.mst_trainer?.name}</TableCell>
                                            <TableCell>{formatDate(item.training_date, 'PPPP')}</TableCell>
                                            <TableCell>{`${formatTime(item.start_time, 'HH:mm')} - ${formatTime(item.end_time, 'HH:mm')}`}</TableCell>
                                            <TableCell>{activeClass?.trx_training_schedule?.mst_training_location?.location_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

            )}
        </div>
    )
}

const Loading = () => {
    return (
        <div className="space-y-5">
            <Card>
                <CardBody className='flex flex-row justify-between items-center gap-5 p-5'>
                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className='rounded-lg w-full h-6' />
                        <Skeleton className='rounded-lg w-full h-10' />
                    </div>
                    <div>
                        <Skeleton className='flex rounded-full w-16 h-16' />
                    </div>
                </CardBody>
            </Card>
            <Skeleton className='rounded-xl h-32' />
        </div>
    )
}