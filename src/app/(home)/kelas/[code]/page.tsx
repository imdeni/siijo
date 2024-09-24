'use client'

import Rating from '@/components/elements/rating/page'
import axios from '@/lib/axios'
import { formatTime } from '@/lib/helpers'
import { Card, CardBody, Image, Link, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function DetailKelas({ params }: { params: { code: string } }) {
    const { data: session, status } = useSession()
    const [loading, setLoading] = React.useState(true)
    const [historyClass, setHistoryClass] = React.useState<any>([])

    React.useEffect(() => {
        if (status === 'authenticated') {
            getHistoryClass()
        }
    }, [status])

    const getHistoryClass = async () => {
        setLoading(true)
        await axios.post('participant/training/detail-class', {
            participant_id: session?.user?.participant_id,
            class_code: params.code
        }).then((response: any) => {
            setHistoryClass(response?.data?.training_schedule)
        }).catch((error: any) => {
        })
        setLoading(false)
    }

    return loading ? (
        <div className="space-y-5">
            {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className='rounded-xl h-64' />
            ))}
        </div>
    ) : (
        <div className="space-y-5">
            <Card>
                <CardBody className='flex flex-row'>
                    <Link href={historyClass?.training_material?.picture} target='_blank' className='' >
                        <Image src={historyClass?.training_material?.picture || '/images/blank-image.jpg'} alt={historyClass?.training_material?.item_name} className='w-24 h-24 aspect-square object-cover' />
                    </Link>
                    <div className='space-y-2 lg:space-y-0 p-3'>
                        <p className='text-default-500 text-sm lg:text-base leading-4'>
                            {`${formatDate(historyClass?.trx_training_days?.[0]?.training_date, 'PPPP')} - ${formatDate(historyClass?.trx_training_days?.[historyClass?.trx_training_days?.length - 1]?.training_date, 'PPPP')}`}
                        </p>
                        <h1 className='font-semibold text-lg lg:text-xl leading-5'>{historyClass?.training_material?.item_name}</h1>
                    </div>
                </CardBody>
            </Card>
            <div className="gap-5 grid grid-cols-1 lg:grid-cols-3">
               
                <div className="flex flex-col">
                    {historyClass?.training_link ? (
                        <Card className='h-24' as={Link} href={historyClass?.training_link} target='_blank' >
                            <CardBody className='flex flex-row items-center p-0'>
                                <div className="flex bg-foreground-500 rounded-xl w-24 h-24">
                                    <span className='m-auto text-5xl text-default-100 mdi mdi-folder-google-drive'></span>
                                </div>
                                <h4 className="px-5 py-3 font-semibold text-xl">Dokumentasi</h4>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card className='h-24'>
                            <CardBody>
                                <p className="m-auto text-default-400">Tidak ada dokumentasi.</p>
                            </CardBody>
                        </Card>
                    )}
                </div>
             
            </div>
            <div className="flex flex-col">
                <p className='mb-2 font-medium text-default-500 text-xl'>Jadwal Pelatihan</p>
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
                        <TableBody emptyContent={"Tidak ada jadwal pelatihan."} items={historyClass?.trx_training_days}>
                            {historyClass?.trx_training_days?.map((item: any, index: any) => (
                                <TableRow className={`${item.training_date == formatDate(new Date(), 'yyyy-MM-dd') ? 'bg-success-100' : 'bg-transparent'}`} key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{historyClass?.training_material?.item_name}</TableCell>
                                    <TableCell>{item?.mst_trainer?.name}</TableCell>
                                    <TableCell>{formatDate(item.training_date, 'PPPP')}</TableCell>
                                    <TableCell>{`${formatTime(item.start_time, 'HH:mm')} - ${formatTime(item.end_time, 'HH:mm')}`}</TableCell>
                                    <TableCell>{historyClass?.mst_training_location?.location_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col">
                <p className='mb-2 font-medium text-default-500 text-xl'>Ulasan</p>
                <Card>
                    {historyClass?.participant_feedbacks ? (
                        <CardBody className='flex flex-col gap-3'>
                            <div className="flex flex-col gap-2">
                                <p className='mx-auto font-medium text-lg'>Rating</p>
                                <div className="flex flex-col gap-3 lg:gap-1">
                                    {historyClass?.participant_feedbacks?.map((feedback: any) => (
                                        feedback?.mst_form_question?.question_type === 'star' && (
                                            <div key={feedback?.id} className="flex lg:flex-row flex-col lg:justify-between lg:items-center">
                                                <p>{feedback?.mst_form_question?.question_title}</p>
                                                <Rating readonly size='2xl' value={parseInt(feedback?.answer)} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-col gap-2">
                                <p className='mx-auto font-medium text-lg'>Kritik atau Saran</p>
                                <div className="flex flex-col gap-3 lg:gap-1">
                                    {historyClass?.participant_feedbacks?.map((feedback: any) => (
                                        feedback?.mst_form_question?.question_type === 'textarea' && feedback?.answer && (
                                            <p key={feedback?.id}>{feedback?.answer}</p>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    ) : (
                        <CardBody>
                            <p className="mx-auto text-default-400">Tidak ada ulasan.</p>
                        </CardBody>
                    )}
                </Card>
            </div>
        </div>
    )
}
